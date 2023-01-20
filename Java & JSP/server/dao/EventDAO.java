package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import data.Event;
import data.Event.Status;
import data.Host;
import data.Ticket;
import database.ResultSetSequence;
import database.Table;
import database.query.InsertQuery;
import database.query.QueryFactory;
import database.query.SelectQuery;
import database.query.UpdateQuery;
import exception.MyServletException;

public class EventDAO extends DefaultDAO<Event> {
	private static long countPerPage = 10;

	protected EventDAO() {
		super(Table.EVENT);
	}
	
	@Override
	public synchronized long insert(Event event) {
		InsertQuery query = QueryFactory.insert(Table.EVENT)
				.add(null)
				.addCommand("uuid()")
				.add(event.getType().name())
				.add(event.getApplyLink())
				.add(event.getStatus().name())
				.add(event.getTitle())
				.add(event.getContactEmail())
				.add(event.getContactTel())
				.add(event.getDateTimeStart())
				.add(event.getDateTimeEnd())
				.addToJson(event.getCategories())
				.add(event.getGenre().name())
				.add(event.getHashtagsJson())
				.add(event.isOnline())
				.add(event.getVenue())
				.add(event.getDetailVenue())
				.add(event.getVenueDescription())
				.add(event.getContent())
				.add(event.getCoverPath())
				.add(event.getHost())
				.addToJson(event.getTickets())
				.add(null)
				.add(null);
			
		return executeInsert(query);
	}
	
	protected static Event parse(ResultSet rs) {
		return parse(new ResultSetSequence(rs));
	}
	
