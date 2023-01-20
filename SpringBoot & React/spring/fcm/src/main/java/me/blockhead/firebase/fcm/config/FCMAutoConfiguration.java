package me.blockhead.firebase.fcm.config;

import java.lang.reflect.Field;
import java.nio.charset.Charset;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.YamlPropertiesFactoryBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.InputStreamResource;

import me.blockhead.firebase.fcm.FCMSender;
import me.blockhead.firebase.fcm.message.DefaultFCMJsonSerializer;
import me.blockhead.firebase.fcm.message.FCMJsonSerializer;

@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(FCMProperties.class)
public class FCMAutoConfiguration {
    @Autowired
    private FCMProperties properties;
    
    @Bean
    @ConditionalOnMissingBean
    public FCMJsonSerializer serializer() {
        return new DefaultFCMJsonSerializer();
    }
    
    @Bean
    @ConditionalOnMissingBean
    public FCMConfig config(FCMJsonSerializer serializer) throws IllegalArgumentException, IllegalAccessException, NoSuchFieldException, SecurityException {
    	String authorization = properties.getAuthorization();
    	Charset charset = properties.getCharset();
    	
    	if(authorization == null && charset == null) {
	    	loadDefaultProperties();
    	}
    	
        return new FCMConfig(authorization, charset, serializer);
    }
    
    @Bean
    @ConditionalOnMissingBean
    public FCMSender sender(FCMConfig fcmConfig) {
        return new FCMSender(fcmConfig);
    }
    
    
    private void loadDefaultProperties() throws IllegalArgumentException, IllegalAccessException, NoSuchFieldException, SecurityException {
    	YamlPropertiesFactoryBean factory = new YamlPropertiesFactoryBean();
    	InputStreamResource resource = new InputStreamResource(getClass().getResourceAsStream("/fcm.yml"));
    	factory.setResources(resource);
    	factory.afterPropertiesSet();
    	
    	Properties properties = factory.getObject();
    	String authorization = properties.getProperty("spring.firebase.fcm.authorization");
    	forceChangeField(this.properties, "authorization", authorization);
    	String charset = properties.getProperty("spring.firebase.fcm.charset");
    	forceChangeField(this.properties, "charset", Charset.forName(charset));
	}
	
	private void forceChangeField(Object obj, String fieldName, Object value) throws IllegalArgumentException, IllegalAccessException, NoSuchFieldException, SecurityException {
        Field field = obj.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(obj, value);
        field.setAccessible(false);
	}
}