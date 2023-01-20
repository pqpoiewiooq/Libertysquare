package com.libertysquare.common.config.websocket;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.libertysquare.chat.core.WebSocketTextHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
	public static final String ATTR_USER = "user";
	public static final String END_POINT_URI = "/ws";
	public static final String LATEST_RECEIVING_AT = "dt";
	
	
	@Bean
	public WebSocketTextHandler webSocketTextHandler() {
		return new WebSocketTextHandler();
	}

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(webSocketTextHandler(), END_POINT_URI)
			.addInterceptors(new HttpHandshakeInterceptor())
			.setAllowedOriginPatterns("*");
	}
}
