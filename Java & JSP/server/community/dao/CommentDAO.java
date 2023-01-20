package community.dao;

import java.io.PrintWriter;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import account.SimpleUserInfo;
import community.entity.Comment;
import community.entity.Post;
import dao.DefaultDAO;
import database.ResultSetSequence;
import database.Table;
import database.query.InsertQuery;
import database.query.QueryFactory;
import database.query.SelectQuery;
import database.query.UpdateQuery;
import exception.MyServletException;
import servlet.common.ServletStatus;
import util.CryptoHelper;

public class CommentDAO extends DefaultDAO<Comment> {
	
	public CommentDAO() {
		super(Table.COMMENT);
	}
	
	@Override
	public synchronized long insert(Comment comment) {
		Long parent = comment.getParent();
		InsertQuery query = QueryFactory.insert(Table.COMMENT)
				.add(null)
				.add(comment.getPost())
				.add(comment.getUser())
				.add(comment.getComment())
				.add(comment.isAnonymity())
				.add(parent)
				// mysql은 INSERT, UPDATE, DELETE시, 서브쿼리로 동일 테이블에서 값을 가져오려고 하면 오류를 내기때문에, SELECT문으로 감싸서 사용
				// "(IFNULL((SELECT depth FROM (SELECT depth FROM comment WHERE id = " + parent + ") d), 0) + 1)"
				// 하려 했으나, DB단에서 Trigger 이용해서 직접 값을 넣도록 설정해놓았음. 단, NOT NULL 제약 조건은 걸어놓아서, 값은 1을 넘기는 것으로 설정
				.addCommand("1")
				.add(false)
				.add(null)
				.add(null);
		return executeInsert(query);
	}
	
	protected static Comment parse(ResultSetSequence sequence) {
		Comment comment = null;
		try {
			if(!sequence.next()) return null;
			
			comment = new Comment();
			comment.setId(sequence.nextLong());
			comment.setPost(sequence.nextLong());
			comment.setUser(sequence.nextBytes());
			comment.setComment(sequence.nextString());
			comment.setAnonymity(sequence.nextBoolean());
			comment.setParent(sequence.nextLongN());
			comment.setDepth(sequence.nextInt());
			comment.setDeleted(sequence.nextBoolean());
			comment.setGeneratedAt(sequence.nextLocalDateTime());
			sequence.jump(1);// update_time
		} catch (Exception e) {
			e.printStackTrace();
			comment = null;
		}
		return comment;
	}
	
	@Override
	public Comment get(long id) {
		SelectQuery query = QueryFactory.select(getTable())
				.eq("id", id);
		
		return executeQuery(query, CommentDAO::parse);
	}
	
	@Override
	public synchronized boolean update(Comment comment) {
		UpdateQuery query = QueryFactory.update(Table.COMMENT)
				.set("comment", comment.getComment())
				.eq("id", comment.getId());
		
		return executeUpdate(query);
	}
	
