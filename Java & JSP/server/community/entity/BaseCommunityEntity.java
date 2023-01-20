package community.entity;

import java.time.LocalDateTime;

import account.SimpleUserInfo;

public class BaseCommunityEntity {
	private long id;

	private SimpleUserInfo writerInfo;
	private Boolean isMine;
	
	private Boolean isAnonymity;

	private Integer likes;
	private Boolean isLiked;
	
	private Boolean isBlocked;

	private LocalDateTime generatedAt;
	
	public void setId(long id) {
		this.id = id;
	}
	
	public long getId() {
		return this.id;
	}
	
	public void setWriterInfo(SimpleUserInfo user) {
		this.writerInfo = user;
	}
	
	public SimpleUserInfo getWriterInfo() {
		return this.writerInfo;
	}
	
	public void setMine(Boolean isMine) {
		this.isMine = isMine;
	}
	
	public Boolean isMine() {
		return this.isMine;
	}
	

	public void setAnonymity(Boolean isAnonymity) {
		this.isAnonymity = isAnonymity;
	}
	
	public Boolean isAnonymity() {
		return this.isAnonymity;
	}
	
	public void setLikes(Integer likes) {
		this.likes = likes;
	}
	
	public Integer getLikes() {
		return this.likes;
	}
	
	public void setLiked(Boolean isLiked) {
		this.isLiked = isLiked;
	}
	
	public Boolean isLiked() {
		return this.isLiked;
	}

	public void setBlocked(Boolean isBlocked) {
		this.isBlocked = isBlocked;
	}
	
	public Boolean isBlocked() {
		return this.isBlocked;
	}
	
	public void setGeneratedAt(LocalDateTime generatedDateTime) {
		this.generatedAt = generatedDateTime;
	}
	
	public LocalDateTime getGeneratedAt() {
		return this.generatedAt;
	}
	
}
