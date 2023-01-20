package database.query;

import java.sql.SQLException;

import database.ResultSetSequence;
import exception.MyServletException;

@FunctionalInterface
public interface ExecuteConsumer {
	void accept(ResultSetSequence sequence) throws SQLException, MyServletException;
}