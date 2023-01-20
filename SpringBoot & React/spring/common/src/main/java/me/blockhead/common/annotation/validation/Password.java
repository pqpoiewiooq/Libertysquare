package me.blockhead.common.annotation.validation;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

/**
 * must be {@value #MIN}-{@value #MAX} characters.
 */
@Target(FIELD)
@Retention(RUNTIME)
@Constraint(validatedBy = { })
@Documented
@NotBlank
@Size(min = Password.MIN, max = Password.MAX)
@Pattern(regexp = "^.*(?=^.{4,16}$).*$")
public @interface Password {
	public static final int MIN = 4;
	public static final int MAX = 16;
	
	String message() default "올바르지 않은 비밀번호 형식입니다.";
    Class<?>[] groups() default { };
    Class<? extends Payload>[] payload() default { };
}