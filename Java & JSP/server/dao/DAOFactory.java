package dao;

import exception.MyServletException;
import servlet.common.ServletStatus;

public class DAOFactory {

	public static <T extends DefaultDAO<?>> T create(Class<T> clazz) {
		T dao = null;
		try {
			dao = clazz.getDeclaredConstructor().newInstance();
			if(dao.open()) return dao;
		} catch (Exception e) {e.printStackTrace();}
		return null;
	}
	
	public static <T extends DefaultDAO<?>> T createThrow(Class<T> clazz) throws MyServletException {
		T dao = create(clazz);
		if(dao == null) throw new MyServletException(ServletStatus.DB_CONNECTION_FAILED);
		return dao;
	}
	
	public static <T extends DefaultDAO<?>> T convert(DefaultDAO<?> dao, Class<T> clazz) {
		T convert;
		try {
			convert = (T) clazz.getDeclaredConstructor().newInstance();
		} catch (Exception e) {
			return null;
		}
		
		convert.dataSource = dao.dataSource;
		convert.conn = dao.conn;
		return convert;
	}
/*
	public static <T extends DefaultDAO<?>> T convert(DefaultDAO<?> dao, Class<T> clazz) throws Exception {
		T convert = (T) clazz.getConstructor().newInstance();
		convert.dataSource = dao.dataSource;
		convert.conn = dao.conn;
		return convert;
	}
	*/
}
