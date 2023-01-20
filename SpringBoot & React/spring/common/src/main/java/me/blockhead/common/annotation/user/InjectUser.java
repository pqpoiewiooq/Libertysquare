package me.blockhead.common.annotation.user;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import me.blockhead.common.user.presentation.UserDTO;

/**
 * 로그인 여부 상관없이 {@link UserDTO} 주입.
 * 비로그인시 NULL 주입
 * 
 * @see UserAdvisor#processInjection(org.aspectj.lang.ProceedingJoinPoint)
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Documented
public @interface InjectUser {
}
