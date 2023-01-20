package me.blockhead.common.annotation.user;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.LinkedHashSet;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.lang.Nullable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import lombok.RequiredArgsConstructor;
import me.blockhead.common.exception.UnauthorizedException;
import me.blockhead.common.jwt.JWTProvider;
import me.blockhead.common.jwt.JWToken;
import me.blockhead.common.user.presentation.SecurityUser;
import me.blockhead.common.user.presentation.UserDTO;
import me.blockhead.common.util.RedisUtil;

@Component
@Aspect
@RequiredArgsConstructor
public class UserAdvisor {
	private final JWTProvider jwtProvider;
	private final RedisUtil redisUtil;

	private HttpServletRequest getRequest() {
		ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
		return requestAttributes.getRequest();
	}

	private String resolveAccessToken(HttpServletRequest request) {
		String accessToken = jwtProvider.resolveAccessToken(request);
		return redisUtil.exists(accessToken) ? null : accessToken;
	}

	private UserDTO getMember(Authentication authentication) {
		if (authentication == null) return null;

		Object principal = authentication.getPrincipal();
		if (principal == null) return null;

		SecurityUser member = null;
		if (principal instanceof SecurityUser) {
			member = (SecurityUser) principal;
		}

		return member == null ? null : member.getDto();
	}

	private UserDTO getMember() {
		String accessToken = resolveAccessToken(getRequest());
		Authentication authentication = jwtProvider.getAuthentication(accessToken);
		return getMember(authentication);
	}

	private void injection(Object[] modifiedArgs, Object... injectObjects) {
		Set<Object> objectSet = new LinkedHashSet<>(Set.of(injectObjects));
		if (modifiedArgs != null) {
			for (int i = 0; i < modifiedArgs.length; i++) {
				final int index = i;
				objectSet.removeIf(object -> {
					if (modifiedArgs[index].getClass().isInstance(object)) {
						modifiedArgs[index] = object;
						return true;
					}

					return false;
				});
			}
		}
	}

	private <A extends Annotation> A findAnnotation(ProceedingJoinPoint proceedingJoinPoint, @Nullable Class<A> annotationType) {
		MethodSignature signature = (MethodSignature) proceedingJoinPoint.getSignature();
		Method method = signature.getMethod();

		// method.getAnnotation(Login.class); �씠�슜�떆, aliasFor媛� �젙�긽 �옉�룞�븯吏� �븡�쓬.
		return AnnotationUtils.findAnnotation(method, annotationType);
	}

	@Around("@annotation(Login)")
	public Object processLoginCheck(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
		HttpServletRequest request = getRequest();
		String accessToken = resolveAccessToken(request);
		Authentication authentication = jwtProvider.getAuthentication(accessToken);
		UserDTO member = getMember(authentication);

		Login loginAnnotation = findAnnotation(proceedingJoinPoint, Login.class);
		boolean isLogin = loginAnnotation.login();

		Object[] modifiedArgs = proceedingJoinPoint.getArgs();
		if (isLogin) {
			if (member == null) throw new UnauthorizedException();

			for (int i = 0; i < modifiedArgs.length; i++) {
				if (modifiedArgs[i] instanceof UserDTO) {
					modifiedArgs[i] = member;
				} else if (modifiedArgs[i] instanceof JWToken) {
					String refreshToken = jwtProvider.resolveRefreshToken(request);
					JWToken token = JWToken.builder().accessToken(accessToken).refreshToken(refreshToken).build();
					modifiedArgs[i] = token;
				}
			}
		} else if (member != null) {
			throw new IllegalAccessException();
		}

		return proceedingJoinPoint.proceed(modifiedArgs);
	}

	@Around("@annotation(Member)")
	public Object processInjectionMember(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
		UserDTO member = getMember();

		Object[] modifiedArgs = proceedingJoinPoint.getArgs();
		injection(modifiedArgs, member);

		return proceedingJoinPoint.proceed(modifiedArgs);
	}

	@Around("@annotation(InjectToken)")
	public Object processInjectionToken(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
		InjectToken annotation = findAnnotation(proceedingJoinPoint, InjectToken.class);
		HttpServletRequest request = getRequest();

		JWToken.JWTokenBuilder builder = JWToken.builder();
		if (annotation.accessToken()) {
			builder.accessToken(resolveAccessToken(request));
		}
		if (annotation.refreshToken()) {
			builder.refreshToken(jwtProvider.resolveRefreshToken(request));
		}

		Object[] modifiedArgs = proceedingJoinPoint.getArgs();
		injection(modifiedArgs, builder.build());

		return proceedingJoinPoint.proceed(modifiedArgs);
	}
}
