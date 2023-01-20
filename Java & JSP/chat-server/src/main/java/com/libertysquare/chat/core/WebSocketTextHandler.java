package com.libertysquare.chat.core;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.libertysquare.chat.exception.MessageException;
import com.libertysquare.chat.message.Message;
import com.libertysquare.chat.message.MessageService;
import com.libertysquare.chat.room.Participant;
import com.libertysquare.chat.room.Room;
import com.libertysquare.chat.room.RoomType;
import com.libertysquare.common.config.websocket.WebSocketConfig;
import com.libertysquare.common.util.JsonUtils;
import com.libertysquare.firebase.FirebaseMessage;
import com.libertysquare.firebase.FirebaseSender;
import com.libertysquare.firebase.Notification;
import com.libertysquare.firebase.URLData;

import account.User;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class WebSocketTextHandler extends TextWebSocketHandler {
	@Autowired
	private ChatService chatService;
	@Autowired
	private MessageService messageService;
	@Autowired
	private FirebaseSender firebaseSender;
	
	@Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		String sender = chatService.findUserId(session);
		Message chatMessage = messageService.encode(message.getPayload());
		
		handleChatMessage(chatMessage, sender);
    }
	
	private void handleChatMessage(Message message, String sender) {
		Room room = chatService.findRoom(message.getRoomId());
		Map<String, Participant> participantMap = room.getParticipants();
		if(participantMap.size() <= 1) return;// 해당 방에 1명 이하로 남아있으면 아무런 작업도 못하게 막음.
		
		Participant participant = room.getParticipants().get(sender);
		if(participant == null) return; // 해당 방에 본인이 참가한 것이 아니면 무시
		message.setWriter(participant.getId());
		
		boolean notify = false;
		switch(message.getType()) {
			case TEXT:
			case IMAGE:// 미개발
			case NOTICE:// 관리자용
				if(room.getType() == RoomType.NOTIFICATION) return;// 알림 전용 방은 송신 불가.
				if(message.getContent() == null) throw new MessageException("message content is null");
				if(message.getContent().length() > 1000) throw new MessageException("message content too long. limit 1000");
				
				participant.setLastViewTime(message.getTime());// 메세지를 보냈다는건, 이미 온 내용들도 읽었다는 말이니 읽은것으로 처리
				messageService.save(message);
				notify = true;
				break;
			case READ:
				participant.setLastViewTime(message.getTime());
				break;
			case ALARM:
				participant.toggleAlarm();
				return;// 상태만 변경하는것이므로 그냥 return
			case LEAVE:
				room.getParticipants().remove(sender);
				messageService.save(message);
				break;// 방 나갔음을 알려야하므로 break로 빠져나감
			default:// 잘못된 요청
				return;
		}
		
		String json = JsonUtils.toJson(message);
		WebSocketMessage<?> webSocketMessage = new TextMessage(json);
		Set<String> noConnectedUserFcmTokenSet = chatService.broadcast(room, webSocketMessage);
		if(notify) {
			notifyAll(noConnectedUserFcmTokenSet, room.getId(), participant.getNickname());
		}
	}
	
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
    	Map<String, Object> attributes = session.getAttributes();

    	User user = (User) attributes.get(WebSocketConfig.ATTR_USER);
    	long latestReceivingAt = (long) attributes.get(WebSocketConfig.LATEST_RECEIVING_AT);
		
		chatService.join(session, user, latestReceivingAt);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
    	chatService.leave(session);
    }
    
    @Override
    public void handleTransportError(WebSocketSession session, Throwable throwable) throws Exception {
    	session.close(CloseStatus.SERVER_ERROR.withReason(throwable.getMessage()));
		log.error(session.getId(), throwable);
    }
	
	
	@MessageExceptionHandler(MessageException.class)
	public void handleMessageException(MessageException exception) {
		log.error("An message error occured : {}", exception.getMessage());
	}
	
	private void notifyAll(Set<String> registration_ids, UUID roomId, String nickname) {
		Notification notification = Notification.builder()
				.title(nickname)
				.body(nickname + "에게 채팅이 왔습니다")
				.click_action(".SplashActivity")
				.build();

		URLData data = URLData.of("https://chat.libertysquare.co.kr?room=" + roomId);
		
		FirebaseMessage message = FirebaseMessage.builder()
				.registration_ids(registration_ids)
				.notification(notification)
				.data(data)
				.build();
		
		firebaseSender.execute(() -> {
			firebaseSender.send(message);
		});
	}
}
