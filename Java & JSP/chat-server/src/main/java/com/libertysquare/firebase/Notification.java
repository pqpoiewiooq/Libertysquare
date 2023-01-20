package com.libertysquare.firebase;

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
