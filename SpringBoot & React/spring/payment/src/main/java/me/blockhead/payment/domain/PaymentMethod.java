package me.blockhead.payment.domain;

/**
 * 결제 수단
 */
public enum PaymentMethod {
	SYSTEM,
	
	CASH,
	CREDIT,
	WIRE_TRANFER,// ACCOUNT_TRANSFER or BANK_TRANSFER ...
	TOSS,
}
