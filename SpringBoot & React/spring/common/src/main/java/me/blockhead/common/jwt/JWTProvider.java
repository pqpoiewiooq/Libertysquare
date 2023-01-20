package me.blockhead.common.jwt;

import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import me.blockhead.common.user.presentation.SecurityUser;
import me.blockhead.common.user.presentation.UserDTO;
import me.blockhead.common.util.JsonUtils;

@Component
public class JWTProvider {
	static final String BEARER_TYPE = "Bearer";
	static final String REFRESH_TOKEN_COOKIE_NAME = "token";
	static final String AUTHORIZATION_HEADER = "Authorization";
	
	private static final String AUTHORITIES_KEY = "auth";
	private static final String CLAIMS_INFO = "info";

	private final JWTConfig config;
	private final Key key;
	
	public JWTProvider(JWTConfig config) {
		this.config = config;
	    this.key = Keys.hmacShaKeyFor(config.secret);
	}
	
	// 유저 정보를 가지고 AccessToken, RefreshToken 을 생성하는 메서드
	/**
	 * Jwt Token을 생성하여 Authentication 내부의 DTO에 Set 해주고, 해당 DTO를 반환
	 */
	public JWToken generateToken(Authentication authentication) {
		SecurityUser securityMember = (SecurityUser) authentication.getPrincipal();
		UserDTO member = securityMember.getDto();
		
	    // 권한 가져오기
	    String authorities = authentication.getAuthorities().stream()
	            .map(GrantedAuthority::getAuthority)
	            .collect(Collectors.joining(","));
	
	    long now = (new Date()).getTime();
	    // Access Token 생성
	    String accessToken = generateToken(member, authorities, now + config.accessTokenExpire);
	
	    // Refresh Token 생성
	    String refreshToken = generateToken(member, authorities, now + config.refreshTokenExpire);
	
	    return JWToken.builder()
	            .grantType(BEARER_TYPE)
	            .accessToken(accessToken)
	            .refreshToken(refreshToken)
	            .refreshTokenExpirationTime(config.refreshTokenExpire)
	            .build();
	}
	
	private String generateToken(UserDTO member, String authorities, long expiration) {
		Date exp = new Date(expiration);
		
		return Jwts.builder()
	            .claim(AUTHORITIES_KEY, authorities)
	            .setSubject(member.getId().toString())
	            .claim(CLAIMS_INFO, JsonUtils.toJson(member))
	            .setExpiration(exp)
	            .signWith(key, config.algorithm)
	            .compact();
	}
	
	// JWT 토큰을 복호화하여 토큰에 들어있는 정보를 꺼내는 메서드
	public Authentication getAuthentication(String token) {
	    // 토큰 복호화
	    Claims claims = parseClaims(token);
	    Object authoritiesObject = claims.get(AUTHORITIES_KEY);
	    
	    if (authoritiesObject == null) {
	        throw new RuntimeException("권한 정보가 없는 토큰입니다.");
	    }
	
	    // 클레임에서 권한 정보 가져오기
	    Collection<? extends GrantedAuthority> authorities =
	            Arrays.stream(authoritiesObject.toString().split(","))
	            .map(SimpleGrantedAuthority::new)
	            .collect(Collectors.toList());
	
	    // UserDetails 객체를 만들어서 Authentication 리턴
	    UserDTO dto = JsonUtils.fromJson(claims.get(CLAIMS_INFO).toString(), UserDTO.class);
	    dto.setUuid(UUID.fromString(claims.getSubject()));
	    SecurityUser principal = new SecurityUser(dto.getId(), "", authorities);
	    principal.setDto(dto);
	    
	    return new UsernamePasswordAuthenticationToken(principal, "", authorities);
	}
	
	private JwtParser parserBuilder() {
		return Jwts.parserBuilder().setSigningKey(key).build();
	}
	
	// 토큰 정보를 검증하는 메서드
	public boolean validateToken(String token) {
		if(token == null) return false;
	    try {
	    	parserBuilder().parseClaimsJws(token);
	        return true;
	    } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
	        //log.info("Invalid JWT Token", e);
	    } catch (ExpiredJwtException e) {
	        //log.info("Expired JWT Token", e);
	    } catch (UnsupportedJwtException e) {
	        //log.info("Unsupported JWT Token", e);
	    } catch (IllegalArgumentException e) {
	        //log.info("JWT claims string is empty.", e);
	    }
	    return false;
	}
	
	private Claims parseClaims(String token) {
	    try {
	        return parserBuilder().parseClaimsJws(token).getBody();
	    } catch (ExpiredJwtException e) {
	        return e.getClaims();
	    }
	}
	
	/**
	 * 현재 시간으로부터, 해당 토큰의 만료 시간까지의 남은 시간을 구함
	 */
	public long getExpiration(String token) {
	    Date expiration = parseClaims(token).getExpiration();
	    long now = new Date().getTime();
	    return (expiration.getTime() - now);
	}
	
	public String resolveAccessToken(HttpServletRequest request) {
		String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_TYPE)) {
			String accessToken = bearerToken.substring(BEARER_TYPE.length() + 1);
			return validateToken(accessToken) ? accessToken : null;
		}
		
		return null;
	}
	
	public String resolveRefreshToken(HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		
		if(cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals(REFRESH_TOKEN_COOKIE_NAME)) {
					String refreshToken = cookie.getValue();
					return validateToken(refreshToken) ? refreshToken : null;
				}
			}
		}

		return null;
	}
}