package dao;

import java.util.ArrayList;

import account.User;
import data.Event;
import data.PaymentData;
import data.Ticket;
import database.Table;
import database.query.InsertQuery;
import database.query.QueryFactory;
import database.query.SelectQuery;
import database.query.UpdateQuery;
import util.CryptoHelper;

public class PaymentDAO extends DefaultDAO<PaymentData> {

	protected PaymentDAO() {
		super(Table.PAYMENT);
	}

	@Override
	public synchronized long insert(PaymentData data) {
		InsertQuery query = QueryFactory.insert(getTable())
				.add(null)
				.addToBytes(data.getOrderId())
				.add(data.getPaymentKey())
				.addToBytes(data.getUser().getUUID())
				.add(data.getEventID())
				.add(data.getHostID())
				.add(data.getTicket().getID())
				.add(data.getAmount())
				.add(PaymentData.State.PAID.name())
				.add(null)
				.add(data.getApprovedTime());
		
		return executeInsert(query);
	}
	
	public boolean refundPayment(long paymentID, String time) {
		UpdateQuery query = QueryFactory.update(getTable())
				.set("state", PaymentData.State.REFUND.name())
				.set("refund_time", time)
				.eq("id", paymentID);
		
		return executeUpdate(query);
	}
	
	public PaymentData get(long paymentID) {
		SelectQuery query = QueryFactory.select(getTable())
				.eq("id", paymentID);
		
		return executeQuery(query, sequence -> {
			if(sequence.next()) {
				PaymentData data = new PaymentData();
				
				data.setID(sequence.nextLong());
				data.setOrderId(CryptoHelper.byteArrayToHexString(sequence.nextBytes()));
				data.setPaymentKey(sequence.nextString());
				User user = new User();
				user.setUUID(CryptoHelper.byteArrayToHexString(sequence.nextBytes()));
				data.setUser(user);
				data.setEventID(sequence.nextLong());
				data.setHostID(sequence.nextLong());
				Ticket ticket = new Ticket();
				ticket.setID(sequence.nextLong());
				data.setTicket(ticket);
				data.setAmount(sequence.nextInt());
				data.setState(sequence.nextFrom(PaymentData.State::valueOf));
				data.setRefundTime(sequence.nextString());
				data.setApprovedTime(sequence.nextString());
				
				return data;
			}
			return null;
		});
	}

	public ArrayList<Event> getPurchasedEventList(String userUUID) {
		return EventDAO.getList(conn, 0, "FROM event WHERE id IN (SELECT event_id FROM payment WHERE buyer = UNHEX('" + userUUID + "') AND state = '" + PaymentData.State.PAID.name() + "')", false, false, true, -1);
	}
	
	
}
