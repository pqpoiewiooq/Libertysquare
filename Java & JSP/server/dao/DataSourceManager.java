package dao;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

public class DataSourceManager {
	private static DataSourceManager instance;
	
	private DataSource dataSource;
	
	private DataSourceManager() {}
	
	public static DataSourceManager getInstance() {
		if(instance == null) {
			try {
				instance = new DataSourceManager();
				Context context = new InitialContext();
				instance.dataSource = (DataSource) context.lookup("java:comp/env/jdbc/User");
			} catch(Exception e) {
				instance = null;
				return null;
			}
		}
		
		return instance;
	}
	
	public DataSource getDataSource() {
		return dataSource;
	}
}
