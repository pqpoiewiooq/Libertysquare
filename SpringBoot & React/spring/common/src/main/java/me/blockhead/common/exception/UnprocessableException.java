package me.blockhead.common.exception;

public class UnprocessableException extends OptimizedUncheckedException {
	private static final long serialVersionUID = -7920876234958112743L;

	public UnprocessableException(String msg) {
		super(msg);
	}
}
