package com.libertysquare.common.config.jackson;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAccessor;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class TemporalSerializer<T extends TemporalAccessor> extends JsonSerializer<T> {
	private DateTimeFormatter formatter;
	
	public TemporalSerializer(DateTimeFormatter formatter) {
		this.formatter = formatter;
	}
	
	@Override
	public void serialize(T value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
		if(value == null) gen.writeNull();
		 else gen.writeString(formatter.format(value));
	}
}