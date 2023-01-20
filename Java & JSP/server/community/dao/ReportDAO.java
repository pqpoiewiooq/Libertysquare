package community.dao;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import community.entity.Comment;
import community.entity.Post;
import dao.DefaultDAO;
import database.Table;
import database.query.InsertQuery;
import database.query.QueryFactory;
import database.query.SelectQuery;
import exception.MyServletException;
import net.MailSender;
import util.CryptoHelper;

public class ReportDAO extends DefaultDAO<Void> {
	public static final int LENGTH_REASON = 100;
	
	private static final ExecutorService executor = Executors.newSingleThreadExecutor();
	private static final String BR = "<br>";
	
	public ReportDAO() {
		super(null);
	}

	@Deprecated
	public long insert(Void v) {
		return 0;
	}
	
	public long report(Table table, long targetId, byte[] reporter, String reason) {
		String tableName = table.toString();
		String reportTable = tableName + "_report";
		
		SelectQuery existsQuery = QueryFactory.select(reportTable)
				.addResult("reporter")
				.eq(tableName, targetId)
				.and()
				.eq("reporter", reporter);

		boolean exists = executeExists(existsQuery);
		if(exists) throw MyServletException.CONFLICT;
		
		SelectQuery select = QueryFactory.select(tableName)
				.eq("id", targetId);
		executeQuery(select, sequence -> {
			switch(table) {
				case POST:
					Post post = PostDAO.parse(sequence);
					if(post == null) throw MyServletException.NOT_FOUND;
					
					executor.execute(() -> {
						String subject = "[신고 - 게시글] FLATTOP";
						StringBuffer buffer = new StringBuffer();
						buffer.append("===== 신고인 정보 =====").append(BR)
							.append("[uuid] ").append(CryptoHelper.byteArrayToHexString(reporter)).append(BR)
							.append(BR)
							.append("===== 신고 대상 정보 =====").append(BR)
							.append("[URL] ").append("https://flattop.kr/post/").append(targetId).append(BR)
							.append("[작성자 uuid] ").append(CryptoHelper.byteArrayToHexString(post.getWriter())).append(BR)
							.append("===== 신고 사유 =====").append(BR)
							.append(reason).append(BR)
							.append("===== 내용 =====").append(BR)
							.append(post.getContent());
						
						MailSender.send(subject, buffer.toString());
					});
					
					break;
				case COMMENT:
					Comment comment = CommentDAO.parse(sequence);
					if(comment == null) throw MyServletException.NOT_FOUND;
					
					executor.execute(() -> {
						String subject = "[신고 - 댓글] FLATTOP";
						StringBuffer buffer = new StringBuffer();
						buffer.append("===== 신고인 정보 =====").append(BR)
							.append("[uuid] ").append(CryptoHelper.byteArrayToHexString(reporter)).append(BR)
							.append(BR)
							.append("===== 신고 대상 정보 =====").append(BR)
							.append("[ID] ").append(targetId).append(BR)
							.append("[URL] ").append("https://flattop.kr/post/").append(comment.getPost()).append(BR)
							.append("[작성자 uuid] ").append(CryptoHelper.byteArrayToHexString(comment.getUser())).append(BR)
							.append("===== 신고 사유 =====").append(BR)
							.append(reason).append(BR)
							.append("===== 내용 =====").append(BR)
							.append(comment.getComment());
						
						MailSender.send(subject, buffer.toString());
					});
					
					break;
				default:
					throw MyServletException.UNPROCESSABLE_ENTITY;
			}
		});
		
		InsertQuery query = QueryFactory.insert(reportTable)
				.add(null)
				.add(targetId)
				.add(reporter)
				.add(reason)
				.add(null);// 신고 시간
		
		return executeInsert(query);
	}
}
