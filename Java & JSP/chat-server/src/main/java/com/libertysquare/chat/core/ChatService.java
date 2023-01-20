package com.libertysquare.chat.core;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

import com.libertysquare.chat.exception.MessageException;
import com.libertysquare.chat.message.Message;
import com.libertysquare.chat.message.MessageService;
import com.libertysquare.chat.message.MessageType;
import com.libertysquare.chat.mvc.ContactService;
import com.libertysquare.chat.room.Room;
import com.libertysquare.chat.room.RoomDTO;
import com.libertysquare.chat.room.RoomService;
import com.libertysquare.chat.room.RoomType;
import com.libertysquare.chat.user.ChatUser;
import com.libertysquare.chat.user.UserService;
import com.libertysquare.common.util.JsonUtils;

import account.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService implements ApplicationListener<ContextClosedEvent> {
	
	/* ========== USER ========== */
	
	private final String ADMIN_ID = "cbfcabc6b0e59cacb2f2a68585811900ace07bab88e54343";
	private final UserService userService;
	
	/* ========== ROOM ========== */
	
	private final RoomService roomService;
	
	/**
	 * @throws MessageException 방을 찾지 못한 경우
	 */
	public Room findRoom(UUID roomId) {
		Room room = roomService.find(roomId);
		if(room == null) throw new MessageException("not found room : " + roomId);
		return room;
	}
	
	
	
	
	/* ========== SESSION ========== */
	
	private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
	private final MessageService messageService;
	
	public WebSocketSession findSession(String userId) {
		return sessions.get(userId);
	}
	
	private static final MessageException NOT_FOUND_USER_FROM_SESSION = new MessageException("not found user");
	/**
	 * @throws MessageException 유저를 찾지 못한 경우
	 */
	public String findUserId(WebSocketSession session) {
		for(Entry<String, WebSocketSession> entry : sessions.entrySet()) {
			if(session.getId().equals(entry.getValue().getId())) {
				return entry.getKey();
			}
		}
		throw NOT_FOUND_USER_FROM_SESSION;
	}
	
	/**
	 * session 목록에 넣고, 채팅 로그를 전송함.
	 * @throws IOException 
	 */
	public void join(WebSocketSession session, User user, long latestReceivingAt) throws IOException {
		ChatUser chatUser = userService.getOrSignup(user, this::welcome);
		
		sessions.put(chatUser.getId(), session);
		
		// 해당 유저에게 마지막 접속 시점으로부터의 메세지 전송.
		Collection<RoomDTO> messages = retrieveAfter(chatUser, latestReceivingAt);
		TextMessage initMessage = new TextMessage(JsonUtils.toJson(messages));
		session.sendMessage(initMessage);
	}

	/**
	 * {@link ContactService#getChatUserId(User)} 때문에 public으로 선언. 추후 변경 필
	 */
	public void welcome(ChatUser chatUser) {
		if(chatUser.getId().equals(ADMIN_ID)) return;// ADMIN 에겐 welcome message 생성하지 않음
		
		// 이미 연결된 방이 있으면(혹시 몰라서 한 번 더 확인) 생성하지 않음
		if(roomService.findContactRoomId(ADMIN_ID, chatUser.getId(), -1, RoomType.NOTIFICATION) != null) return;
		
		Room room = roomService.create(com.libertysquare.common.util.Set.of(ADMIN_ID, chatUser.getId()), -1, RoomType.NOTIFICATION);
		Message welcomeMessage = Message.builder()
				.writer(room.getParticipantId(ADMIN_ID))
				.roomId(room.getId())
				.type(MessageType.TEXT)
				.content(chatUser.getNickname() + "님, 반갑습니당!\r\n친구들에게 FLATTOP(플랫탑)을 홍보하면 더 즐겁게 사용하실 수 있습니다.")
				.time(System.currentTimeMillis())
				.build();
		messageService.save(welcomeMessage);
	}

	/**
	 * @return 해당 유저에게 마지막 접속 시점으로부터의 메세지 목록과, room 정보 가져오기
	 */
	private Collection<RoomDTO> retrieveAfter(ChatUser chatUser, long latestReceivingAt) {
		Set<Room> rooms = roomService.findAllByUserId(chatUser.getId());
		
		Map<UUID, RoomDTO> roomMap = new HashMap<>();
		List<UUID> roomIds = new ArrayList<>();
		for(Room room : rooms) {
			UUID roomId = room.getId();
			
			RoomDTO roomDto = new RoomDTO(room, chatUser.getId());
			
			roomIds.add(roomId);
			roomMap.put(roomId, roomDto);
		}
		
		List<Message> messageList = messageService.findAllByRoomIdsAndAfter(roomIds, latestReceivingAt);
		for(Message message : messageList) {
			RoomDTO dto = roomMap.get(message.getRoomId());
			message.clearRoomId();
			dto.getMessages().add(message);
		}
		
		return roomMap.values();
	}
	
	public void leave(WebSocketSession session) {
		sessions.values().removeIf(s -> s.getId().equals(session.getId()));
	}
	
	
	
	
	
	
	
	
	
	
	/* ========== BROADCAST ========== */
	
	/**
	 * @return 미접속 유저들의 Firebase Token 목록
	 */
	public Set<String> broadcast(Room room, WebSocketMessage<?> message) {
		Set<String> noConnectedUserFcmTokenSet = new HashSet<>();
		room.getParticipants().forEach((userId, participant) -> {
			WebSocketSession session = findSession(userId);
			if(session == null) {
				if(participant.isOnAlarm()) {
					String fcmToken = participant.getPrincipal().getFcmToken();
					if(fcmToken != null) noConnectedUserFcmTokenSet.add(fcmToken);
				}
			} else {
				try {
					session.sendMessage(message);
				} catch (IOException e) {
					log.error("Message Send Failure : {}\n{}", message.getPayload(), e);
				}
			}
		});
		return noConnectedUserFcmTokenSet;
	}

	
	@Override
	public void onApplicationEvent(ContextClosedEvent event) {
		try { userService.flush(); } catch(Exception e) {}
		try { roomService.flush(); } catch(Exception e) {}
	}
}
