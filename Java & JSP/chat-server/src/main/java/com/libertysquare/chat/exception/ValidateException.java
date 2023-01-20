package com.libertysquare.chat.exception;

import com.libertysquare.common.exception.OptimizedUncheckedException;

import lombok.Getter;

@Getter
public class ValidateException extends OptimizedUncheckedException {
	private static final long serialVersionUID = 2853334383687274477L;
	
	private int status;

	public ValidateException(int status, String msg) {
		super(msg);
		this.status = status;
	}
}
