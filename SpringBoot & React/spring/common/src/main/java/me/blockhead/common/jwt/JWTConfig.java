package me.blockhead.common.jwt;

import java.util.Base64;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;
import org.springframework.validation.annotation.Validated;

import io.jsonwebtoken.SignatureAlgorithm;

@Validated
@ConstructorBinding
@ConfigurationProperties("spring.jwt")
public class JWTConfig {
	protected static final String AUTHORITIES_KEY = "auth";
	
	@NotNull
	final byte[] secret;
	@NotNull
	final SignatureAlgorithm algorithm;
	
	@NotNull
	@Positive
	public final Long accessTokenExpire;
	@NotNull
	@Positive
	public final Long refreshTokenExpire;
	
	public JWTConfig(String secret, SignatureAlgorithm algorithm, Long accessTokenExpire, Long refreshTokenExpire) {
		this.secret = secret == null ? null : Base64.getDecoder().decode(secret.getBytes());
		this.algorithm = algorithm;
		this.accessTokenExpire = accessTokenExpire;
		this.refreshTokenExpire = refreshTokenExpire;
	}
	
//	public JWTConfig(String secret, String algorithm, Long accessTokenExpire, Long refreshTokenExpire) {
//		this(secret, SignatureAlgorithm.forName(algorithm), accessTokenExpire, refreshTokenExpire);
//	}
}
