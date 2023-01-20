package me.blockhead.common.util;

import java.io.IOException;
import java.io.InputStream;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import me.blockhead.common.exception.JsonException;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class JsonUtils {
	private static final ObjectMapper objectMapper;
	
	static {
		objectMapper = new ObjectMapper();
		objectMapper.setSerializationInclusion(Include.NON_NULL);
		//objectMapper.registerModule(new JavaTimeModule());
	}
	
	public static String toJson(Object obj) {
		if(obj == null) return "";
		try {
			return objectMapper.writeValueAsString(obj);
		} catch (Exception e) {
			throw new JsonException("직렬화에 실패하였습니다 : " + e.getMessage());
		}
    }
    
    public static <T> T fromJson(String json, Class<T> clazz) {
    	try {
			return objectMapper.readValue(json, clazz);
		} catch (Exception e) {
			throw new JsonException("역직렬화에 실패하였습니다 : " + e.getMessage());
		}
    }
    
    public static JsonNode parseJsonObject(InputStream is) throws IOException {
		return objectMapper.readTree(is);
	}
}
