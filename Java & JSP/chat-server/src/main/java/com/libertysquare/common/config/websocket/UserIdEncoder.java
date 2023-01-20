package com.libertysquare.common.config.websocket;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;

import javax.crypto.Cipher;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Component;

@Component
public class UserIdEncoder implements Encoder<String, String> {
	private static final Charset CHARSET = StandardCharsets.UTF_8;

	private static final String PBKDF2_SHA512 = "PBKDF2WithHmacSHA1";
	private static final byte[] PBKDF2_SALT = "���[C���q^^��mI8��`�<��_k�.�".getBytes(CHARSET);

	private byte[] pbkdf2WithHmacSha512(String value) {
		try {
			PBEKeySpec spec = new PBEKeySpec(value.toCharArray(), PBKDF2_SALT, 10000, 256);
			SecretKeyFactory skf = SecretKeyFactory.getInstance(PBKDF2_SHA512);
			
			return skf.generateSecret(spec).getEncoded();
		} catch (GeneralSecurityException ex) {
			throw new IllegalStateException("Could not create hash", ex);
		}
	}
	
	
	private static final byte[] INIT_VECTOR = "���Q!l�".getBytes(CHARSET);
	private static final byte[] AES_KEY = "�d*��6�H".getBytes(CHARSET);
	public final Cipher aesCipher;
	
	private Cipher generateAesCipher() {
		try {
			IvParameterSpec iv = new IvParameterSpec(INIT_VECTOR);
			SecretKeySpec skeySpec = new SecretKeySpec(AES_KEY, "AES");
			
			Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
			cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);
			return cipher;
		} catch(Exception e) {
			throw new IllegalStateException("Could not create cipher", e);
		}
	}
	
	private byte[] aes(byte[] bytes) {
		try {
			return aesCipher.doFinal(bytes);
		} catch(Exception e) {
			throw new IllegalStateException("Could not create hash", e);
		}
	}
	
	private String encode(byte[] bytes) {
		StringBuffer sb = new StringBuffer(bytes.length);
		for (int i = 0; i < bytes.length; i++) {
			String hex = Integer.toHexString(0xff & bytes[i]);
			sb.append(hex.substring(hex.length() - 1));
		}
		return sb.toString();
	}

	public UserIdEncoder() {
		this.aesCipher = generateAesCipher();
	}

	@Override
	public String encode(String value) {
		byte[] pbkdf2 = pbkdf2WithHmacSha512(value);
		byte[] aes = aes(pbkdf2);
		return encode(aes);
	}

}
