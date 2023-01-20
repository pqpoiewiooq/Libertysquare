package me.blockhead.common.session;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;

import lombok.RequiredArgsConstructor;

@ConstructorBinding
@ConfigurationProperties("spring.redis")
@RequiredArgsConstructor
public final class RedisConfig {
	public final String host;
	public final int port;
	
	@Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory(host, port);
    }
}
