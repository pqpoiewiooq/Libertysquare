package com.libertysquare.chat.room;

import java.security.SecureRandom;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import lombok.NoArgsConstructor;

/**
 * 8자리의 랜덤 문자열 생성(숫자, 영어 대/소문자)
 */
@NoArgsConstructor
public class ParticipantIdGenerator {
	private final static int leftLimit = 48;
	private final static int rightLimit = 122;
	private final static int targetStringLength = 8;

	private Set<String> generatedIds = new HashSet<>();
	private SecureRandom random = new SecureRandom();
	
	public ParticipantIdGenerator(Collection<String> base) {
		generatedIds.addAll(generatedIds);
	}
	
	// 재귀 함수로 처리하려고 했는데, 혹시 모를 상황 대비해서 do-while문으로 처리
	public synchronized String generate() {
	    String generatedString = null;
	    do {
	    	generatedString = gen();
	    } while(generatedIds.contains(generatedString));
	    
	    return generatedString;
	}
	
	private String gen() {
		return random.ints(leftLimit, rightLimit + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                .limit(targetStringLength)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
	}
}
