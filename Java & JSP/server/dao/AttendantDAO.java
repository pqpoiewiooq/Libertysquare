package dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

import account.User;
import data.Attendant;
import data.Ticket;
import database.ResultSetSequence;
import database.Table;
import database.query.InsertQuery;
import database.query.QueryFactory;
import database.query.SelectQuery;
import database.query.UpdateQuery;
import util.CryptoHelper;
import util.JsonUtil;

public class AttendantDAO extends DefaultDAO<Attendant> {

	protected AttendantDAO() {
		super(Table.ATTENDANT);
	}

	@Override
	public synchronized long insert(Attendant attendant) {
		InsertQuery query = QueryFactory.insert(getTable())
				.add(null)
				.add(attendant.getPaymentID())
				.add(attendant.getTicket().getID())
				.add(attendant.getHostID())
				.addToBytes(attendant.getUserUUID())
				.add(attendant.getState().name())
				.add(attendant.getPaymentTime())
				.add(null);
		
		return executeInsert(query);
	}
	
	public boolean hasPermission(long attendantID, String userUUID) {
		SelectQuery query = QueryFactory.select(Table.HOST)
				.setResult("member")
				.where("id = (SELECT host_id FROM attendant WHERE id = ?)", attendantID);
		
		return executeQuery(query, sequence -> {
			if(sequence.next()) {
				String members = sequence.nextString();
				return Arrays.stream(JsonUtil.fromJson(members, String[].class)).anyMatch(member -> member.equals(userUUID));
			}
			
			return false;
		});
	}
	
	@Override
	public Attendant get(long attendantID) {
		SelectQuery query = QueryFactory.select(getTable())
				.eq("id", attendantID);
		
		return executeQuery(query, sequence -> {
			return sequence.next() ? parse(sequence) : null;
		});
	}
	
	public synchronized final boolean updateState(long attendantID, Attendant.State state) {
		UpdateQuery query = QueryFactory.update(getTable())
				.set("state", state.name())
				.eq("id", attendantID);
		
		return executeUpdate(query);
	}
	
	protected static Attendant parse(ResultSet rs) {
		return parse(new ResultSetSequence(rs));
	}
	
