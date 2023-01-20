package me.blockhead.payment.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@ConstructorBinding
@ConfigurationProperties("spring.payment")
@RequiredArgsConstructor
public final class PaymentProperties {
	private final Integer timeout;
}
