package data;

import java.io.Serializable;
import java.util.Arrays;

public class Host implements Serializable{
	private static final long serialVersionUID = -95472405148014799L;
	
	private long hostID = -1;
	private String name;
	private String introduceSimple;
	private String introduce;
	private String[] members;
	private String sincee;
	private String themeColor;
	
	private String coverPath;
	private String profilePath;
	
	private String venue;
	private String detailVenue;
	
	// detail
	private String[] subscribes;
	private Integer subscribeCount = 0;
	private boolean hasSubscribed;
	private Integer eventCount;
	private Integer supportCount;
	private Integer attendantCount;
	
	
	/* Setter */
	public void setID(long id) {
		this.hostID = id;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public void setIntroduceSimple(String simple) {
		this.introduceSimple = simple;
	}
	
	public void setIntroduce(String introduce) {
		this.introduce = introduce;
	}
	
	public void setMembers(String[] members) {
		this.members = members;
	}
	
	public void setSince(String dt) {
		this.sincee = dt;
	}
	
	/**
	 * @param hex Set after subtracting '#'
	 */
	public void setThemeColor(String hex) {
		this.themeColor = hex;
	}
	
	public void setCoverPath(String path) {
		this.coverPath = path;
	}
	
	public void setProfilePath(String path) {
		this.profilePath = path;
	}
	
	
	public void setVenue(String venue) {
		this.venue = venue;
	}
	
	public void setDetailVenue(String detailVenue) {
		this.detailVenue = detailVenue;
	}
	
	public void setSubscribes(String[] subscribes) {
		this.subscribes = subscribes;
	}
	
	public void setSubscribeCount(Integer count) {
		this.subscribeCount = count;
	}
	
	public void setSubscribed(boolean subscribed) {
		this.hasSubscribed = subscribed;
	}
	
	public void setEventCount(Integer count) {
		this.eventCount = count;
	}
	
	public void setSupportCount(Integer count) {
		this.supportCount = count;
	}
	
	public void setAttendantCount(Integer count) {
		this.attendantCount = count;
	}
	
	/* Getter */
	public long getID() {
		return this.hostID;
	}
	
	public String getName() {
		return this.name;
	}
	
	public String getIntroduceSimple() {
		return this.introduceSimple;
	}
	
	public String getIntroduce() {
		return this.introduce;
	}
	
	public String[] getMembers() {
		return this.members;
	}
	
	public boolean containMember(String memberID) {
		if(this.members == null) return false;
		return Arrays.stream(getMembers()).anyMatch(host -> host.equals(memberID));
	}
	
	public String getSince() {
		return this.sincee;
	}
	
	public String getThemeColor() {
		return this.themeColor;
	}
	
	public String getCoverPath() {
		return this.coverPath;
	}
	
	public String getProfilePath() {
		return this.profilePath;
	}
	
	public String getVenue() {
		return this.venue;
	}
	
	public String getDetailVenue() {
		return this.detailVenue;
	}
	
	public String[] getSubscribes() {
		return this.subscribes;
	}
	
	public Integer getSubscribeCount() {
		return this.subscribeCount;
	}
	
	public boolean hasSubscribed() {
		return this.hasSubscribed;
	}
	
	public Integer getEventCount() {
		return this.eventCount;
	}
	
	public Integer getSupportCount() {
		return this.supportCount;
	}
	
	public Integer getAttendantCount() {
		return this.attendantCount;
	}
}



/*
CREATE TABLE host (id int(10) NOT NULL AUTO_INCREMENT PRIMARY KEY
, name varchar(40) NOT NULL
, introduce_simple tinytext
, introduce text
, member text NOT NULL
, start_time timestamp DEFAULT 0
, theme_color varchar(6) DEFAULT 'FF2D54'
, gen_time timestamp DEFAULT CURRENT_TIMESTAMP);
*/