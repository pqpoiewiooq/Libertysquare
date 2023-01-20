package me.blockhead.web.event.domain;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum EventGenre {
	CLASS("클래스"),
	CONFERENCE_SEMINAR("컨퍼런스 · 세미나"),
	LIFESTYLE("라이프스타일");

	private String str;

	EventGenre(String str) {
		this.str = str;
	}

	@Override
	public String toString() {
		return str;
	}

	@JsonCreator
	public static EventGenre from(String s) {
		return valueOf(s.toUpperCase());
	}
}
