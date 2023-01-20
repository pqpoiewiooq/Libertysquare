package database.query;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

import util.JsonUtil;

public class UpdateQuery extends ConditionQuery<UpdateQuery> {
	private Map<String, Object> valueMap = new LinkedHashMap<>();

	@Override
	protected UpdateQuery self() {
		return this;
	}
	
	public UpdateQuery set(String field, Object value) {
		if(value != null) valueMap.put(field, value);
		return this;
	}
	
	public UpdateQuery setToJson(String field, Object value) {
		if(value != null) set(field, JsonUtil.toJson(value));
		return this;
	}
	
	
	@Override
	public String toQuery() {
		StringBuilder builder = new StringBuilder();
		builder.append("UPDATE ").append(getTable()).append(" SET ");
		
		Iterator<String> valueKeys = valueMap.keySet().iterator();
		while(valueKeys.hasNext()) {
			builder.append(valueKeys.next()).append("=?");
			if(valueKeys.hasNext()) builder.append(", ");
		}
		
		builder.append(" WHERE ").append(toCondition());
		
		
		return builder.toString();
	}
	
	@Override
	public PreparedStatement createQueryStatement(Connection conn) throws SQLException {
		PreparedStatement pstmt = conn.prepareStatement(toQuery());
		
		int column = setTable(pstmt, 1);
		for(Object value : valueMap.values()) {
			if(setObject(pstmt, column, value)) column++;
		}
		setCondition(pstmt, column);
		
		return pstmt;
	}
}
