package me.blockhead.common.annotation.validation;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;
import javax.validation.constraints.Digits;
import javax.validation.constraints.PositiveOrZero;

/**
 * 0 ~ 99,999,999
 */
@Target(FIELD)
@Retention(RUNTIME)
@Constraint(validatedBy = { })
@Documented
@PositiveOrZero
@Digits(integer = Price.MAX_DIGITS, fraction = 0)
public @interface Price {
	public static final int MAX_DIGITS = 8;
	
	String message() default "0 ~ 99,999,999 사이의 값이어야 합니다.";
    Class<?>[] groups() default { };
    Class<? extends Payload>[] payload() default { };
}