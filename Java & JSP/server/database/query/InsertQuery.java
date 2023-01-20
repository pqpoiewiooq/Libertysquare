package database.query;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import util.CryptoHelper;
import util.JsonUtil;

public class InsertQuery extends Query<InsertQuery> {
	private List<Object> valueList = new ArrayList<>();
	private boolean ignore = false;
	
	@Override
	protected InsertQuery self() {
		return this;
	}
	
	public InsertQuery add(Object value) {
		valueList.add(value);
		return this;
	}
	
	public InsertQuery add(Object[] arrayValue) {
		return addToJson(arrayValue);
	}
	
	public InsertQuery ignore(boolean ignore) {
		this.ignore = ignore;
		return this;
	}
	
//	public <E extends Enum<E>> InsertQuery add(E enumValue) {
//		return add(enumValue.name());
//	}
	
	public InsertQuery addAll(Object... values) {
		for(Object value : values) {
			if(value.getClass().isArray()) addToJson(value);
			else add(value);
		}
		
		return this;
	}
	
	public InsertQuery addCommand(String command) {
		valueList.add(new Command(command));
		return this;
	}
	
	public InsertQuery addToJson(Object object) {
		valueList.add(object == null ? null : JsonUtil.toJson(object));
		return this;
	}
	
	public InsertQuery addToBytes(String str) {
		return add(CryptoHelper.hexStringToByteArray(str));
	}
	
	private String get(int index) {
		Object value = valueList.get(index);
		return value == null ? "NULL" : value instanceof Command ? ((Command)value).command : "?";
	}
	
	@Override
	public String toQuery() {
		StringBuilder builder = new StringBuilder(ignore ? "INSERT IGNORE INTO " : "INSERT INTO ");
		builder.append(getTable()).append(" VALUES (");
		
		int i = 0;
		for(; i < valueList.size() - 1; i++) {
			builder.append(get(i)).append(',');
		}
		try {
			builder.append(get(i));
		} catch(Exception e) {}
		builder.append(')');
		
		return builder.toString();
	}

	@Override
	public PreparedStatement createQueryStatement(Connection conn) throws SQLException {
		PreparedStatement pstmt = conn.prepareStatement(toQuery());
		
		int column = setTable(pstmt, 1);
		for(Object value : valueList) {
			if(setObject(pstmt, column, value)) column++;
		}
		
		return pstmt;
	}
}
