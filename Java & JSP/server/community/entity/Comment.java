package community.entity;

import account.SimpleUserInfo;

public class Comment extends BaseCommunityEntity {
	private Long post;
	private byte[] user;
	private String comment;
	private Long parent;
	private Integer depth;
	private Boolean isDeleted;
	
	private Boolean isPostWriter;
	
	public void setPost(long postId) {
		this.post = postId;
	}
	
	public long getPost() {
		return this.post;
	}
	
	public void setUser(byte[] userId) {
		this.user = userId;
	}
	
	public byte[] getUser() {
		return this.user;
	}
	
	public void setComment(String comment) {
		this.comment = comment;
	}
	
	public String getComment() {
		return this.comment;
	}
	
	public void setParent(Long parent) {
		this.parent = parent;
	}
	
	public Long getParent() {
		return this.parent;
	}
	
	public void setDepth(Integer depth) {
		this.depth = depth;
	}
	
	public Integer getDepth() {
		return this.depth;
	}
	
	public void setDeleted(Boolean deleted) {
		this.isDeleted = deleted;
	}
	
	public void delete() {
		this.post = null;
		this.user = null;
		setAnonymity(null);
		this.isDeleted = true;
		setGeneratedAt(null);
		setLikes(null);
		setLiked(null);
		setWriterInfo(SimpleUserInfo.deleted);
		this.isPostWriter = null;
	}
	
	public Boolean isDeleted() {
		return this.isDeleted;
	}
	
	public void setPostWriter(Boolean isPostWriter) {
		this.isPostWriter = isPostWriter;
	}
	
	public Boolean isPostWriter() {
		return this.isPostWriter;
	}
}
