package database;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.function.Function;

import util.JsonUtil;

public class ResultSetSequence {
	private final ResultSet rs;
	private int column = 1;
	
	public ResultSetSequence(ResultSet rs) {
		this.rs = rs;
	}
	
	public ResultSet resultSet() {
		return rs;
	}
	
	public boolean next() throws SQLException {
		column = 1;
		return rs.next();
	}
	
	public String nextString() throws SQLException {
		return rs.getString(column++);
	}
	
	public byte[] nextBytes() throws SQLException {
		return rs.getBytes(column++);
	}
	
	public boolean nextBoolean() throws SQLException {
		return rs.getBoolean(column++);
	}
	
	public int nextInt() throws SQLException {
		return rs.getInt(column++);
	}
	
	public long nextLong() throws SQLException {
		return rs.getLong(column++);
	}
	
	public Long nextLongN() throws SQLException {
		long l = nextLong();
		return rs.wasNull() ? null : l;
	}
	
	public <T> T nextFromJson(Class<T> clazz) throws SQLException {
		return JsonUtil.fromJson(nextString(), clazz);
	}
	
	public <T> T nextFrom(Function<? super String, ? extends T> mapper) throws SQLException {
		return mapper.apply(nextString());
	}
	
	public LocalDateTime nextLocalDateTime() throws SQLException {
		return rs.getTimestamp(column++).toLocalDateTime();
	}
	
	public boolean nextIsNull() throws SQLException {
		rs.getObject(column + 1);
		return rs.wasNull();
	}
	
	public void deleteRow() throws SQLException {
		int rowNum = rs.getRow();
	    rs.deleteRow();
	    
	    if(rowNum == rs.getRow()) rs.previous();
	}
	
	public void jump(int columnCount) {
		column += columnCount;
	}
}
