package me.blockhead.common.annotation.user;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.springframework.core.annotation.AliasFor;

import me.blockhead.common.exception.UnauthorizedException;

/**
 * [true] - 로그인하지 않은 경우 {@link UnauthorizedException} 발생<br>
 * [false] - 로그인한 경우 {@link IllegalAccessException} 발생<br>
 * 
 * @see UserAdvisor#processLoginCheck(org.aspectj.lang.ProceedingJoinPoint)
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Documented
public @interface Login {
	@AliasFor("login")
	boolean value() default true;
	
	@AliasFor("value")
	boolean login() default true;
}
