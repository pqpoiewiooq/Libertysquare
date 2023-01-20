package me.blockhead.firebase.fcm.message;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Message {
	private String to;
	private Iterable<String> registration_ids;
	
	private Notification notification;
	private FCMData data;
}
