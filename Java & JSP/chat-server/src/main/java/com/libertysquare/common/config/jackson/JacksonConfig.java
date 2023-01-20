package com.libertysquare.common.config.jackson;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Configuration
public class JacksonConfig {
	@Bean
	public Module jsonMapperJava8DateTimeModule() {
		JavaTimeModule module = new JavaTimeModule();
		
		new TemporalSerializer<LocalDate>(null);
		
		LocalDateTimeModule localDatTimeModule = new LocalDateTimeModule("yyyy-MM-dd HH:mm");
		module.addSerializer(LocalDateTime.class, localDatTimeModule.serializer);
		module.addDeserializer(LocalDateTime.class, localDatTimeModule.deserializer);
		
		return module;
	}
}