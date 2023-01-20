package me.blockhead.common.annotation.validation;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

/**
 * 010-{4}-{4}
 */
@Target(FIELD)
@Retention(RUNTIME)
@Constraint(validatedBy = { })
@Documented
@Size(max = PhoneNumber.MAX)
@Pattern(regexp = "^010\\d{4}\\d{4}$")
public @interface PhoneNumber {
	public static final int MAX = 11;
	
	String message() default "올바르지 않은 핸드폰 번호입니다.";
    Class<?>[] groups() default { };
    Class<? extends Payload>[] payload() default { };
}