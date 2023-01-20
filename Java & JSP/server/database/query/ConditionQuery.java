package database.query;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

abstract class ConditionQuery<T extends ConditionQuery<T>> extends Query<T> {
	private Map<String, Object> conditionMap = new LinkedHashMap<>();
	private int commandCount = 0;
	
	public T where(String query, Object value) {
		if(value != null) conditionMap.put(query, value);
		return self();
	}
	
	public T eq(String field, Object value) {
		return where(field + "=?", value);
	}
	
	public T not(String field, Object value) {
		return eq("NOT " + field, value);
	}
	
	public T like(String field, Object value) {
		if(value != null) conditionMap.put(field, new Like(value));
		return self();
	}
	
//	public <P extends Enum<P>> T where(String field, P enumValue) {
//		return where(field, enumValue.name());
//	}
	
	/**
	 * {@link #and()} + {@link #eq(String, Object)}
	 */
	public T and(String field, Object value) {
		if(value != null) {
			conditionMap.put(field + "=?", value);
			return and();
		}
		return self();
	}
	
	public T and() {
		return command("AND");
	}
	
	public T or() {
		return command("OR");
	}
	
	public T command(String command) {
		if(command != null) conditionMap.put("command" + (++commandCount), new Command(command));
		return self();
	}
	
	protected String toCondition() {
		StringBuilder builder = new StringBuilder();
		
		Iterator<String> keys = conditionMap.keySet().iterator();
		if(keys.hasNext()) {
			String key = keys.next();
			Object value = conditionMap.get(key);
			
			while(true) {
				if(value instanceof Command) {
					builder.append(((Command)value).command);
				} else if(value instanceof Like) {
					builder.append(key).append(" LIKE CONCAT('%', ?, '%')");
				} else {
					builder.append(key);
				}
				
				if(keys.hasNext()) {
					key = keys.next();
					value = conditionMap.get(key);
					builder.append(' ');
				} else break;
			}
		} else builder.append(1);
		
		return builder.toString();
	}
	
	@Override
	public PreparedStatement createQueryStatement(Connection conn) throws SQLException {
		PreparedStatement pstmt = conn.prepareStatement(toQuery());
		
		setCondition(pstmt, 1);
		
		return pstmt;
	}
	
	protected int setCondition(PreparedStatement pstmt, int startColumn) throws SQLException {
		int column = startColumn;
		for(Object value : conditionMap.values()) {
			if(setObject(pstmt, column, value)) column++;
		}
		return column;
	}
}
