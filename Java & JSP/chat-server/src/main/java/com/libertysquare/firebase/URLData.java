package com.libertysquare.firebase;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(staticName = "of")
public class URLData implements FirebaseData {
	private String url;
}
