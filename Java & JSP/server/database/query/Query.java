package database.query;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import database.SubqueryTable;
import database.Table;

public abstract class Query<T extends Query<T>> {
	private List<CharSequence> tableList = new ArrayList<>();
	
	protected abstract T self();
	
	protected int setTable(PreparedStatement pstmt, int startColumn) throws SQLException {
		int column = startColumn;
		for(Object value : tableList) {
			if(value instanceof SubqueryTable) {
				Object data = ((SubqueryTable) value).getData();
				if(data == null) pstmt.setNull(column++, Types.BINARY);
				else if(setObject(pstmt, column, data)) column++;
			}
		}
		return column;
	}
	
	public T from(Table table) {
		return from(table.toString());
	}
	
	public T from(String table) {
		tableList.add(table);
		return self();
	}
	
	public T from(String tableQuery, Object data) {
		tableList.add(new SubqueryTable(tableQuery, data));
		return self();
	}
	
	public String getTable() {
		StringBuilder builder = new StringBuilder();

		Iterator<CharSequence> iterator = tableList.iterator();
		if(iterator.hasNext()) {
			Object table = iterator.next();
			builder.append(table);

			while(iterator.hasNext()) {
				table = iterator.next();
				
				builder
					.append((table instanceof SubqueryTable) ? " " : ", ")
					.append(table);
			}
		}
		return builder.toString();
	}
	
	
	public abstract String toQuery();
	
	public PreparedStatement createQueryStatement(Connection conn) throws SQLException {
		return createQueryStatement(conn, toQuery());
	}
	
	public PreparedStatement createQueryStatement(Connection conn, String query) throws SQLException {
		return conn.prepareStatement(query);
	}
	
	protected boolean setObject(PreparedStatement pstmt, int column, Object value) throws SQLException {
		if(value == null || value instanceof Command) {
			return false;
		} else if(value instanceof byte[]) {
			pstmt.setBytes(column, (byte[]) value);
		} else if (value instanceof Enum) {
			pstmt.setString(column, ((Enum<?>) value).name());
		} else if (value instanceof Like) {
			pstmt.setObject(column, ((Like) value).value);
		} else {
			pstmt.setObject(column, value);
		}
		return true;
	}
}
