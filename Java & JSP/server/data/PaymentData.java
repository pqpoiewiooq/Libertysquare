package data;

import java.util.Objects;

import account.User;
import util.JsonUtil;

public class PaymentData {
	public static enum State {PAID, REFUND}
	
	private TossData data = new TossData();
	private long id;
	private String paymentKey;
	private User user;
	private long eventID;
	private long hostID;
	private Ticket ticket;
	private int ticketAmount;
	private State state;
	private String refundTime;
	private String approvedTime;
	private Long requestTime;

	public void setID(long id) {
		this.id = id;
	}
	
	public void setOrderId(String orderId) {
		data.orderId = orderId;
	}

	public void setAmount(int amount) {
		data.amount = amount;
	}

	public void setOrderName(String orderName) {
		data.orderName = orderName;
	}
	
	public void setPaymentKey(String paymentKey) {
		this.paymentKey = paymentKey;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public void setEventID(long eventID) {
		this.eventID = eventID;
	}
	
	public void setHostID(long hostID) {
		this.hostID = hostID;
	}

	public void setTicket(Ticket ticket) {
		this.ticket = ticket;
	}

	public void setTicketAmount(int ticketAmount) {
		this.ticketAmount = ticketAmount;
	}
	
	public void setState(State state) {
		this.state = state;
	}
	
	public void setRefundTime(String time) {
		this.refundTime = time;
	}
	
	public void setApprovedTime(String time) {
		this.approvedTime = time;
	}

	public void setRequestTime(long time) {
		this.requestTime = time;
	}
	
	public long getID() {
		return this.id;
	}
	
	public String getOrderId() {
		return data.orderId;
	}

	public int getAmount() {
		return data.amount;
	}

	public String getOrderName() {
		return data.orderName;
	}

	public String getPaymentKey() {
		return this.paymentKey;
	}
	
	public User getUser() {
		return this.user;
	}

	public long getEventID() {
		return this.eventID;
	}

	public long getHostID() {
		return this.hostID;
	}
	
	public Ticket getTicket() {
		return this.ticket;
	}

	public int getTicketAmount() {
		return this.ticketAmount;
	}
	
	public State getState() {
		return this.state;
	}
	
	public String getRefundTime() {
		return this.refundTime;
	}
	
	public String getApprovedTime() {
		return this.approvedTime;
	}

	public long getRequestTime() {
		return this.requestTime;
	}

	public boolean compare(User user, String orderId, int amount) throws NullPointerException {
		return (user.getUUID().equals(this.user.getUUID()) && orderId.equals(data.orderId) && data.amount == amount);
	}

	public String toJson() {
		return JsonUtil.toJson(data);
	}

	/**
	 * compare to orderId;
	 */
	@Override
	public boolean equals(Object o) {
		return this == o || data.orderId.equals(o);
	}

	@Override
	public int hashCode() {
		return Objects.hash(data, user);
	}

	private class TossData {
		String orderId;
		int amount;
		String orderName;
	}
}