package com.libertysquare.common.config.cassandra.converter;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.core.convert.converter.Converter;

public class ListToSetConverter2 implements Converter<List<?>, Set<?>> {
	@Override
	public Set<?> convert(List<?> source) {
		return new LinkedHashSet<>(source);
	}
}