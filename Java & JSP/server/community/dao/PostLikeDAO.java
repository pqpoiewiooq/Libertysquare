package community.dao;

import java.sql.SQLException;

import community.entity.Toggle;
import database.Table;
import database.query.InsertQuery;
import database.query.QueryFactory;
import database.query.SelectQuery;
import exception.MyServletException;
import servlet.common.ServletStatus;

public class PostLikeDAO extends DefaultToggleDAO {
	public PostLikeDAO() {
		super(Table.POST_LIKE, Table.POST);
	}
	
	private synchronized void insertPostSet(String postSetTableName, long postId) throws MyServletException {
		InsertQuery insertBestQuery = QueryFactory.insert(postSetTableName)
				.ignore(true)
				.add(postId)
				.add(null);
		
		executeInsert(insertBestQuery);
	}
	
	@Override
	public synchronized void toggle(long postId, byte[] userId) throws MyServletException {
		SelectQuery select = QueryFactory.select(Table.POST_LIKE)
				.eq("post", postId)
				.and()
				.eq("user", userId);
		try {
			setAutoCommit(false);
			executeQuery(select, (sequence) -> {
				if(sequence.next()) {
					delete(sequence.nextLong());
				} else {
					Toggle postLike = new Toggle();
					postLike.setTargetId(postId);
					postLike.setUser(userId);
					if(insert(postLike) < 0) throw new MyServletException(ServletStatus.DB_ERROR, "like failed");
				}
				
				long count = count(postId);
				if(count >= 50) {// 베스트 게시글 - 좋아요 50개 이상
					insertPostSet("best_bost", postId);
				} else if (count >= 10) {// 핫 게시글 - 좋아요 10개 이상
					insertPostSet("hot_bost", postId);
				}
			});
		} catch(SQLException e) {
			throw MyServletException.DB_ERROR;
		} catch(MyServletException e) {
			throw e;
		} finally {
			try {
				commit();
				setAutoCommit(true);
			} catch (SQLException e) {
			}
		}
	}
}
