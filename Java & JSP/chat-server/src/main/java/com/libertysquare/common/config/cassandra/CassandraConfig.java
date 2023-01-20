package com.libertysquare.common.config.cassandra;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.cassandra.core.convert.CassandraCustomConversions;

import com.libertysquare.common.config.cassandra.converter.ByteArrayToByteBufferConverter;
import com.libertysquare.common.config.cassandra.converter.ByteBufferToByteArrayConverter;
import com.libertysquare.common.config.cassandra.converter.ListToSetConverter;
import com.libertysquare.common.config.cassandra.converter.SetToListConverter;

@Configuration
public class CassandraConfig {

	@Bean
	public CassandraCustomConversions customConversions() {
		List<Converter<?, ?>> converters = new ArrayList<>();
		converters.add(new ByteArrayToByteBufferConverter());
		converters.add(new ByteBufferToByteArrayConverter());
		converters.add(new ListToSetConverter());
		converters.add(new SetToListConverter());

		return new CassandraCustomConversions(converters);
	}
}
