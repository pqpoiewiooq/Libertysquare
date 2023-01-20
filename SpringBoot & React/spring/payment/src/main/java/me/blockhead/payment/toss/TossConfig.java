package me.blockhead.payment.toss;

import java.nio.charset.Charset;
import java.util.Base64;

import lombok.Getter;

@Getter
public class TossConfig {
	private final String key;
	private final Charset charset;

	public TossConfig(String key) {
		this.key = "Basic " + Base64.getEncoder().encodeToString((key + ":").getBytes());

		Charset charset = null;
		try {
			charset = Charset.forName("UTF-8");
		} catch (Exception e) {
			charset = Charset.defaultCharset();
		}
		this.charset = charset;
	}
}
