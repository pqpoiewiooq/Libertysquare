package me.blockhead.common.jackson.temporal;

import java.io.IOException;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

public class LocalTimeModule {
	private final DateTimeFormatter formatter;

	public final TemporalSerializer<LocalTime> serializer;
	public final Deserializer deserializer;
	
	public LocalTimeModule(String pattern) {
		formatter = DateTimeFormatter.ofPattern(pattern);

		serializer = new TemporalSerializer<>(formatter);
		deserializer = new Deserializer();
	}
	
	private class Deserializer extends JsonDeserializer<LocalTime> {
		@Override
		public LocalTime deserialize(JsonParser parser, DeserializationContext ctxt) throws IOException, JacksonException {
			return LocalTime.parse(parser.getValueAsString(), formatter);
		}
		
	}
}
