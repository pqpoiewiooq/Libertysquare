package me.blockhead.common.exception;

public class ForbiddenException extends OptimizedUncheckedException {
	private static final long serialVersionUID = 1381249830735628240L;
	
	public ForbiddenException(String msg) {
		super(msg);
	}
	
	public ForbiddenException() {
		super("403 Forbidden");
	}
}
