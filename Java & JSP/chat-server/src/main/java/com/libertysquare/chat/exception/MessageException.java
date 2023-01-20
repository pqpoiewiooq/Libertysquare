package com.libertysquare.chat.exception;

import com.libertysquare.common.exception.OptimizedUncheckedException;

public class MessageException extends OptimizedUncheckedException {
	private static final long serialVersionUID = 4440578631482952709L;

	public MessageException(String msg) {
		super(msg);
	}

}
