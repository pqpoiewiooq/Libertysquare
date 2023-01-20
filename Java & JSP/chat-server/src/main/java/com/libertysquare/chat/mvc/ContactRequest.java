package com.libertysquare.chat.mvc;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class ContactRequest {
	public enum Type {
		COMMENT, POST
	}
	
	private Type type;
	private long id;
}
