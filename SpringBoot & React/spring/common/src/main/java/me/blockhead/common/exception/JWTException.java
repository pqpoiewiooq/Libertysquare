package me.blockhead.common.exception;

public class JWTException extends IllegalAccessError {
	private static final long serialVersionUID = 2609791020654742514L;
	
	public JWTException(String msg) {
		super(msg);
	}
}
