package me.blockhead.payment.exception;

import me.blockhead.common.exception.OptimizedUncheckedException;

public class PaymentException extends OptimizedUncheckedException {
	private static final long serialVersionUID = 9147473568051146002L;
	
	public PaymentException(String msg) {
		super(msg);
	}
}
