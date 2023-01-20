package servlet.restapi;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import account.User;
import dao.DAOFactory;
import dao.EventDAO;
import dao.HostDAO;
import dao.TicketDAO;
import data.Event;
import data.Host;
import data.Ticket;
import exception.MyServletException;
import servlet.common.MyHttpServlet;
import servlet.common.ServletStatus;
import servlet.util.EventParser;
import servlet.util.MyParser;
import servlet.util.RequestParser;
import util.DateUtil;

public class EventAPI extends MyHttpServlet {
	private static final long serialVersionUID = -930258803600030324L;

	private static EventDAO dao = DAOFactory.create(EventDAO.class);
	{
		dao.close();
	}
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String uri = request.getRequestURI();
		switch(uri) {
		case "/event/main":
			sendMainList(response);
			break;
		case "/event/search":
			sendSearchList(request, response);
			break;
		case "/event/list":
			sendEventList(request, response);
			break;
		case "/event/info":
			sendEventInfomation(request, response);
			break;
		default:
			throw MyServletException.NOT_IMPLEMENTED;
		}
	}
	
	private void sendMainList(HttpServletResponse response) throws IOException {
		dao.open();
		
		ArrayList<Event> recommendation = dao.getRecommendationList(1);
		if(recommendation == null) throw new MyServletException(ServletStatus.NOT_FOUND, "recommendation");
		
		ArrayList<Event> recency = dao.getRecencyList(1);
		if(recency == null) throw new MyServletException(ServletStatus.NOT_FOUND, "recency");
		
		ArrayList<Event> online = dao.getOnlineList(1);
		if(online == null) throw new MyServletException(ServletStatus.NOT_FOUND, "online");
		
		ArrayList<Event> imminent = dao.getImminentList(1);
		if(imminent == null) throw new MyServletException(ServletStatus.NOT_FOUND, "imminent");
		
		ArrayList<Event> free = dao.getFreeList(1);
		if(free == null) throw new MyServletException(ServletStatus.NOT_FOUND, "free");

		dao.close();
		
		Map<String, List<Event>> eventMap = new HashMap<>();
		eventMap.put("recommendation", recommendation);
		eventMap.put("recency", recency);
		eventMap.put("online", online);
		eventMap.put("imminent", imminent);
		eventMap.put("free", free);
		
		printJson(response, eventMap);
	}
	
	private void sendSearchList(HttpServletRequest request, HttpServletResponse response) throws IOException {
		MyParser parser = new MyParser(request, true);
		
		String keyword = parser.get("keyword");
		Boolean isOnline = parser.getBoolean("isOnline");
	    Event.Genre[] genres = parser.getArray("genre", Event.Genre::valueOf, Event.Genre[]::new);
	    Event.Category[] categories = parser.getArray("category", Event.Category::valueOf, Event.Category[]::new);
	    Boolean isFree = parser.getBoolean("isFree");
		
		User user = (User) request.getSession().getAttribute("user");
		dao.open();
		HashMap<String, Object> map = dao.search(1, keyword, isOnline, genres, categories, isFree, (user == null ? "" : user.getUUID()));
		dao.close();
		if(map == null) throw MyServletException.NOT_FOUND;
		
		printJson(response, map);
	}
	
	private void sendEventList(HttpServletRequest request, HttpServletResponse response) throws IOException {
		MyParser parser = new MyParser(request);
		int page = parser.getInt("page");
		
		dao.open();
		ArrayList<Event> list = dao.getEventList(page);
		dao.close();
		if(list == null) {
			throw new MyServletException(ServletStatus.NOT_FOUND, "events");
		} else if(list.size() > 0) {
			printJson(response, list);
		} else {
			response.setStatus(HttpServletResponse.SC_NO_CONTENT);
		}
	}
	
	private void sendEventInfomation(HttpServletRequest request, HttpServletResponse response) throws IOException {
		MyParser parser = new MyParser(request);
		String eventID = parser.get("eventID");
		
		dao.open();
		Map<String, Object> map = dao.getEventDetail(eventID);
		dao.close();
		if(map == null) throw new MyServletException(ServletStatus.NOT_FOUND, "event");
		
		Event event = (Event) map.get("event");
		event.setHost(null);
		event.setHostName(null);
		event.setParticipants(null);
		event.setTicketPrices(null);
		event.setUpdateDateTime(null);
		event.setGeneratedDateTime(null);
		
		map.remove("host");
		
		printJson(response, map);
	}
	
	@Override
	protected void doPatch(HttpServletRequest request, HttpServletResponse response) throws IOException {
		User user = getUser(request);
		
		processDAO(EventDAO.class, eventDAO -> {
			EventParser parser = new EventParser(request, true);
			
			Event event = parser.parseEvent();
			
			Event origin = eventDAO.get(event.getID());
			if(origin == null) throw new MyServletException(ServletStatus.NOT_FOUND, "event");
			
			// 오류 보낼까 자동 설정할까 고민하다가, 어차피 웹에서 1차 거르기때문에, null로 설정하여 바꾸지 않도록 결정
			if(DateUtil.wasExpired(origin.getDateTimeStart())) event.setDateTimeStart(null);
			if(DateUtil.wasExpired(origin.getDateTimeEnd())) event.setDateTimeEnd(null);
			
			HostDAO hostDAO = DAOFactory.convert(eventDAO, HostDAO.class);
			Host host = hostDAO.get(origin.getHost());
			if(host == null) throw new MyServletException(ServletStatus.NOT_FOUND, "host");
			if(!host.containMember(user.getUUID())) throw MyServletException.FORBIDDEN;
			
			String coverPath = parser.parseCoverImage();
			if(coverPath != null) {
				coverPath = ImageAPI.upload(request, ImageAPI.EVENT_ROOT, coverPath);
				event.setCoverPath(coverPath);
			}
			
			List<String> pathList = parser.getImageList("content_img", true);
			String content = event.getContent();
			content = ImageAPI.uploadWith(request, ImageAPI.EVENT_ROOT, content, pathList);
			event.setContent(content);
			
			eventDAO.setAutoCommit(false);
			
			if(origin.getType() == Event.Type.LIBERTYSQUARE) {
				Ticket[] tickets = parser.parseTickets();
				TicketDAO ticketDAO = DAOFactory.convert(eventDAO, TicketDAO.class);

				List<Long> originTicketIdList = Arrays.stream(origin.getTickets()).boxed().collect(Collectors.toList());
				ArrayList<Long> adjustedTicketIdList = new ArrayList<>();
				for(Ticket ticket : tickets) {
					Long ticketId = ticket.getID();
					if(ticketId == null) {
						adjustedTicketIdList.add(ticketDAO.insert(ticket));
					} else {
						if(DateUtil.wasExpired(ticket.getStartDate())) ticket.setStartDate(null);// 티켓 판매 시작일 이후인 경우 시작일 변경 불가 
						// 티켓 종료일이 행사 종료일 '이후'인 경우 변경 불가 
						// DateUtil.isAfter에서 오류 발생시 false를 넘겨주므로, event와 ticket의 순서를 바꾸고, ! 연산자 사용하여 확인
						if(!DateUtil.isAfter(event.getDateTimeEnd(), ticket.getEndDate())) ticket.setEndDate(null);
						
						Ticket originTicket = ticketDAO.get(ticketId);
						int amount = originTicket.getAmount();
						int curAmount = originTicket.getAmount();
						int remaining = amount - curAmount;
						if(amount != curAmount) {// 구매자가 있는 경우 가격 수정 불가
							ticket.setPrice(originTicket.getPrice());
						}
						if(amount < remaining) {// 티켓 수량은 팔린 개수보다 적게 줄일 수 없음
							ticket.setAmount(remaining);
						}
						ticketDAO.update(ticket);
						originTicketIdList.remove(ticketId);
						adjustedTicketIdList.add(ticketId);
					}
				}
				for(long ticketID : originTicketIdList) {
					ticketDAO.delete(ticketID);
				}
				
				event.setTickets(adjustedTicketIdList.stream().mapToLong(l -> l).toArray());
			}

			eventDAO.update(event);
			
			eventDAO.commit();
			eventDAO.setAutoCommit(true);
		});
		
		// 티켓들 가져오기
	}
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		HttpSession session = getSession(request);
		User user = getUser(session);
		
		Host host = (Host) session.getAttribute(HostAPI.ATTRIBUTE_HOST);
		if(host == null) throw new MyServletException(HttpServletResponse.SC_BAD_REQUEST, "No host specified");
		
		if(!Arrays.stream(host.getMembers()).anyMatch(member -> member.equals(user.getUUID()))) {
			throw MyServletException.FORBIDDEN;
		}
		
		EventParser parser = new EventParser(request, false);
		Event event = parser.parseEvent();
		event.setHost(host.getID());
		
		Ticket[] tickets = event.getType() == Event.Type.LIBERTYSQUARE ? parser.parseTickets() : null;
		
		processDAO(EventDAO.class, eventDAO -> {
			try {
				eventDAO.setAutoCommit(false);
				
				if(tickets != null) {
					TicketDAO ticketDAO = DAOFactory.convert(eventDAO, TicketDAO.class);
					event.setTickets(Arrays.stream(tickets).mapToLong(ticket -> ticketDAO.insert(ticket)).toArray());
				}
				
				String coverPath = ImageAPI.upload(request, ImageAPI.EVENT_ROOT, parser.parseCoverImage());
				event.setCoverPath(coverPath);
				
				List<String> pathList = parser.getImageList("content_img", true);
				String content = event.getContent();
				content = ImageAPI.uploadWith(request, ImageAPI.EVENT_ROOT, content, pathList);
				event.setContent(content);
				
				long eventID = eventDAO.insert(event);
				if(eventID == -1) {
					eventDAO.rollback();
					throw new MyServletException(ServletStatus.DB_ERROR, "Insert Event");
				}
				
				eventDAO.commit();
			} catch(SQLException e) {
				try {
					eventDAO.rollback();
				} catch (SQLException e1) {}
				throw new MyServletException(ServletStatus.DB_ERROR, e.getMessage());
			}
		});
	}
	
	@Override
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		User user = getUser(request);
		
		long id = RequestParser.getLong(request, "id");
		
		processDAO(EventDAO.class, dao -> {
			Map<String, Object> detailMap = dao.getEventDetail(id);
			
			Host host = (Host) detailMap.get("host");
			if(!host.containMember(user.getUUID())) throw MyServletException.FORBIDDEN;
			
			Event event = (Event) detailMap.get("event");
			if(event.getType() == Event.Type.LIBERTYSQUARE) {// 내부 주최인 경우
				@SuppressWarnings("unchecked")
				ArrayList<Ticket> ticketList = (ArrayList<Ticket>) detailMap.get("ticket");

				for(Ticket ticket : ticketList) {
					if((ticket.getAmount() - ticket.getCurrentAmount()) != 0) {// 구매자가 있는 경우
						if(!DateUtil.wasExpired(event.getDateTimeStart())) {// 행사 시작 전
							throw new MyServletException(ServletStatus.NOT_ACCEPTABLE);
						} else if(!DateUtil.wasExpired(event.getDateTimeEnd())) {// 행사 중
							throw MyServletException.UNPROCESSABLE_ENTITY;
						}
					}
				}
			}
			
			dao.delete(id);
		});
	}
}