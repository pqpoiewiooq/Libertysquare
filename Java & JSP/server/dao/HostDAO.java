package dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import account.User;
import data.Attendant;
import data.Event;
import data.Host;
import data.Support;
import database.ResultSetSequence;
import database.Table;
import database.query.DeleteQuery;
import database.query.InsertQuery;
import database.query.QueryFactory;
import database.query.SelectQuery;
import database.query.UpdateQuery;
import exception.MyServletException;
import servlet.common.ServletStatus;
import util.CryptoHelper;
import util.JsonUtil;

public class HostDAO extends DefaultDAO<Host> {
	protected HostDAO() {
		super(Table.HOST);
	}
	
	@Override
	public long insert(Host host) {
		InsertQuery query = QueryFactory.insert(Table.HOST)
				.add(null)
				.add(host.getName())
				.add(host.getIntroduceSimple())
				.add(host.getIntroduce())
				.add(host.getVenue())
				.add(host.getDetailVenue())
				.add(host.getMembers())
				.addCommand("DATE_FORMAT(NOW(), '%Y-%m-%d')")
				.add(host.getThemeColor())
				.add(host.getCoverPath())
				.add(host.getProfilePath())
				.add(null)
				.add(null);
		
		return executeInsert(query);
	}

	public List<Host> getHosts(String userUUID) {
		SelectQuery query = QueryFactory.select(getTable())
				.where("member LIKE CONCAT('%', ?, '%')", userUUID);
		
		return executeQuery(query, sequence -> {
			ArrayList<Host> hostList = new ArrayList<>();
			ResultSet rs = sequence.resultSet();
			while (rs.next()) {
				Host host = parse(rs);
				if (host != null) hostList.add(host);
			}
			
			return hostList;
		});
	}
	
	@Override
	public Host get(long hostID) {
		SelectQuery query = QueryFactory
				.select(Table.HOST)
				.eq("id", hostID);
		
		return executeQuery(query, sequence -> {
			return sequence.next() ? parse(sequence) : null;
		});
	}
	
	public Host getHostDetail(long hostID, String requestUserUUID) {
		SelectQuery query = QueryFactory.select(getTable())
				.addResult("*")
				.addResult("(SELECT COUNT(*) FROM event WHERE event.host = host.id AND event.status != '" + Event.Status.DELETED + "')")
				.addResult("(SELECT COUNT(*) FROM support WHERE support.host = host.id)")
				.addResult("(SELECT COUNT(*) FROM attendant WHERE attendant.host_id = host.id AND attendant.state != '" + Attendant.State.REFUND + "' )")
				.eq("id", hostID);
		
		return executeQuery(query, sequence -> {
			if(!sequence.next()) return null;
			
			try {
				Host host = new Host();
				
				host.setID(sequence.nextLong());
				host.setName(sequence.nextString());
				host.setIntroduceSimple(sequence.nextString());
				host.setIntroduce(sequence.nextString());
				host.setVenue(sequence.nextString());
				host.setDetailVenue(sequence.nextString());
				host.setMembers(sequence.nextFromJson(String[].class));
				host.setSince(sequence.nextString());
				host.setThemeColor(sequence.nextString());
				host.setCoverPath(sequence.nextString());
				host.setProfilePath(sequence.nextString());
				
				String subscribe = sequence.nextString();
				if (subscribe != null && !"".equals(subscribe)) {
					String[] subscribes = subscribe.split(",");
					host.setSubscribes(subscribes);
					host.setSubscribeCount(subscribes.length);
					host.setSubscribed(Arrays.stream(subscribes).anyMatch(s -> s.equals(requestUserUUID)));
				}
				
				sequence.jump(1);//gen_time
				
				host.setEventCount(sequence.nextInt());
				host.setSupportCount(sequence.nextInt());
				host.setAttendantCount(sequence.nextInt());
				return host;
			} catch(MyServletException e) {
				return null;
			}
		});
	}

