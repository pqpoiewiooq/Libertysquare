package me.blockhead.firebase.fcm.message;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(staticName = "of")
public class URLData implements FCMData {
	private String url;
}
