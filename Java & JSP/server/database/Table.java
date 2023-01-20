package database;

public enum Table {
	USER,
	EVENT,
	HOST,
	TICKET,
	PAYMENT,
	ATTENDANT,
	SUPPORT,
	SUBSCRIBE,
	
	BOARD,
	POST,
	POST_LIKE,
	POST_SCRAP,
	POST_BLOCK,
	
	COMMENT,
	COMMENT_LIKE,
	COMMENT_BLOCK;
	
	@Override
	public String toString() {
		return this.name().toLowerCase();
	}
}
