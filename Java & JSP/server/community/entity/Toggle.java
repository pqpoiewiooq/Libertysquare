package community.entity;

public class Toggle {
	private long id;
	private long targetId;
	private byte[] user;
	
	public void setId(long id) {
		this.id = id;
	}
	
	public long getId() {
		return this.id;
	}
	
	public void setTargetId(long targetId) {
		this.targetId = targetId;
	}
	
	public long getTargetId() {
		return this.targetId;
	}
	
	public void setUser(byte[] user) {
		this.user = user;
	}
	
	public byte[] getUser() {
		return this.user;
	}
}
