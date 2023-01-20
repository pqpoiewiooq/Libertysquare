package me.blockhead.common.annotation;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import me.blockhead.common.constant.Environment;
import me.blockhead.common.jwt.JWTConfig;
import me.blockhead.common.session.RedisConfig;

@Target(ElementType.TYPE)
@Retention(RUNTIME)
@Documented
@Inherited
@EnableConfigurationProperties({ Environment.class, RedisConfig.class, JWTConfig.class })
@SpringBootApplication
public @interface MySpringBootApplication {}
