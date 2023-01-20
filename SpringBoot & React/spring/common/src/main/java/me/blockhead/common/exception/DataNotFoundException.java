package me.blockhead.common.exception;

public class DataNotFoundException extends OptimizedUncheckedException {
	private static final long serialVersionUID = 4585709664885161662L;
	
	public DataNotFoundException() {
		super("");
	}
	
	public DataNotFoundException(String msg) {
		super(msg);
	}
}