	/**
	 * 삭제 실패시 NULL<br>
	 * 삭제 성공시 post id
	 * @throws  
	 */
	public synchronized long delete(long id, byte[] requester, PrintWriter writer) {
		CallableStatement cstmt = null;
		ResultSet rs = null;
		try {
			cstmt = conn.prepareCall("{CALL lsweb.PROC_DELETE_COMMENT(?, ?)}");
			cstmt.setLong(1, id);
			cstmt.setBytes(2, requester);
			
			rs = cstmt.executeQuery();
			if(!rs.next()) throw new MyServletException(ServletStatus.DB_ERROR);
			
			return rs.getLong(1);
		} catch (SQLException e) {
			e.printStackTrace(writer);
			throw new MyServletException(ServletStatus.DB_ERROR);
		} finally {
			try {
				if(rs != null) rs.close();
				if(cstmt != null) cstmt.close();
			} catch(SQLException e) {}
		}
	}
	
	
	public List<Comment> getByPostId(long postId, byte[] requester) {
		SelectQuery postSelect = QueryFactory.select(Table.POST)
				.addResults("writer", "isAnonymity")
				.eq("id", postId);
		Post post = executeQuery(postSelect, sequence -> {
			if(sequence.next()) {
				Post p = new Post();
				p.setId(postId);
				p.setWriter(sequence.nextBytes());
				p.setAnonymity(sequence.nextBoolean());
				return p;
			}
			throw new MyServletException(ServletStatus.NOT_FOUND, "post");
		});

		return getByPost(post, requester);
	}
	
	
	public List<Comment> getByPost(Post post, byte[] requester) {
		SelectQuery query = QueryFactory.select(Table.COMMENT + " INNER JOIN user ON user.uuid=comment.user")
				// 좋아요
				.from("LEFT OUTER JOIN (SELECT comment, MAX(user=?) as liked, COUNT(*) as likes FROM comment_like GROUP BY comment) comment_like ON comment_like.comment=comment.id", requester)
				.addResults("IFNULL(comment_like.likes, 0)", "IFNULL(comment_like.liked, FALSE)")
				// 차단
				.from("LEFT OUTER JOIN comment_block ON comment_block.user=? AND comment_block.comment=comment.id", requester)
				.addResult("comment_block.id IS NOT NULL")
				// 기본 정보들
				.addResult("comment.*")
				.addResults("user.nickname", "user.path_profile")
				.eq("comment.post", post.getId())
				.orderBy("IF(ISNULL(comment.parent), comment.id, comment.parent), comment.depth, comment.gen_time");
		
		return executeQuery(query, sequence -> {
			byte[] postWriter = post.getWriter();
			List<Comment> list = new ArrayList<>();
			
			while(sequence.next()) {
				Comment comment = new Comment();
				
				comment.setLikes(sequence.nextInt());
				comment.setLiked(sequence.nextBoolean());
				
				boolean isBlocked = sequence.nextBoolean();
				
				comment.setId(sequence.nextLong());
				sequence.jump(1);// comment.post
				byte[] writer = sequence.nextBytes();
				if(CryptoHelper.evaluateSHA512(writer, requester)) {
					comment.setMine(true);
				}
				comment.setComment(sequence.nextString());
				boolean isAnonymity = sequence.nextBoolean();
				if(isAnonymity == post.isAnonymity() && CryptoHelper.evaluateSHA512(writer, postWriter)) {
					comment.setPostWriter(true);
				}
				comment.setParent(sequence.nextLongN());
				comment.setDepth(sequence.nextInt());
				
				// 댓글 상태에 따른 분기(삭제/익명/차단)
				if(sequence.nextBoolean()) {// deleted
					comment.delete();
				} else {
					comment.setGeneratedAt(sequence.nextLocalDateTime());
					
					if(isBlocked) {
						comment.setBlocked(isBlocked);
						comment.setComment("차단하신 댓글입니다.");
					}
					
					if(isAnonymity) {// 익명인 경우
						comment.setUser(writer);// 익명 순서를 정하기 위한 식별자로, 유저 정보가 필요해서 임시로 setUser로 설정
					} {
						sequence.jump(1);//comment.update_time
						String nickname = sequence.nextString();
						String profilePath = sequence.nextString();
						comment.setWriterInfo(SimpleUserInfo.instance(nickname, profilePath));
					}
				}
				
				list.add(comment);
			}
			
			int anonymousCount = 0;
			Map<byte[], SimpleUserInfo> anonymousMap = new HashMap<>();
			anonymousMap.put(postWriter, SimpleUserInfo.writer);
			List<Comment> anonymousSortingList = new ArrayList<>();
			for(Comment comment : list) {
				if(comment.getWriterInfo() == null) { // 익명인 comment만 정렬 리스트에 추가
					anonymousSortingList.add(comment);
				}
			}
			anonymousSortingList.sort(dateComparator);
			for(Comment comment : anonymousSortingList) {
				byte[] writer = comment.getUser();
				anonymousMap.forEach((k, v) -> {
					if(CryptoHelper.evaluateSHA512(k, writer)) {
						comment.setWriterInfo(v);
						return;
					}
				});
				if(comment.getWriterInfo() == null) {
					SimpleUserInfo info = SimpleUserInfo.anonymous(++anonymousCount);
					comment.setWriterInfo(info);
					anonymousMap.put(writer, info);
				}
				comment.setUser(null);// user uuid는 넘겨주면 안 되니까 삭제
			}
			
			return list;
		});
	}
	
	private static final Comparator<Comment> dateComparator = new Comparator<Comment>() {
		@Override
		public int compare(Comment lhs, Comment rhs) {
			return lhs.getGeneratedAt().compareTo(rhs.getGeneratedAt());
		}
	};
}
