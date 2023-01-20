package me.blockhead.web.event.domain;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum EventCategory {
	ECONOMY("경제"),
	PHILOSOPHY("철학"),
	CERTIFICATE("자격증"),
	POLITICS("정치"),
	STUDY("공부"),
	HOBBY("취미"),
	FINANCE("금융"),
	PARTY("파티"),
	READING("독서"),
	SELF_IMPROVEMENT("자기계발"),
	BUSINESS("비즈니스"),
	TRAVEL("여행"),
	HOME_AND_LIFESTYLE("홈&라이프스타일"),
	DISCUSSION("토론"),
	BOOK_CONCERT("북콘서트");

	private String str;
	
	EventCategory(String str) {
		this.str = str;
	}
	
	@Override
	public String toString() {
		return str;
	}
	
//	@JsonCreator(mode = JsonCreator.Mode.DELEGATING)
//    public static EventCategory find(String code) {
//        return Stream.of(EventCategory.values())
//            .filter(c -> c.str.equals(code))
//            .findFirst()
//            .orElse(null);
//    }
	
	@JsonCreator
	public static EventCategory from(String s) {
		return valueOf(s.toUpperCase());
	}
}
