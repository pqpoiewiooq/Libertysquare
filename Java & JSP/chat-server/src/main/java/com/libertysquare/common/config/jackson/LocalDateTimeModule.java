package com.libertysquare.common.config.jackson;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

public class LocalDateTimeModule {
	private final DateTimeFormatter formatter;

	public final TemporalSerializer<LocalDateTime> serializer;
	public final Deserializer deserializer;
	
	public LocalDateTimeModule(String pattern) {
		formatter = DateTimeFormatter.ofPattern(pattern);

		serializer = new TemporalSerializer<>(formatter);
		deserializer = new Deserializer();
	}
	
	private class Deserializer extends JsonDeserializer<LocalDateTime> {
		@Override
		public LocalDateTime deserialize(JsonParser parser, DeserializationContext ctxt) throws IOException, JacksonException {
			return LocalDateTime.parse(parser.getValueAsString(), formatter);
		}
		
	}
}
