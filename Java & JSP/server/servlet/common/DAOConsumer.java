package servlet.common;

import java.io.IOException;
import java.sql.SQLException;

@FunctionalInterface
public interface DAOConsumer<T> {
	void accept(T t) throws SQLException, IOException;
}