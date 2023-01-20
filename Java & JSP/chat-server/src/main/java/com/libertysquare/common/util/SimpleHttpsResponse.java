package com.libertysquare.common.util;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SimpleHttpsResponse {
	private int status;
	private String data;
}
