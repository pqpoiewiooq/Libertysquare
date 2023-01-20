package me.blockhead.common.annotation.validation;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;
import javax.validation.constraints.Pattern;

/**
 * require '#'<br>
 * without alpha
 */
@Target(FIELD)
@Retention(RUNTIME)
@Constraint(validatedBy = { })
@Documented
@Pattern(regexp = "^#([0-9a-f]{3}){1,2}$", flags = Pattern.Flag.CASE_INSENSITIVE)
public @interface HexColor {
	public static final int MAX = 7;
	
	String message() default "올바르지 않은 색상 코드입니다.";
    Class<?>[] groups() default { };
    Class<? extends Payload>[] payload() default { };
}