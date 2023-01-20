package me.blockhead.firebase.fcm.config;

import java.nio.charset.Charset;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@ConstructorBinding
@ConfigurationProperties("spring.firebase.fcm")
@RequiredArgsConstructor
public final class FCMProperties {
	private final String authorization;
	private final Charset charset;
}
