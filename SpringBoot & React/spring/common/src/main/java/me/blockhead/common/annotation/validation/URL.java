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

@Target(FIELD)
@Retention(RUNTIME)
@Constraint(validatedBy = { })
@Documented
@Size(max = URL.MAX)
@Pattern(regexp = "^((http|https):\\/\\/)?(www.)?([a-zA-Z0-9]+)\\.[a-z]+([a-zA-Z0-9.?#]+)?")
public @interface URL {
	public static final int MAX = 512;
	
	String message() default "올바르지 않은 URL입니다.";
    Class<?>[] groups() default { };
    Class<? extends Payload>[] payload() default { };
}