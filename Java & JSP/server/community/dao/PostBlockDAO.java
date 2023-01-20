package community.dao;

import database.Table;

public class PostBlockDAO extends DefaultToggleDAO {
	public PostBlockDAO() {
		super(Table.POST_BLOCK, Table.POST);
	}
}
