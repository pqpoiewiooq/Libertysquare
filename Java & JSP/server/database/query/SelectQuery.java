package database.query;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class SelectQuery extends ConditionQuery<SelectQuery> {
	private String resultField = "*";
	private List<String> resultFieldList = new ArrayList<>();
	private String orderBy = null;
	private String groupBy = null;
	private String having = null;
	private String pagination = null;
	
	@Override
	protected SelectQuery self() {
		return this;
	}
	
	public SelectQuery pagination(int page, long limit) {
		if(page <= 1) limit(limit);
		else this.pagination = ((page - 1) * limit) + ", " + limit;
		return this;
	}
	
	public SelectQuery limit(long limit) {
		this.pagination = (limit < 1) ? null : limit + "";
		return this;
	}
	
	public SelectQuery orderBy(String orderBy) {
		this.orderBy = orderBy;
		return this;
	}
	
	/**
	 * 내림차순 - ex) 5, 4, 3, 2, 1
	 */
	public SelectQuery orderByDesc(String column) {
		orderBy = column + " DESC";
		return this;
	}
	
	/**
	 * 오름차순 - ex) 1, 2, 3, 4, 5
	 */
	public SelectQuery orderByAsc(String column) {
		orderBy = column + " ASC";
		return this;
	}
	
	public SelectQuery groupBy(String groupBy) {
		this.groupBy = groupBy;
		return this;
	}
	
	public SelectQuery having(String having) {
		this.having = having;
		return this;
	}
	
	
	public SelectQuery setResult(String fields) {
		if(fields != null) {
			this.resultField = fields;
			this.resultFieldList.clear();
		}
		return this;
	}
	
	public SelectQuery addResult(String field) {
		if(field != null) resultFieldList.add(field);
		return this;
	}
	
	public SelectQuery addResults(String... values) {
		for(String field : values) {
			addResult(field);
		}
		
		return this;
	}
	
	//"SELECT * FROM " + table + " WHERE tickets LIKE '%" + ticketID + "%'";
	@Override
	public String toQuery() {
		StringBuilder builder = new StringBuilder();
		builder.append("SELECT ");
		
		if(resultFieldList.size() > 0) {
			builder.append(resultFieldList.get(0));
			for(int i = 1; i < resultFieldList.size(); i++) {
				builder.append(", ").append(resultFieldList.get(i));
			}
		} else {
			builder.append(resultField);
		}
		
		builder.append(" FROM ").append(getTable());
		String condition = toCondition();
		if(!"1".equals(condition)) builder.append(" WHERE ").append(condition);
		if(groupBy != null) builder.append(" GROUP BY ").append(groupBy);
		if(having != null) builder.append(" HAVING ").append(having);
		if(orderBy != null) builder.append(" ORDER BY ").append(orderBy);
		if(pagination != null) builder.append(" LIMIT ").append(pagination);
		
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
