package com.libertysquare.common.util;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;
import java.util.UUID;

import javax.crypto.Cipher;

public class CryptoUtils {
	public final static String PRIVATE_KEY = "privateKey";
	public final static String PUBLIC_KEY_MODULUS = "publicKeyModulus";
	public final static String PUBLIC_KEY_EXPONENT = "publicKeyExponent";

	public static String randomUUID() {
		return UUID.randomUUID().toString().replaceAll("-", "");
	}

	public static String createSalt() {
		String salt = null;
		try {
			SecureRandom random = SecureRandom.getInstance("SHA1PRNG");
			byte[] bytes = new byte[16];
			random.nextBytes(bytes);
			salt = new String(Base64.getEncoder().encode(bytes));
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		return salt;
	}

	public static byte[] hexStringToByteArray(String s) {
		int len = s.length();
		byte[] data = new byte[len / 2];
		for (int i = 0; i < len; i += 2) {
			data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4) + Character.digit(s.charAt(i + 1), 16));
		}
		return data;
	}

	public static String byteArrayToHexString(byte[] bytes) {
		StringBuilder sb = new StringBuilder();
		for (byte b : bytes) {
			sb.append(String.format("%02X", b & 0xff));
		}
		return sb.toString();
	}

	public static byte[] encryptSHA512(String password, String hash) {
		String salt = hash + password + hash;
		try {
			MessageDigest msg = MessageDigest.getInstance("SHA-512");
			msg.update(salt.getBytes());
			// String.format("%128x", new BigInteger(1, msg.digest()));
			return msg.digest();
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static boolean evaluateSHA512(byte[] lhs, byte[] rhs) {
		if(lhs == null || rhs == null) return false;
		return Arrays.equals(lhs, rhs);
	}

	public static KeyPair genRSAKeyPair() throws NoSuchAlgorithmException {
		SecureRandom secureRandom = new SecureRandom();
		KeyPairGenerator gen = KeyPairGenerator.getInstance("RSA");
		gen.initialize(2048, secureRandom);

		return gen.genKeyPair();
	}

	public static String decryptRSA(String encrypted, PrivateKey privateKey) {
		String decrypted = "";
		try {
			Cipher cipher = Cipher.getInstance("RSA");
			byte[] encryptedBytes = hexStringToByteArray(encrypted);
			cipher.init(Cipher.DECRYPT_MODE, privateKey);
			byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
			decrypted = new String(decryptedBytes, "utf-8");
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		return decrypted;
	}
}
