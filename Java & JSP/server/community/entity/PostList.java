package community.entity;

import java.util.List;

public class PostList {
	private String board;
	private String uri;
	private List<Post> posts;
	
	public PostList(String board, String uri, List<Post> posts) {
		this.board = board;
		this.uri = uri;
		this.posts = posts;
	}
	
	public PostList(Board board, List<Post> posts) {
		this.board = board.ko();
		this.uri = board.ordinal() + "";
		this.posts = posts;
	}
	
	public String getBoardName() {
		return this.board;
	}
	
	public String getUri() {
		return this.uri;
	}
	
	public List<Post> getPosts() {
		return this.posts;
	}
}
