package me.blockhead.firebase.fcm.config;

import java.nio.charset.Charset;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import me.blockhead.firebase.fcm.message.FCMJsonSerializer;

@Getter
@RequiredArgsConstructor
public class FCMConfig {
	private final String authorization;
	private final Charset enc;
	private final FCMJsonSerializer serializer;
}
