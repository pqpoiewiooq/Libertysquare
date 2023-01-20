package data;

import java.io.Serializable;

import com.google.gson.GsonBuilder;

public class Support implements Serializable{
	private static final long serialVersionUID = -6865241623848726701L;
	
	public static final int LIMIT_TITLE = 55;
	public static final int LIMIT_APPLY_LINK = 512;
	public static final int LIMIT_CATEGORY = 3;
	public static final int LIMIT_HASHTAG = 5;
	public static final int LIMIT_HASHTAG_STRING = 65535 / LIMIT_HASHTAG;
	
	
	private Integer id;
	private String uuid;
	
	private String link;
	private Boolean isPublic;
	private String title;
	private String contactEmail;
	private String contactTel;
	private Account account;
	private SupportCategory[] categories;
	private BusinessType businessType;
	private String[] hashtags;// = null;
	private String content;
	private Long hostID;

	private String genDateTime;
	private String updateDateTime;
	
	private String coverPath;
	
	// 전달용 data field
	private String hostName;
	public void setHostName(String hostName) { this.hostName = hostName; }
	public String getHostName() { return this.hostName; }
	
	
	/* Setter */
	public void setID(Integer id) {
		this.id = id;
	}
	
	public void setUUID(String uuid) {
		this.uuid = uuid;
	}
	
	public void setLink(String url) {
		this.link = url;
	}

	public void setPublic(Boolean isPublic) {
		this.isPublic = isPublic;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	public void setContactEmail(String email) {
		this.contactEmail = email;
	}
	
	public void setContactTel(String tel) {
		this.contactTel = tel;
	}
	
	public void setAccount(Account account) {
		this.account = account;
	}
	
	public void setCategories(SupportCategory[] categories) {
		this.categories = categories;
	}
	
	public void setBusinessType(BusinessType businessType) {
		this.businessType = businessType;
	}
	
	public void setHashtags(String[] hashtags) {
		this.hashtags = hashtags;
	}
	
	public void setContent(String content) {
		this.content = content;
	}
	
	public void setHost(Long hostID) {
		this.hostID = hostID;
	}
	
	public void setGeneratedDateTime(String dt) {
		this.genDateTime = dt;
	}
	
	public void setUpdateDateTime(String dt) {
		this.updateDateTime = dt;
	}
	
	public void setCoverPath(String path) {
		this.coverPath = path;
	}
	
	/* Getter */
	public Integer getID() {
		return this.id;
	}
	
	public String getUUID() {
		return this.uuid;
	}
	
	public String getLink() {
		return this.link;
	}
	
	public Boolean isPublic() {
		return this.isPublic;
	}
	
	public String getTitle() {
		return this.title;
	}
	
	public String getContactEmail() {
		return this.contactEmail;
	}
	
	public String getContactTel() {
		return this.contactTel;
	}
	
	public Account getAccount() {
		return this.account;
	}
	
	public String getCoverPath() {
		return this.coverPath;
	}
	
	public SupportCategory[] getCategories() {
		return this.categories;	
	}
	
	public BusinessType getBusinessType() {
		return this.businessType;
	}
	
	public String[] getHashtags() {
		return this.hashtags;
	}
	
	public String getHashtagsJson() {
		 return (new GsonBuilder()).create().toJson(getHashtags());
	}
	
	public String getContent() {
		return this.content;
	}
	
	public Long getHost() {
		return this.hostID;
	}
	
	public String getGeneratedDateTime() {
		return this.genDateTime;
	}
	
	public String getUpdateDateTime() {
		return this.updateDateTime;
	}
}