package me.blockhead.common.jackson;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import me.blockhead.common.constant.TemporalConfig;
import me.blockhead.common.jackson.temporal.LocalDateModule;
import me.blockhead.common.jackson.temporal.LocalDateTimeModule;
import me.blockhead.common.jackson.temporal.TemporalSerializer;

@Configuration
public class JacksonConfig {
	@Bean
	public Module jsonMapperJava8DateTimeModule() {
		JavaTimeModule module = new JavaTimeModule();
		
		new TemporalSerializer<LocalDate>(null);
		
		LocalDateModule localDateModule = new LocalDateModule(TemporalConfig.DATE_FORMAT);
		module.addSerializer(LocalDate.class, localDateModule.serializer);
		module.addDeserializer(LocalDate.class, localDateModule.deserializer);
		
//		LocalTimeModule localTimeModule = new LocalTimeModule("");
//		module.addSerializer(LocalTime.class, localTimeModule.serializer);
//		module.addDeserializer(LocalTime.class, localTimeModule.deserializer);
		
		LocalDateTimeModule localDatTimeModule = new LocalDateTimeModule(TemporalConfig.DATE_TIME_FORMAT);
		module.addSerializer(LocalDateTime.class, localDatTimeModule.serializer);
		module.addDeserializer(LocalDateTime.class, localDatTimeModule.deserializer);
		
		return module;
	}
}