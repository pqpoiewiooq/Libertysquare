package community.dao;

import database.Table;

public class PostScrapDAO extends DefaultToggleDAO {
	public PostScrapDAO() {
		super(Table.POST_SCRAP, Table.POST);
	}

}
