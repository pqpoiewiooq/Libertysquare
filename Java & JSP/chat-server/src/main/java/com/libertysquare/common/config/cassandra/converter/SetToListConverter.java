package com.libertysquare.common.config.cassandra.converter;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.core.convert.converter.Converter;

public class SetToListConverter implements Converter<Set<?>, List<?>> {
	@Override
	public List<?> convert(Set<?> source) {
		return new ArrayList<>(source);
	}
}