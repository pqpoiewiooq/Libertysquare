package me.blockhead.common.jwt;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.PatternMatchUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.GenericFilterBean;

import lombok.RequiredArgsConstructor;
import me.blockhead.common.util.RedisUtil;

@RequiredArgsConstructor
public class JWTAuthenticationFilter extends GenericFilterBean {
	private static final String[] whitelist = {"/"};

	private final JWTProvider jwtTokenProvider;
	private final RedisUtil redisUtil;

	@Override
	public void doFilter(ServletRequest req, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) req;
		
		if(checkWhiteList(request.getRequestURI())) {
			String token = resolveToken(request);

			if (jwtTokenProvider.validateToken(token)) {
				if (!redisUtil.exists(token)) {
					Authentication authentication = jwtTokenProvider.getAuthentication(token);
					SecurityContextHolder.getContext().setAuthentication(authentication);
				}
			}
		}

		chain.doFilter(request, response);
	}
	
	private boolean checkWhiteList(String requestURI) {
        return !PatternMatchUtils.simpleMatch(whitelist, requestURI);
	}

	private String resolveToken(HttpServletRequest request) {
		String bearerToken = request.getHeader(JWTProvider.AUTHORIZATION_HEADER);
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(JWTProvider.BEARER_TYPE)) {
			return bearerToken.substring(7);
		}
		return null;
	}
}