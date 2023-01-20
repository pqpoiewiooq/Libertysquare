package me.blockhead.firebase.fcm.message;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class Notification {
	private String title;
	private String body;
	private String image;
	private String click_action;
}
