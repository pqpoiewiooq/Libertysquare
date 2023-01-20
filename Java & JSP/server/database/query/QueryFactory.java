package database.query;

import database.Table;

public class QueryFactory {
	private QueryFactory() {}
	
	public static InsertQuery insert(String table) {
		return new InsertQuery().from(table);
	}
	
	public static InsertQuery insert(Table table) {
		return insert(table.toString());
	}
	
	public static UpdateQuery update(String table) {
		return new UpdateQuery().from(table);
	}
	
	public static UpdateQuery update(Table table) {
		return update(table.toString());
	}
	
	public static SelectQuery select(String table) {
		return new SelectQuery().from(table);
	}
	
	public static SelectQuery select(Table table) {
		return select(table.toString());
	}
	
	public static SelectQuery select(Table... tables) {
		StringBuilder builder = new StringBuilder();
		int i = 0;
		for(; i < tables.length - 1; i++) {
			builder.append(tables[i].toString()).append(", ");
		}
		builder.append(tables[i]);
		return select(builder.toString());
	}
	
	public static SelectQuery select(String... tables) {
		StringBuilder builder = new StringBuilder();
		int i = 0;
		for(; i < tables.length - 1; i++) {
			builder.append(tables[i]).append(", ");
		}
		builder.append(tables[i]);
		return select(builder.toString());
	}
	
	public static DeleteQuery delete(String table) {
		return new DeleteQuery().from(table);
	}
	
	public static DeleteQuery delete(Table table) {
		return delete(table.toString());
	}
}
