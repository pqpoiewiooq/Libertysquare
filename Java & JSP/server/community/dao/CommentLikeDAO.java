package community.dao;

import database.Table;

public class CommentLikeDAO extends DefaultToggleDAO {
	public CommentLikeDAO() {
		super(Table.COMMENT_LIKE, Table.COMMENT);
	}
}
