package data;

public class Attendant {
	public static enum State {
		REFUND, WAIT, APPROVE, ATTEND
	} 
	
	private Long id;
	private Long paymentID;
	private Long hostID;
	private Ticket ticket;
	private String userUUID;
	private State state;
	private String paymentTime;
	
	public void setID(Long id) {
		this.id = id;
	}
	
	public void setPaymentID(Long paymentID) {
		this.paymentID = paymentID;
	}
	
	public void setHostID(Long hostID) {
		this.hostID = hostID;
	}
	
	public void setTicket(Ticket ticket) {
		this.ticket = ticket;
	}
	
	public void setUserUUID(String userUUID) {
		this.userUUID = userUUID;
	}
	
	public void setState(State state) {
		this.state = state;
	}
	
	public void setPaymentTime(String paymentTime) {
		this.paymentTime = paymentTime;
	}
	
	
	public Long getID() {
		return this.id;
	}
	
	public Long getPaymentID() {
		return this.paymentID;
	}
	
	public Long getHostID() {
		return this.hostID;
	}
	
	public Ticket getTicket() {
		return this.ticket;
	}
	
	public String getUserUUID() {
		return this.userUUID;
	}
	
	public State getState() {
		return this.state;
	}
	
	public String getPaymentTime() {
		return this.paymentTime;
	}
}
