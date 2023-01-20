package me.blockhead.web.event.domain;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class EventCategoryConverter implements AttributeConverter<Set<EventCategory>, String> {
	private static final String SPLIT_CHAR = ",";
	
	@Override
	public String convertToDatabaseColumn(Set<EventCategory> attribute) {
		return attribute.stream().map(EventCategory::name).collect(Collectors.joining(SPLIT_CHAR));
	}

	@Override
	public Set<EventCategory> convertToEntityAttribute(String dbData) {
		return Arrays.stream(dbData.split(SPLIT_CHAR))
		        .map(EventCategory::valueOf)
		        .collect(Collectors.toSet());
	}
	
}