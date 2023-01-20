package com.libertysquare.common.config.websocket;

public interface Encoder<T, R> {
	public R encode(T value);
}
