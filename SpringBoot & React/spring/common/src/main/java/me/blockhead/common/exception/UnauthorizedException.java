package me.blockhead.common.exception;

public class UnauthorizedException extends OptimizedUncheckedException {
	private static final long serialVersionUID = 2512423202697932648L;

	public UnauthorizedException() {
		super("401 Unauthorized");
	}
}
