package database.query;

import java.sql.SQLException;

import exception.MyServletException;

@FunctionalInterface
public interface ExecuteFunction<T, R> {
	R apply(T t) throws SQLException, MyServletException;
}