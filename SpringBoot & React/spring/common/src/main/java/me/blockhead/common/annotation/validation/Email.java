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
@Size(max = Email.MAX)
@Pattern(regexp = "^(([^<>()[\\]\\\\.,;:\\s@\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$")
public @interface Email {
	public static final int MAX = 320;
	
	String message() default "올바르지 않은 이메일 주소입니다.";
    Class<?>[] groups() default { };
    Class<? extends Payload>[] payload() default { };
}