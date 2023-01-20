package database;

public class SubqueryTable implements CharSequence {
	private String table;
	private Object obj;
	
	public SubqueryTable(String table, Object obj) {
		this.table = table;
		this.obj = obj;
	}
	
	public String getTable() {
		return this.table;
	}
	
	public Object getData() {
		return this.obj;
	}

	@Override
	public int length() {
		return table.length();
	}

	@Override
	public char charAt(int index) {
		return table.charAt(index);
	}

	@Override
	public CharSequence subSequence(int start, int end) {
		return table.subSequence(end, end);
	}
	
	@Override
	public String toString() {
		return this.table;
	}
}
