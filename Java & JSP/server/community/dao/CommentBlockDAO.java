package community.dao;

import database.Table;

public class CommentBlockDAO extends DefaultToggleDAO {
	public CommentBlockDAO() {
		super(Table.COMMENT_BLOCK, Table.COMMENT);
	}
}
