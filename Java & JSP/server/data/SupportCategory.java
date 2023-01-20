package data;

public enum SupportCategory {
	POLITICS("정치"),
	EDUCATION("교육"),
	PRESS("언론"),
	CIVIC_MOVEMENT("시민운동"),
	ACADEMIC("학술"),
	ETC("기타");

	private String str;
	
	SupportCategory(String str) {
		this.str = str;
	}
	
	@Override
	public String toString() {
		return str;
	}
}