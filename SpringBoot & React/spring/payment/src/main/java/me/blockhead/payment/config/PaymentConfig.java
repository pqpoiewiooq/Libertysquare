package me.blockhead.payment.config;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class PaymentConfig {
	private final int timeout;
}