	public List<String> getMemberList(long hostID) {
		Host host = null;
		try {
			host = get(hostID);
		} catch (MyServletException e1) {}
		if (host == null) throw new MyServletException(ServletStatus.NOT_FOUND, "host");
		
		PreparedStatement pstmt = null;
		try {
			String[] members = host.getMembers();
			if (members != null) {
				String query = "SELECT nickname FROM user WHERE uuid = ? AND state = ?";

				pstmt = conn.prepareStatement(query);
				
				List<String> nameList = new ArrayList<>();
				for (String member : members) {
					pstmt.setBytes(1, CryptoHelper.hexStringToByteArray(member));
					pstmt.setString(2, User.State.ACTIVATE.name());
					
					executeQuery(pstmt, sequence -> {
						if(sequence.next()) {
							nameList.add(sequence.nextString());
						}
					});
				}

				return nameList.size() < 1 ? null : nameList;
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				if (pstmt != null) pstmt.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return null;
	}

	public List<Event> getHostedEventList(long hostID) {
		return EventDAO.getList(conn, 1, "FROM (SELECT * FROM event WHERE host = " + hostID + ") event LEFT JOIN ticket ON event.tickets LIKE CONCAT('%', ticket.id, '%') WHERE event.status != 'DELETED' GROUP BY event.id ORDER BY event.gen_time DESC", true, true, 0);
	}
	
	public List<Support> getHostedSupportList(long hostID) {
		try {
			return SupportDAO.getHostedSupportList(this.conn, hostID);
		} catch (MyServletException e) {
			return null;
		}
	}
	
	public boolean hasHost(String hostName) {
		SelectQuery query = QueryFactory.select(getTable())
				.setResult("name")
				.eq("name", hostName);
		
		return executeExists(query);
	}
	
	public boolean hasHost(String hostName, long ignore) {
		SelectQuery query = QueryFactory.select(getTable())
				.setResult("name")
				.eq("name", hostName)
				.and()
				.not("id", ignore);
		
		return executeExists(query);
	}

	protected static Host parse(ResultSet rs) {
		return parse(new ResultSetSequence(rs));
	}
	
	protected static Host parse(ResultSetSequence sequence) {
		try {
			Host host = new Host();
			
			host.setID(sequence.nextLong());
			host.setName(sequence.nextString());
			host.setIntroduceSimple(sequence.nextString());
			host.setIntroduce(sequence.nextString());
			host.setVenue(sequence.nextString());
			host.setDetailVenue(sequence.nextString());
			host.setMembers(sequence.nextFromJson(String[].class));
			host.setSince(sequence.nextString());
			host.setThemeColor(sequence.nextString());
			host.setCoverPath(sequence.nextString());
			host.setProfilePath(sequence.nextString());
			
			String subscribe = sequence.nextString();
			if (subscribe != null && !"".equals(subscribe)) {
				String[] subscribes = subscribe.split(",");
				host.setSubscribes(subscribes);
				host.setSubscribeCount(subscribes.length);
			}
			
			return host;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	@Override
	public boolean update(Host host) {
		long hostID = host.getID();
		if (hostID == -1) return false;
		
		UpdateQuery query = QueryFactory.update(getTable())
				.set("name", host.getName())
				.set("introduce_simple", host.getIntroduceSimple())
				.set("introduce", host.getIntroduce())
				.set("member", JsonUtil.toJson(host.getMembers()))
				.set("since", host.getSince())
				.set("theme_color", host.getThemeColor())
				.set("path_cover", host.getCoverPath())
				.set("path_profile", host.getProfilePath())
				.set("venue", host.getVenue())
				.set("detail_venue", host.getDetailVenue())
				.eq("id", hostID);
		
		return executeUpdate(query);
	}

	public boolean delete(long hostID, String requester) {
		DeleteQuery query = QueryFactory.delete(getTable())
				.eq("id", hostID);
		
		return executeUpdate(query);
	}

	/**
	 * maximum number of seach : 20
	 * 
	 * @param keyword - Match host name
	 */
	public ArrayList<Host> search(int pageNumber, String keyword, String requestUserUUID) {
		final int limit = 20;

		SelectQuery query = QueryFactory.select(getTable())
				.addResult("id")
				.addResult("name")
				.addResult("introduce_simple")
				.addResult("path_cover")
				.addResult("path_profile")
				.addResult("subscribe")
				.addResult("(SELECT COUNT(event.host) FROM event WHERE event.host = host.id)")
				.addResult("(SELECT COUNT(support.host) FROM support WHERE support.host = host.id)")
				.like("name", keyword)
				.pagination(pageNumber, limit);
				
		return executeQuery(query, sequence -> {
			ArrayList<Host> list = new ArrayList<>();
			
			while(sequence.next()) {
				Host host = new Host();
				
				host.setID(sequence.nextLong());
				host.setName(sequence.nextString());
				host.setIntroduceSimple(sequence.nextString());
				host.setCoverPath(sequence.nextString());
				host.setProfilePath(sequence.nextString());
				
				String subscribe = sequence.nextString();
				if (subscribe != null && !"".equals(subscribe)) {
					String[] subscribes = subscribe.split(",");
					host.setSubscribes(subscribes);
					host.setSubscribeCount(subscribes.length);
				}
				host.setEventCount(sequence.nextInt());
				host.setSupportCount(sequence.nextInt());
				list.add(host);
			}
			
			return list;
		});
	}
	
	public boolean toggleSubscribe(long hostID, String userUUID) {
		SelectQuery select = QueryFactory.select(getTable())
				.setResult("subscribe")
				.eq("id", hostID);
		
		return executeQuery(select, sequence -> {
			if(sequence.next()) {
				String subscribe = sequence.nextString();
				if (subscribe == null) {
					subscribe = userUUID;
				} else {
					String[] subscribes = subscribe.split(",");
					ArrayList<String> subscribeList = new ArrayList<>(Arrays.asList(subscribes));
					if (!subscribeList.removeIf(s -> s.equals(userUUID))) {
						subscribeList.add(userUUID);
					}
					subscribe = String.join(",", subscribeList);
				}
				
				UpdateQuery update = QueryFactory.update(getTable())
						.set("subscribe", "".equals(subscribe) ? null : subscribe)
						.eq("id", hostID);

				return executeUpdate(update);
			}
			
			return false;
		});
	}
}
