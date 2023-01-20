package com.libertysquare.common.config.websocket;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import account.User;

public class HttpHandshakeInterceptor implements HandshakeInterceptor {
	
	@Override
	public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
		if(request instanceof ServletServerHttpRequest) {
			ServletServerHttpRequest servletServerRequest = (ServletServerHttpRequest) request;
			HttpServletRequest servletRequest = servletServerRequest.getServletRequest();
			
			String param = servletRequest.getParameter(WebSocketConfig.LATEST_RECEIVING_AT);
			long latestReceivingAt = -1;
			try {
				latestReceivingAt = Long.parseLong(param);
			} catch(NumberFormatException e) {
				response.setStatusCode(HttpStatus.BAD_REQUEST);
				return false;
			}

			HttpSession session = servletRequest.getSession(false);
			if(session != null) {
				Object attr = session.getAttribute(WebSocketConfig.ATTR_USER);
				if(attr != null && attr instanceof User) {
					User user = (User) attr;
					
					attributes.put(WebSocketConfig.ATTR_USER, user);
					attributes.put(WebSocketConfig.LATEST_RECEIVING_AT, latestReceivingAt);
					return true;
				}
			}
		}
		
		response.setStatusCode(HttpStatus.UNAUTHORIZED);
		return false;
	}

	@Override
	public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
		
	}
}