	protected static Event parse(ResultSetSequence sequence) {
		try {
			Event event = new Event();
			
			event.setID(sequence.nextLong());
			event.setUUID(sequence.nextString());
			event.setType(sequence.nextFrom(Event.Type::valueOf));
			event.setApplyLink(sequence.nextString());
			event.setStatus(sequence.nextFrom(Event.Status::valueOf));
			event.setTitle(sequence.nextString());
			event.setContactEmail(sequence.nextString());
			event.setContactTel(sequence.nextString());
			event.setDateTimeStart(sequence.nextString());
			event.setDateTimeEnd(sequence.nextString());
			event.setCategories(sequence.nextFromJson(Event.Category[].class));
			event.setGenre(sequence.nextFrom(Event.Genre::valueOf));
			event.setHashtags(sequence.nextFromJson(String[].class));
			event.setOnline(sequence.nextBoolean());
			event.setVenue(sequence.nextString());
			event.setDetailVenue(sequence.nextString());
			event.setVenueDescription(sequence.nextString());
			event.setContent(sequence.nextString());
			event.setCoverPath(sequence.nextString());
			event.setHost(sequence.nextLong());
			event.setTickets(sequence.nextFromJson(long[].class));
			event.setGeneratedDateTime(sequence.nextString());
			event.setUpdateDateTime(sequence.nextString());
			
			return event;
		} catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	@Override
	public Event get(long id) {
		SelectQuery query = QueryFactory.select(getTable())
				.eq("id", id);
		
		return executeQuery(query, sequence -> {
			return sequence.next() ? parse(sequence) : null;
		});
	}
	
	/**
	 * @param eventID id or uuid
	 * */
	public Event get(String id) {
		SelectQuery query = QueryFactory.select(getTable())
				.eq("id", id)
				.or()
				.eq("uuid", id);
		
		return executeQuery(query, sequence -> {
			return sequence.next() ? parse(sequence) : null;
		});
	}
	
	public Event getEventFromTicketID(long ticketID) {
		SelectQuery query = QueryFactory.select(getTable())
				.like("tickets", ticketID);
		
		return executeQuery(query, sequence -> {
			return sequence.next() ? parse(sequence) : null;
		});
	}

	public Map<String, Object> getEventDetail(long id) {
		return _getEventDetail(get(id));
	}
	
	/**
	 * @param eventID id or uuid
	 * */
	public Map<String, Object> getEventDetail(String id) {
		return _getEventDetail(get(id));
	}
	
	private Map<String, Object> _getEventDetail(Event event) {
		if (event == null) return null;

		Map<String, Object> map = new HashMap<>();
		map.put("event", event);
		
		long[] tickets = event.getTickets();
		if (tickets != null) {
			TicketDAO tdao = DAOFactory.convert(this, TicketDAO.class);
			ArrayList<Ticket> ticketList = new ArrayList<>();

			for (int i = 0; i < tickets.length; i++) {
				ticketList.add(tdao.get(tickets[i]));
			}

			map.put("ticket", ticketList);
		}
		
		HostDAO hdao = DAOFactory.convert(this, HostDAO.class);
		Host host = hdao.get(event.getHost());
		map.put("host", host);

		return map;
	}
	
	public String getTitle(long eventId) {
		SelectQuery query = QueryFactory.select(getTable())
				.setResult("title")
				.eq("id", eventId);
		
		return executeQuery(query, sequence -> {
			return sequence.next() ? sequence.nextString() : null;
		});
	}
	
	@Override
	public synchronized boolean update(Event event) {
		Status status = event.getStatus();
		UpdateQuery query = QueryFactory.update(getTable())
				.set("status", status == null ? null : status.name())
				.set("apply_link", event.getApplyLink())
				.set("title", event.getTitle())
				.set("contact_email", event.getContactEmail())
				.set("contact_tel", event.getContactTel())
				.set("dt_start", event.getDateTimeStart())
				.set("dt_end", event.getDateTimeEnd())
				.set("_online", event.isOnline())
				.set("venue", event.getVenue())
				.set("venue_detail", event.getDetailVenue())
				.set("venue_desc", event.getVenueDescription())
				.set("content", event.getContent())
				.set("path_cover", event.getCoverPath())
				.setToJson("tickets", event.getTickets())
				.eq("id", event.getID());
		
		return executeUpdate(query);
	}
	
	protected ArrayList<Event> getList(int pageNumber, String conditional) {
		return getList(conn, pageNumber, conditional, false, false, false, countPerPage);
	}

	protected static ArrayList<Event> getList(Connection conn, int pageNumber, String conditional, boolean hasPrice, boolean hasParticipants) {
		return getList(conn, pageNumber, conditional, hasPrice, hasParticipants, false, countPerPage);
	}
	
	protected static ArrayList<Event> getList(Connection conn, int pageNumber, String conditional, boolean hasPrice, boolean hasParticipants, long limit) {
		return getList(conn, pageNumber, conditional, hasPrice, hasParticipants, false, limit);
	}

	public ArrayList<Event> getList(int pageNumber, String conditional, boolean hasPrice, boolean hasParticipants, int limit) {
		return getList(conn, pageNumber, conditional, hasPrice, hasParticipants, false, limit);
	}

	public static ArrayList<Event> getList(Connection conn, int pageNumber, String conditional, boolean hasPrice, boolean hasParticipants, boolean hasHost, long limit) {
		String query = "SELECT event.id, event.type, event.title, event.dt_start, event.dt_end, event.hashtag, event.status, event._online, event.path_cover";
		if (hasPrice) query += ", (SELECT GROUP_CONCAT(price) FROM ticket WHERE FIND_IN_SET (ticket.id, REPLACE(REPLACE(tickets, '[', ''), ']', ''))) AS price";
		if (hasParticipants) query += ", SUM((SELECT count(*) FROM attendant WHERE ticket_id=ticket.id AND attendant.state != 'REFUND')) AS amount";
		if (hasHost) query += ", event.host, (SELECT host.name FROM host WHERE host.id = event.host) AS hostID";
		query += " " + conditional;
		if(limit > 0) query += " LIMIT " + (pageNumber - 1) * limit + ", " + limit;
		
		ArrayList<Event> list = new ArrayList<>();
		Statement stmt = null;
		ResultSet rs = null;
		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery(query);
			
			ResultSetSequence sequence = new ResultSetSequence(rs);
			while (sequence.next()) {
				Event event = new Event();
				try {
					event.setID(sequence.nextLong());
					event.setType(sequence.nextFrom(Event.Type::valueOf));
					event.setTitle(sequence.nextString());
					event.setDateTimeStart(sequence.nextString());
					event.setDateTimeEnd(sequence.nextString());
					event.setHashtags(sequence.nextFromJson(String[].class));
					event.setStatus(sequence.nextFrom(Event.Status::valueOf));
					event.setOnline(sequence.nextBoolean());
					event.setCoverPath(sequence.nextString());
					if (hasPrice) {
						String priceString = sequence.nextString();
						if(priceString != null) {
							event.setTicketPrices(Arrays.stream(priceString.split(",")).mapToInt(Integer::parseInt).toArray());
						}
					}
					if (hasParticipants) event.setParticipants(sequence.nextInt());
					if (hasHost) {
						event.setHost(sequence.nextLong());
						event.setHostName(sequence.nextString());
					}
				} catch (Exception e) {
					event = null;
				}
				if (event != null) list.add(event);
			}
		} catch (Exception e) {
			e.printStackTrace();
			list = null;
		} finally {
			try {
				if (conn != null && !conn.getAutoCommit()) conn.rollback();
				if (rs != null) rs.close();
				if (stmt != null) stmt.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return list;
	}

	// 추천 행사
	public ArrayList<Event> getRecommendationList(int pageNumber) {// 하동 + 온/오프 상관 없음
		return getList(conn, pageNumber, "FROM event LEFT JOIN ticket ON TIMESTAMPDIFF(DAY, dt_end, NOW()) <= 0 GROUP BY event.id HAVING event.status = 'PUBLIC' ORDER BY CASE WHEN event.type = 'LIBERTYSQUARE' THEN 1 ELSE 2 END, price DESC, dt_end DESC", true, false);
	}

	// 온라인 행사
	public ArrayList<Event> getOnlineList(int pageNumber) {// 자유광장에서 주최, 금액 높은순, 디데이 임박
		return getList(conn, pageNumber, "FROM event LEFT JOIN ticket ON TIMESTAMPDIFF(DAY, dt_end, NOW()) <= 0 GROUP BY event.id HAVING event.status = 'PUBLIC' AND event._online = true ORDER BY CASE WHEN event.type = 'LIBERTYSQUARE' THEN 1 ELSE 2 END, price DESC, dt_end DESC", true, false);
	}

	// 최신 행사 (등록 기준)
	public ArrayList<Event> getRecencyList(int pageNumber) {
		return getList(pageNumber, "FROM event WHERE status = 'PUBLIC' ORDER BY event.gen_time DESC");
	}

	// 임박 행사
	public ArrayList<Event> getImminentList(int pageNumber) {
		return getList(pageNumber, "FROM event WHERE status = 'PUBLIC' AND (TIMESTAMPDIFF(DAY, dt_end, NOW()) BETWEEN -7 AND 0) ORDER BY dt_end DESC");
	}

	// 무료 행사
	public ArrayList<Event> getFreeList(int pageNumber) {
		// return getList(conn, pageNumber, "FROM event LEFT JOIN ticket ON _public =
		// true AND (event.tickets REGEXP CONCAT('[\\[,]', ticket.id, '[\\],]')) AND
		// price = 0 GROUP BY event.tickets ORDER BY dt_end DESC", true, false);
		// 하나라도 무료면 나옴.
		// 모두가 무료인 것을 뽑기 위해선, GROUP BY 절에서 event.id를 제거.
		return getList(pageNumber, "FROM event LEFT JOIN ticket ON FIND_IN_SET (ticket.id, REPLACE(REPLACE(tickets, '[', ''), ']', '')) GROUP BY event.id, ticket.price HAVING event.status = 'PUBLIC' AND ticket.price = 0");
	}
	
	// /events 페이지의 리스트. (최신과 동일하되, host 정보 포함)
	public ArrayList<Event> getEventList(int pageNumber) {
		return getList(conn, pageNumber, "FROM event WHERE status = 'PUBLIC' ORDER BY event.gen_time DESC", true, false, true, countPerPage);
	}

	/**
	 * This function is not affected by {@link #setCountPerPage(int)} maximum number
	 * of seach : 20
	 * 
	 * @param keyword - Match event title
	 * @param online  - Null : all / true : online / false : offline
	 * @param free    - Null : all / true : free / false : pay
	 */
	public HashMap<String, Object> search(int pageNumber, String keyword, Boolean online, Event.Genre[] genres, Event.Category[] categories, Boolean free, String requestUserUUID) {
		final int limit = 20;
		
		SelectQuery eventQuery = QueryFactory.select(getTable())
				.addResult("SQL_CALC_FOUND_ROWS event.id, event.type, event.title, event.dt_start, event.dt_end, event.hashtag, event.status, event._online, event.path_cover")
				.eq("status", Status.PUBLIC.name())
				.pagination(pageNumber, limit);
		
		if (keyword != null) eventQuery.and().like("event.title", keyword);
		if (online != null) eventQuery.and().eq("event._online", online);
		if (genres != null) {
			eventQuery.and().command("(")
				.eq("event.genre", genres[0].toString());
			for (int i = 1; i < genres.length; i++) {
				eventQuery.or().eq("event.genre", genres[i].toString());
			}
			eventQuery.command(")");
		}
		if (categories != null) {
			eventQuery.and().command("(")
				.like("event.category", categories[0].toString());
			for (int i = 1; i < categories.length; i++) {
				eventQuery.or().eq("event.category", categories[i].toString());
			}
			eventQuery.command(")");
		}
		boolean hasPrice = free != null;
		if (hasPrice) {
			eventQuery.addResult("(SELECT GROUP_CONCAT(price) FROM ticket WHERE event.tickets LIKE CONCAT('%', ticket.id, '%')) AS price")
				.groupBy("event.id")
				.having((free ? "price = 0 " : "price > 0"));
		}
		
		SelectQuery hostQuery = QueryFactory.select(Table.HOST)
				.setResult("SQL_CALC_FOUND_ROWS id, name, introduce_simple, subscribe, path_cover, path_profile, (SELECT COUNT(event.host) FROM event WHERE event.host = host.id)")
				.pagination(pageNumber, limit);
		if (keyword != null) hostQuery.like("name", keyword);
		
		HashMap<String, Object> map = new HashMap<>();
		ArrayList<Host> hosts = new ArrayList<>();
		
		int findRows = 0;
		
		ArrayList<Event> events = new ArrayList<>();
		executeQuery(eventQuery, sequence -> {
			while (sequence.next()) {
				Event event = new Event();
				try {
					event.setID(sequence.nextLong());
					event.setType(sequence.nextFrom(Event.Type::valueOf));
					event.setTitle(sequence.nextString());
					event.setDateTimeStart(sequence.nextString());
					event.setDateTimeEnd(sequence.nextString());
					event.setHashtags(sequence.nextFromJson(String[].class));
					event.setStatus(sequence.nextFrom(Event.Status::valueOf));
					event.setOnline(sequence.nextBoolean());
					event.setCoverPath(sequence.nextString());
					if (hasPrice) {
						String priceString = sequence.nextString();
						if(priceString != null) {
							event.setTicketPrices(Arrays.stream(priceString.split(",")).mapToInt(Integer::parseInt).toArray());
						}
					}
					events.add(event);
				} catch (Exception e) {}
			}
			return;
		});
		map.put("events", events);
		
		PreparedStatement foundRows;
		try {
			foundRows = conn.prepareStatement("SELECT FOUND_ROWS()");
		} catch (SQLException e) {
			throw MyServletException.DB_ERROR;
		}
		findRows = executeQuery(foundRows, sequence -> {
			sequence.next();
			return sequence.nextInt();
		});
		
		executeQuery(hostQuery, sequence -> {
			while (sequence.next()) {
				Host host = new Host();
				host.setID(sequence.nextLong());
				host.setName(sequence.nextString());
				host.setIntroduceSimple(sequence.nextString());
				String subscribe = sequence.nextString();
				if (subscribe != null && !"".equals(subscribe)) {
					String[] subscribes = subscribe.split(",");
					host.setSubscribeCount(subscribes.length);
					host.setSubscribed(Arrays.stream(subscribes).anyMatch(s -> s.equals(requestUserUUID)));
				}
				host.setCoverPath(sequence.nextString());
				host.setProfilePath(sequence.nextString());
				host.setEventCount(sequence.nextInt());
				hosts.add(host);
			}
			return;
		});
		map.put("hosts", hosts);
		
		findRows += executeQuery(foundRows, sequence -> {
			sequence.next();
			return sequence.nextInt();
		});
		map.put("findRows", findRows);
		
		return map;
	}
	
	public static void setCountPerPage(long cnt) {
		EventDAO.countPerPage = cnt;
	}

	@Override
	public boolean delete(long id) {
		UpdateQuery query = QueryFactory.update(getTable())
				.set("status", Status.DELETED)
				.eq("id", id);
		
		return executeUpdate(query);
	}
}
