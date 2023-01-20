package me.blockhead.common.util;

import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import me.blockhead.common.jwt.JWToken;

@Component
public class RedisUtil {
	private static final String PREFIX = "JWTRT:";
	private static final String BLACK_LIST_VALUE = "_b-l_a-c_k-l_i-s_t-";
	
	private StringRedisTemplate redisTemplate;
	private ValueOperations<String, String> valueOps;

	private RedisUtil(StringRedisTemplate redisTemplate) {
		this.redisTemplate = redisTemplate;
		valueOps = redisTemplate.opsForValue();
	}

	private String toRefreshTokenKey(Authentication authentication) {
		return PREFIX + authentication.getName();
	}

	public void setRefreshToken(Authentication authentication, JWToken token) {
		valueOps.set(toRefreshTokenKey(authentication), token.getRefreshToken(), token.getRefreshTokenExpirationTime(), TimeUnit.MILLISECONDS);
	}

	public String getRefreshToken(Authentication authentication) {
		return valueOps.get(toRefreshTokenKey(authentication));
	}

	public void deleteRefreshToken(Authentication authentication) {
		String key = toRefreshTokenKey(authentication);
		if (exists(key)) redisTemplate.delete(key);
	}
	
	public void setBlackList(String accessToken, long expiration) {
		valueOps.set(accessToken, BLACK_LIST_VALUE, expiration, TimeUnit.MILLISECONDS);
	}
	
	public boolean exists(String key) {
		if(key == null) return false;
		return valueOps.get(key) != null;
	}
}
