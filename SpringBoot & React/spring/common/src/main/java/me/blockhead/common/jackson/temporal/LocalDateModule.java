package me.blockhead.common.jackson.temporal;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

public class LocalDateModule {
	private final DateTimeFormatter formatter;

	public final TemporalSerializer<LocalDate> serializer;
	public final Deserializer deserializer;
	
	public LocalDateModule(String pattern) {
		this.formatter = DateTimeFormatter.ofPattern(pattern);

		serializer = new TemporalSerializer<>(formatter);
		deserializer = new Deserializer();
	}
	
	
	private class Deserializer extends JsonDeserializer<LocalDate> {
		@Override
		public LocalDate deserialize(JsonParser parser, DeserializationContext ctxt) throws IOException, JacksonException {
			return LocalDate.parse(parser.getValueAsString(), formatter);
		}
		
	}
}
