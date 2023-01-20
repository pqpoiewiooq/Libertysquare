package community.entity;

import java.util.List;

public class PostVO {
	private Post post;
	private List<Comment> comment;
	private String boardName;
	private String board;
	
	public PostVO(Post post, List<Comment> comment, Board board) {
		this.post = post;
		this.comment = comment;
		if(board != null) {
			this.boardName = board.ko();
			this.board = board.ordinal() + "";
		}
	}
	
	public Post getPost() {
		return this.post;
	}
	
	public List<Comment> getComment() {
		return this.comment;
	}
	
	public String getBoardName() {
		return this.boardName;
	}
	
	public String getBoard() {
		return this.board;
	}
}
