package me.blockhead.common.annotation.user;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 값이 true인 것만 inject
 * 
 * @see UserAdvisor#processInjectionToken(org.aspectj.lang.ProceedingJoinPoint)
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Documented
public @interface InjectToken {
	boolean accessToken() default true;
	boolean refreshToken() default false;
}
