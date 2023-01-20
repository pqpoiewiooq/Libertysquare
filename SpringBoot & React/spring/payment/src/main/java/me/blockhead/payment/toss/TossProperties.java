package me.blockhead.payment.toss;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@ConstructorBinding
@ConfigurationProperties("spring.payment.toss")
@RequiredArgsConstructor
public final class TossProperties {
	private final String key;
}
