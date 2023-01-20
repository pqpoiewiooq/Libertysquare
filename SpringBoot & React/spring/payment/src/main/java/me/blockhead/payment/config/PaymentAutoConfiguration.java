package me.blockhead.payment.config;

import java.lang.reflect.Field;
import java.util.Properties;

import org.springframework.beans.factory.config.YamlPropertiesFactoryBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.InputStreamResource;

import me.blockhead.payment.net.TossPayment;
import me.blockhead.payment.toss.TossConfig;
import me.blockhead.payment.toss.TossProperties;

@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties({ PaymentProperties.class, TossProperties.class })
public class PaymentAutoConfiguration {
	@Bean
	@ConditionalOnMissingBean
	public PaymentConfig paymentConfig(PaymentProperties paymentProperties) throws IllegalArgumentException, IllegalAccessException, NoSuchFieldException, SecurityException {
		Integer timeout = paymentProperties.getTimeout();

		if (timeout == null) {
			Properties defaultProperties = loadDefaultProperties();

			timeout = Integer.parseInt(defaultProperties.getProperty("spring.payment.timeout"));
			forceChangeField(paymentProperties, "timeout", timeout);
		}

		return new PaymentConfig(timeout);
	}

	@Bean
	@ConditionalOnMissingBean
	public TossConfig tossConfig(TossProperties tossProperties) throws IllegalArgumentException, IllegalAccessException, NoSuchFieldException, SecurityException {
		String key = tossProperties.getKey();

		if (key == null) {
			Properties defaultProperties = loadDefaultProperties();

			key = defaultProperties.getProperty("spring.payment.toss.key");
			forceChangeField(tossProperties, "key", key);
		}

		return new TossConfig(key);
	}

	@Bean
	@ConditionalOnMissingBean
	public TossPayment tossPayment(TossConfig config) {
		return new TossPayment(config);
	}

	private Properties loadDefaultProperties() {
		YamlPropertiesFactoryBean factory = new YamlPropertiesFactoryBean();
		InputStreamResource resource = new InputStreamResource(getClass().getResourceAsStream("/payment.yml"));
		factory.setResources(resource);
		factory.afterPropertiesSet();

		return factory.getObject();
	}

	private void forceChangeField(Object obj, String fieldName, Object value) throws IllegalArgumentException, IllegalAccessException, NoSuchFieldException, SecurityException {
		Field field = obj.getClass().getDeclaredField(fieldName);
		field.setAccessible(true);
		field.set(obj, value);
		field.setAccessible(false);
	}
}