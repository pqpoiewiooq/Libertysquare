package database.query;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class DeleteQuery extends ConditionQuery<DeleteQuery> {
	@Override
	protected DeleteQuery self() {
		return this;
	}
	
	@Override
	public String toQuery() {
		StringBuilder builder = new StringBuilder();
		builder.append("DELETE FROM ").append(getTable()).append(" WHERE ").append(toCondition());
		return builder.toString();
	}
	
	@Override
	public PreparedStatement createQueryStatement(Connection conn) throws SQLException {
		PreparedStatement pstmt = conn.prepareStatement(toQuery());
		
		int column = setTable(pstmt, 1);
		setCondition(pstmt, column);
		
		return pstmt;
	}
}
