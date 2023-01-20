package com.libertysquare.chat.mvc;

import account.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ContactTarget {
	private User user;
	private long postId;
	private boolean isAnonymity;
}
