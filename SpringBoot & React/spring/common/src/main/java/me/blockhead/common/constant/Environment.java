package me.blockhead.common.constant;

import java.nio.charset.Charset;
import java.util.TimeZone;

import javax.annotation.PostConstruct;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;

import lombok.Getter;

@Getter
@ConstructorBinding
@ConfigurationProperties("spring.env")
public final class Environment {
	private final TimeZone timeZone;
	private final Charset enc;
	
	public Environment(String timeZone, String enc) {
		this.timeZone = timeZone == null ? TimeZone.getDefault() : TimeZone.getTimeZone(timeZone);
		this.enc = enc == null ? Charset.defaultCharset() : Charset.forName(enc);
	}
	
	@PostConstruct
	public void init() {
		TimeZone.setDefault(timeZone);
	}
}
