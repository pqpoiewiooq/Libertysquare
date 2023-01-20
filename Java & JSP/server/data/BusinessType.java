package data;

public enum BusinessType {
	INDIVIDUAL("개인"),
	PROPRIETOR("사업자"),
	NPO_TFE("비영리 · 면세사업자");// Non-Profit Organization & Tax-Free Exempt(businessman exempt from taxation)
	
	private String str;
	
	BusinessType(String str) {
		this.str = str;
	}
	
	@Override
	public String toString() {
		return str;
	}
}