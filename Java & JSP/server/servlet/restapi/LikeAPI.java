package servlet.restapi;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import community.dao.CommentLikeDAO;
import community.dao.PostLikeDAO;
import exception.MyServletException;
import servlet.common.MyHttpServlet;
import servlet.util.ServletHelper;

public class LikeAPI extends MyHttpServlet {
	private static final long serialVersionUID = 101544298007958779L;

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws MyServletException, IOException {
		String uri = request.getRequestURI();
		long id = ServletHelper.getPathLong(request, 3);
		byte[] requester = getUserUuid(request);
		
		if(uri.startsWith("/like/post")) {
			togglePostLike(requester, id);
		} else if(uri.startsWith("/like/comment")) {
			toggleCommentLike(requester, id);
		}
	}
	
	private void togglePostLike(byte[] requester, long postId) throws MyServletException, IOException {
		processDAO(PostLikeDAO.class, dao -> {
			dao.toggle(postId, requester);
		});
	}
	
	private void toggleCommentLike(byte[] requester, long commentId) throws MyServletException, IOException {
		processDAO(CommentLikeDAO.class, dao -> {
			dao.toggle(commentId, requester);
		});
	}
}