	protected static Attendant parse(ResultSetSequence sequence) {
		try {
			Attendant attendant = new Attendant();
			attendant.setID(sequence.nextLong());
			attendant.setPaymentID(sequence.nextLong());
			Ticket ticket = new Ticket();
			ticket.setID(sequence.nextLong());
			attendant.setTicket(ticket);
			attendant.setHostID(sequence.nextLong());
			attendant.setUserUUID(CryptoHelper.byteArrayToHexString(sequence.nextBytes()));
			attendant.setState(sequence.nextFrom(Attendant.State::valueOf));
			attendant.setPaymentTime(sequence.nextString());
			return attendant;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public boolean hasApproveOrAttend(long[] tickets, String userUUID) {
		String attenantQuery = "SELECT * FROM " + getTable() + " WHERE ticket_id = ? AND user_uuid = ? AND (state = ? OR state = ?) ORDER BY payment_id";
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		
		try {
			pstmt = conn.prepareStatement(attenantQuery);
			pstmt.setBytes(2, CryptoHelper.hexStringToByteArray(userUUID));
			pstmt.setString(3, Attendant.State.APPROVE.name());
			pstmt.setString(4, Attendant.State.ATTEND.name());
			for(long ticket : tickets) {
				pstmt.setLong(1, ticket);
				rs = pstmt.executeQuery();
				
				if(rs.next()) return true;
				
				rs.close();
			}
		} catch(Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if(rs != null) rs.close();
				if(pstmt != null) pstmt.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		
		return false;
	}
	
	public ArrayList<Attendant> getAttendantList(long ticketID, String userUUID) {
		SelectQuery query = QueryFactory.select(getTable())
				.eq("ticket_id", ticketID)
				.and()
				.eq("user_uuid", CryptoHelper.hexStringToByteArray(userUUID))
				.and()
				.not("state", Attendant.State.REFUND.name())
				.orderBy("payment_id");
		
		return executeQuery(query, sequence -> {
			ArrayList<Attendant> list = new ArrayList<>();
			
			while(sequence.next()) {
				Attendant attendant = parse(sequence);
				list.add(attendant);
			}
			return list;
		});
	}
	
	public ArrayList<Attendant> getAttendantListFromPaymentID(long paymentID) {
		SelectQuery query = QueryFactory.select(getTable())
				.eq("payment_id", paymentID);
		
		return executeQuery(query, sequence -> {
			ArrayList<Attendant> list = new ArrayList<>();
			while(sequence.next()) {
				list.add(parse(sequence));
			}
			
			return list;
		});
	}
	
	public ArrayList<Long> getAttendantIdList(long paymentID) {
		SelectQuery query = QueryFactory.select(getTable())
				.setResult("id")
				.eq("payment_id", paymentID);
		
		return executeQuery(query, sequence -> {
			ArrayList<Long> list = new ArrayList<>();
			while(sequence.next()) {
				list.add(sequence.nextLong());
			}
			
			return list;
		});
	}
	
	public ArrayList<HashMap<String, Object>> getAttendantList(long[] tickets, Attendant.State... states) {
		StringBuilder queryBuilder = new StringBuilder();
		queryBuilder.append("SELECT * FROM ").append(Table.ATTENDANT)
					.append(" WHERE ticket_id = ? AND ");
		if(states == null || states.length == 0) {
			queryBuilder.append("state != '").append(Attendant.State.REFUND.name()).append("'");
		} else {
			queryBuilder.append("(state = '").append(states[0].name()).append("'");
			for(int i = 1; i < states.length; i++) {
				queryBuilder.append(" OR state = '").append(states[i].name()).append("'");
			}
			queryBuilder.append(")");
		}
		queryBuilder.append(" ORDER BY payment_id");
		String attenantQuery = queryBuilder.toString();
		String userQuery = "SELECT * FROM user WHERE uuid = ?";
		PreparedStatement astmt = null;
		PreparedStatement ustmt = null;
		ResultSet ars = null;
		ResultSet urs = null;
		
		ArrayList<HashMap<String, Object>> list = new ArrayList<>();
		try {
			astmt = conn.prepareStatement(attenantQuery);
			ustmt = conn.prepareStatement(userQuery);
			TicketDAO tdao = DAOFactory.convert(this, TicketDAO.class);
			for(long ticketID : tickets) {
				astmt.setLong(1, ticketID);
				ars = astmt.executeQuery();
				
				ArrayList<ArrayList<Attendant>> paymentList = new ArrayList<>();
				ArrayList<Attendant> attendantList = null;
				long paymentID = -1;
				while(ars.next()) {
					Attendant attendant = parse(ars);
					if(attendant.getPaymentID() != paymentID) {
						//if(attendantList != null) paymentList.add(attendantList);
						attendantList = new ArrayList<>();
						paymentList.add(attendantList);//
						paymentID = attendant.getPaymentID();
						
						ustmt.setBytes(1, CryptoHelper.hexStringToByteArray(attendant.getUserUUID()));
						urs = ustmt.executeQuery();
						urs.next();
						User user = UserDAO.parse(urs);
						user.setUUID(null);
						user.setPassword(null);
						user.setState(null);
						user.setName(null);
						user.setBirth(null);
						user.setGender(null);
						user.setNational(null);
						user.setDI(null);
						user.setMobileCorp(null);
						user.setDeactivatedAt(null);
						user.setSignupAt(null);
						user.setSalt(null);
						urs.close();
						Ticket ticket = tdao.get(attendant.getTicket().getID());
						ticket.setCurrentAmount(null);
						ticket.setHide(null);
						ticket.setAmount(null);
						ticket.setPurchaseLimit(null);
						ticket.setStartDate(null);
						ticket.setType(null);
						ticket.setEndDate(null);
						
						HashMap<String, Object> map = new HashMap<>();
						map.put("user", user);
						map.put("payment", paymentList);
						map.put("ticket", ticket);
						list.add(map);
						paymentList = new ArrayList<>();
					}
					attendant.setUserUUID(null);
					attendant.setTicket(null);
					attendant.setHostID(null);
					attendantList.add(attendant);
				}
				ars.close();
			}
		} catch(Exception e) {
			e.printStackTrace();
			list = null;
		} finally {
			try {
				if(astmt != null) astmt.close();
				if(ustmt != null) ustmt.close();
				if(ars != null) ars.close();
				if(urs != null) urs.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		
		return list;
	}
	
	public int count(String userUUID, long ticketID) {
		String query = "SELECT COUNT(case when user_uuid = ? AND ticket_id = ? AND state != ? then 1 end) FROM " + getTable();

		PreparedStatement pstmt = null;
		ResultSet rs = null;
		try {
			pstmt = conn.prepareStatement(query);
			pstmt.setBytes(1, CryptoHelper.hexStringToByteArray(userUUID));
			pstmt.setLong(2, ticketID);
			pstmt.setString(3, Attendant.State.REFUND.name());
			rs = pstmt.executeQuery();
			if (rs.next()) {
				return rs.getInt(1);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				if(rs != null) rs.close();
				if(pstmt != null) pstmt.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return -1;
	}
}