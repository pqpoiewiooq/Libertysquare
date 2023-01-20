package account;

import java.io.Serializable;

public class User implements Serializable {
	private static final long serialVersionUID = 1036680564579079582L;

	public enum State { ACTIVATE, DEACTIVATE, DORMANCY }
	public enum National { DOMESTIC, FOREIGN }
	
	private String uuid;
	private String id;
	private byte[] pw;
	private String salt;
	private State state;
	
	private String name;
	private String nickname;
	private Integer birth;
	private Integer gender;
	private National national;
	
	private String DI; // 64
	private String mobileCorp;
	
	private String profilePath;
	
	private String fcmToken;
	
	private String deactivatedAt;
	private String signupAt;
	
	public String getUUID() {
		return this.uuid;
	}
	
	public void setUUID(String uuid) {
		this.uuid = uuid;
	}

	public String getID() {
		return id;
	}

	public void setID(String id) {
		this.id = id;
	}

	public byte[] getPassword() {
		return pw;
	}

	public void setPassword(byte[] pw) {
		this.pw = pw;
	}
	
	public String getSalt() {
		return this.salt;
	}
	
	public void setSalt(String salt) {
		this.salt = salt;
	}
	
	public void setState(State state) {
		this.state = state;
	}
	
	public State getState() {
		return this.state;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getNickname() {
		return this.nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	public Integer getBirth() {
		return birth;
	}

	public void setBirth(Integer birth) {
		this.birth = birth;
	}
	
	public Integer getGender() {
		return gender;
	}

	public void setGender(Integer gender) {
		this.gender = gender;
	}
	
	public National getNational() {
		return this.national;
	}
	
	public void setNational(National national) {
		this.national = national;
	}

	public String getDeactivatedAt() {
		return this.deactivatedAt;
	}

	public String getDI() {
		return this.DI;
	}
	
	public void setDI(String DI) {
		this.DI = DI;
	}
	
	public String getMobileCorp() {
		return this.mobileCorp;
	}
	
	public void setMobileCorp(String mobileCorp) {
		this.mobileCorp = mobileCorp;
	}
	
	public String getProfilePath() {
		return this.profilePath;
	}
	
	public void setProfilePath(String path) {
		this.profilePath = path;
	}
	
	public void setDeactivatedAt(String deactivatedAt) {
		this.deactivatedAt = deactivatedAt;
	}

	public String getSignupAt() {
		return this.signupAt;
	}

	public void setSignupAt(String signupAt) {
		this.signupAt = signupAt;
	}
	
	public String getFCMToken() {
		return fcmToken;
	}
	
	public void setFCMToken(String fcmToken) {
		this.fcmToken = fcmToken;
	}
	
}
