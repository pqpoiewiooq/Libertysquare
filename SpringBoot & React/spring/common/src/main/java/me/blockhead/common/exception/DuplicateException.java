package me.blockhead.common.exception;

public class DuplicateException extends OptimizedUncheckedException {
	private static final long serialVersionUID = -6235366264713493160L;
	
	public DuplicateException() {
		super("");
	}
	
	public DuplicateException(String msg) {
		super(msg);
	}
}
