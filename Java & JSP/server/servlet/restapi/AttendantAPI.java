package servlet.restapi;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import account.User;
import dao.AttendantDAO;
import dao.DAOFactory;
import dao.EventDAO;
import dao.HostDAO;
import dao.TicketDAO;
import dao.UserDAO;
import data.Attendant;
import data.Event;
import data.Host;
import data.Ticket;
import exception.MyServletException;
import servlet.common.MyHttpServlet;
import servlet.common.ServletStatus;
import servlet.util.RequestParser;

public class AttendantAPI extends MyHttpServlet {
	private static final long serialVersionUID = -5829054576666686412L;
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String what = request.getParameter("w");
		if(what == null) throw new MyServletException(ServletStatus.NOT_FOUND_PARAMETER, "w");
		
		switch(what) {
		case "list":
			sendAttendantList(request, response);
			break;
		case "modal":
			sendModalData(request, response);
			break;
		default:
			throw new MyServletException(ServletStatus.INVALID_PARAMETER, "w");
		}
	}
	
	private void sendAttendantList(HttpServletRequest request, HttpServletResponse response) throws IOException {
		User user = getUser(request);
		
		int eventId = RequestParser.getInt(request, "eventID");
		Attendant.State state = RequestParser.getTo(request, "type", Attendant.State::valueOf);
		if(!(state == Attendant.State.APPROVE || state == Attendant.State.WAIT)) throw new MyServletException(ServletStatus.INVALID_PARAMETER, "type");
		
		processDAO(EventDAO.class, dao -> {
			Event event = dao.get(eventId);
			if(event == null) throw new MyServletException(ServletStatus.NOT_FOUND, "event");
			
			HostDAO hdao = DAOFactory.convert(dao, HostDAO.class);
			Host host = hdao.get(event.getHost());
			if(host == null) throw new MyServletException(ServletStatus.NOT_FOUND, "host");
			if(!Arrays.stream(host.getMembers()).anyMatch(member -> member.equals(user.getUUID()))) {
				throw MyServletException.FORBIDDEN;
			}
			
			AttendantDAO adao = DAOFactory.convert(dao, AttendantDAO.class);
			ArrayList<HashMap<String, Object>> list = state == Attendant.State.APPROVE ? adao.getAttendantList(event.getTickets(), state, Attendant.State.ATTEND) : adao.getAttendantList(event.getTickets(), state);
			if(list == null) throw new MyServletException(ServletStatus.NOT_FOUND, "data");
			
			printJson(response, list);
		});
	}
	
	/*
	 * lib 폴더 및 프로젝트 설정에서 poi 삭제
	private void sendAttendantListExcel(HttpServletRequest request, HttpServletResponse response) throws Exception {
		PrintWriter out = response.getWriter();
		
		DefaultDAO dao = null;
		try {
			String eventID = request.getParameter("eventID");
			if(eventID == null) throw new MyServletException(ServletStatus.NOT_FOUND_PARAMETER, "eventID");
			
			int id;
			try {
				id = Integer.parseInt(eventID);
			} catch(Exception e) {
				throw new MyServletException(ServletStatus.INVALID_PARAMETER, "eventID");
			}
			
			HttpSession session = request.getSession(false);
			User user = (User)(session == null ? null : session.getAttribute("user"));
			if(user == null) throw new MyServletException(ServletStatus.UNAUTHORIZED);
			
			EventDAO edao = DAOFactory.createEventDAO();
			dao = edao;
			if(edao == null) throw new MyServletException(ServletStatus.DB_CONNECTION_FAILED);
			
			Event event = edao.getEvent(id);
			if(event == null) throw new MyServletException(ServletStatus.NOT_FOUND, "event");

			HostDAO hdao = DAOFactory.convertHostDAO(dao);
			Host host = hdao.getHost(event.getHost() + "");
			if(host == null) throw new MyServletException(ServletStatus.NOT_FOUND, "host");
			if(!Arrays.stream(host.getMembers()).anyMatch(member -> member.equals(user.getUUID()))) {
				throw new MyServletException(ServletStatus.FORBIDDEN);
			}
			
			AttendantDAO adao = DAOFactory.convertAttendantDAO(dao);
			ArrayList<HashMap<String, Object>> list = adao.getAttendantList(event.getTickets());
			if(list == null) throw new MyServletException(ServletStatus.NOT_FOUND, "data");
			
			SXSSFWorkbook workbook = createExcel(list);
			if(workbook == null) throw new MyServletException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Spreadsheet Create Failed");
			
			final String exportFileName = "libertysquare-attendees-for-event-" + eventID;
			
			response.setContentType("application/vnd.ms-excel");
	        response.setHeader("Content-Disposition", String.format("attachment;filename=%s.xlsx", exportFileName));
	        
	        workbook.write(response.getOutputStream());
	        workbook.close();
		} catch(Exception e) {
			throw e;
		} finally {
			try {
				if(dao != null) dao.close();
			} catch(Exception e) {
				e.printStackTrace();
			}
		}
	}
	
	private SXSSFWorkbook createExcel(ArrayList<HashMap<String, Object>> list) {
		SXSSFWorkbook workbook = null;
		try {
			workbook = new SXSSFWorkbook();
			SXSSFSheet sheet = workbook.createSheet("참가자 목록");
			Font font = workbook.createFont();
			
			Row nameRow = sheet.createRow(0);
			Cell nameTitle = nameRow.createCell(0);
			nameTitle.setCellValue("이름");
			
			Row phoneRow = sheet.createRow(0);
			Cell phoneTitle = phoneRow.createCell(0);
			phoneTitle.setCellValue("휴대폰");
			
			Row ticketNameRow = sheet.createRow(0);
			Cell ticketNameTitle = ticketNameRow.createCell(0);
			ticketNameTitle.setCellValue("티켓");
			
			Row ticketDescRow = sheet.createRow(0);
			Cell ticketDescTitle = ticketDescRow.createCell(0);
			ticketDescTitle.setCellValue("티켓 설명");
			
			Row ticketIDRow = sheet.createRow(0);
			Cell ticketIDTitle = ticketIDRow.createCell(0);
			ticketIDTitle.setCellValue("Ticket ID");
			
			Row timeRow = sheet.createRow(0);
			Cell timeTitle = timeRow.createCell(0);
			timeTitle.setCellValue("발행시각");
			
			Row stateRow = sheet.createRow(0);
			Cell stateTitle = stateRow.createCell(0);
			stateTitle.setCellValue("체크인");
			
			// 이름 / 휴대폰 / 티켓(==이름) / 티켓 설명 / TicketID / 발행시각(년/월/일) / 체크인(NO/YES)
			return workbook;
		} catch(Exception e) {
			try {
				if(workbook != null) workbook.close();
			} catch(Exception e2) {}
			
			return null;
		}
	}
	*/
	
	private void sendModalData(HttpServletRequest request, HttpServletResponse response) throws IOException {
		User user = getUser(request);
		
		int ticketId = RequestParser.getInt(request, "ticketID");
		
		processDAO(EventDAO.class, dao -> {
			Event event = dao.getEventFromTicketID(ticketId);
			if(event == null) throw new MyServletException(ServletStatus.NOT_FOUND, "event");
			
			TicketDAO tdao = DAOFactory.convert(dao, TicketDAO.class);
			Ticket ticket = tdao.get(ticketId);
			if(ticket == null) throw new MyServletException(ServletStatus.NOT_FOUND, "ticket");
			
			AttendantDAO adao = DAOFactory.convert(dao, AttendantDAO.class);
			ArrayList<Attendant> attendantList = adao.getAttendantList(ticketId, user.getUUID());
			if(attendantList == null) throw new MyServletException(ServletStatus.NOT_FOUND, "data");
			
			HashMap<String, Object> map = new HashMap<>();
			Event _event = new Event();
			_event.setTitle(event.getTitle());
			_event.setDateTimeStart(event.getDateTimeStart());
			_event.setDateTimeEnd(event.getDateTimeEnd());
			if(event.isOnline()) {
				if(event.isZoom()) {
					_event.setVenue(event.getVenue());
					_event.setDetailVenue("/attend?_=" + event.getUUID());
				} else _event.setVenue(event.getDetailVenue());
			} else _event.setVenue(event.getVenue());
			map.put("event", _event);
			Ticket _ticket = new Ticket();
			_ticket.setID(ticket.getID());
			_ticket.setName(ticket.getName());
			_ticket.setPrice(ticket.getPrice());
			_ticket.setDescription(ticket.getDescription());
			map.put("ticket", _ticket);
			for(Attendant attendant : attendantList) {
				attendant.setHostID(null);
				attendant.setTicket(null);
				attendant.setUserUUID(null);
			}
			map.put("attendant", attendantList);
			map.put("username", user.getNickname());
			
			printJson(response, map);
		});
	}

	protected void doPatch(HttpServletRequest request, HttpServletResponse response) throws IOException {
		User user = getUser(request);
		
		int attendantId = RequestParser.getInt(request, "id");
		Attendant.State state = RequestParser.getTo(request, "state", Attendant.State::valueOf);
		
		processDAO(AttendantDAO.class, dao -> {
			if(dao.hasPermission(attendantId, user.getUUID())) {
				Attendant attendant = dao.get(attendantId);
				if(attendant == null) throw new MyServletException(ServletStatus.NOT_FOUND, "data");
				if(attendant.getState() == state) throw MyServletException.CONFLICT;// 현재 상태와 요청 상태가 동일한 경우
				switch(attendant.getState()) {
				case ATTEND:
					if(state != Attendant.State.APPROVE) {
						throw MyServletException.UNPROCESSABLE_ENTITY;
					}
					break;
				case APPROVE:
					if(!(state == Attendant.State.WAIT || state == Attendant.State.ATTEND)) {
						throw MyServletException.UNPROCESSABLE_ENTITY;
					}
					break;
				case WAIT:
					if(state != Attendant.State.APPROVE) {
						throw MyServletException.UNPROCESSABLE_ENTITY;
					}
					break;
				default:
					throw MyServletException.UNPROCESSABLE_ENTITY;
				}
				
				if(!dao.updateState(attendantId, state)) throw MyServletException.DB_ERROR;
				
				UserDAO udao = DAOFactory.convert(dao, UserDAO.class);
				String attendantUserNickname = udao.getUserNickname(attendant.getUserUUID());
				response.getWriter().print(attendantUserNickname);
			} else throw MyServletException.FORBIDDEN;
		});
	}
}
