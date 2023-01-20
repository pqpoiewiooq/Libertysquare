package com.libertysquare.firebase;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class FirebaseMessage {
	private String to;
	private Iterable<String> registration_ids;
	
	private Notification notification;
	private FirebaseData data;
}
