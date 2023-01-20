package servlet.restapi;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import community.dao.CommentDAO;
import community.dao.PostDAO;
import community.entity.Comment;
import community.entity.Post;
import dao.DAOFactory;
import dao.UserDAO;
import exception.MyServletException;
import net.FirebaseMessage;
import net.FirebaseSender;
import servlet.common.MyHttpServlet;
import servlet.common.ServletStatus;
import servlet.util.RequestParser;
import util.CryptoHelper;

public class CommentAPI extends MyHttpServlet {
	private static final long serialVersionUID = 5978793449747165809L;

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws MyServletException, IOException {
		byte[] userUUID = getUserUuid(request);
		
		long postId = RequestParser.getLong(request, "post");
		String comment = RequestParser.get(request, "comment", 3000);
		boolean isAnonymity = RequestParser.getBoolean(request, "isAnonymity", null);
		long parent = RequestParser.getLong(request, "parent", null, true);
		if(parent < 0) throw new MyServletException(ServletStatus.INVALID_PARAMETER, "parent");
		
		Comment item = new Comment();
		item.setPost(postId);
		item.setUser(userUUID);
		item.setComment(comment);
		item.setAnonymity(isAnonymity);
		if(parent > 0) item.setParent(parent);
		
		processDAO(CommentDAO.class, dao -> {
			dao.insert(item);
			
			requestNotification(postId, parent, userUUID);
			
			printJson(response, dao.getByPostId(postId, userUUID));
		});
	}
	
	@Override
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws MyServletException, IOException {
		byte[] userUUID = getUserUuid(request);
		
		long commentId = RequestParser.getInt(request, "id");
		
		processDAO(CommentDAO.class, dao -> {
			Long 삭제된코멘트의게시글Id = dao.delete(commentId, userUUID, response.getWriter());
			
			printJson(response, dao.getByPostId(삭제된코멘트의게시글Id, userUUID));
		});
	}
	
	private void requestNotification(long postId, long parent, byte[] userUUID) {
		FirebaseSender.execute(() -> {
			try {
				processDAO(PostDAO.class, postDAO -> {
					UserDAO userDAO = DAOFactory.convert(postDAO, UserDAO.class);
					
					Post post = postDAO.get(postId);
					byte[] postWriter = post.getWriter();
					
					// 내가 쓴 글이 아닌 경우에만 알림
					if(!CryptoHelper.evaluateSHA512(postWriter, userUUID)) {
						String fcmToken = userDAO.getFcmToken(post.getWriter());
						FirebaseSender.send(FirebaseMessage
								.comment(post.getTitle(), postId)
								.to(fcmToken)
								.build());
					}
					
					// 대댓글인 경우 부모 댓글 유저에게 알림
					if(parent > 0) {
						// 별도 thread에서 실행되는 것이라서 첫 processDAO에서 가져온 dao 변수 사용시 오류 발생.
						CommentDAO commentDAO = DAOFactory.convert(postDAO, CommentDAO.class);
						Comment parentComment = commentDAO.get(parent);
						if(parentComment != null) {
							byte[] parentCommentWriter = parentComment.getUser();
							if(!CryptoHelper.evaluateSHA512(parentCommentWriter, userUUID)) {
								String fcmToken = userDAO.getFcmToken(parentCommentWriter);
								FirebaseSender.send(FirebaseMessage
										.nestedComment(post.getTitle(), postId)
										.to(fcmToken)
										.build());
							}
						}
					}
					
				});
			} catch (IOException e) {
				e.printStackTrace();
			}
		});
	}
}
