package servlet.util;

import javax.servlet.http.HttpServletRequest;

import community.entity.Board;
import community.entity.Post;
import exception.MyServletException;
import servlet.restapi.ImageAPI;

public class PostParser extends MyParser {
	private boolean isPatchMode = false;
	
	public PostParser(HttpServletRequest request) {
		super(request);
	}
	
	public PostParser(HttpServletRequest request, boolean isPatchMode) {
		super(request, isPatchMode);
		this.isPatchMode = isPatchMode;
	}
	
	public Post parse() throws MyServletException {
		Post post = new Post();
		
		if(!isPatchMode) {
			post.setBoard(getBoard("board"));
		}
		post.setAnonymity(getBoolean("isAnonymity"));
		post.setQuestion(getBoolean("isQuestion"));
		post.setTitle(get("title", 300));
		
		String content = getHTML("content", 150000);
		content = ImageAPI.uploadWith(request, ImageAPI.POST_ROOT, content, getImageList("content_img", true));
		post.setContent(content);
		
		return post;
	}
	
	public Board getBoard(String param) throws MyServletException {
		return Board.ordinalOf(getInt(param, Board.values.length - 1));
	}
}