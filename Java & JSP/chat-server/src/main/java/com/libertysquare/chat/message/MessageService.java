package com.libertysquare.chat.message;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.libertysquare.chat.exception.MessageException;
import com.libertysquare.common.util.JsonUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {
	private final MessageRepository messageRepository;
	/**
	 * message 목록을 가져오고, room id에 mapping.
	 * message 내부의 roomId는 제거.(json 직렬화시 내용이 커지는 문제 방지)
	 */
//	public Map<UUID, List<Message>> findAllByRoomIdsAndAfter(Set<UUID> roomIds, long standardTime) {
//		List<Message> messages = messageRepository.findAllByRoomIdsAndAfter(roomIds, standardTime);
//		
//		Map<UUID, List<Message>> messageMap = new LinkedHashMap<>();
//		messages.forEach(message -> {
//			UUID roomId = message.getRoomId();
//			List<Message> messageList = messageMap.get(roomId);
//			if(messageList == null) {
//				messageList = new ArrayList<>();
//				messageMap.put(roomId, messageList);
//			}
//			messageList.add(message);
//			message.setRoomId(null);// roomId 제거
//		});
//		
//		return messageMap;
//	}
	
	
	public List<Message> findAllByRoomIdsAndAfter(List<UUID> roomIds, long standardTime) {
		if(roomIds == null || roomIds.isEmpty()) return new ArrayList<>();
		return messageRepository.findAllByRoomIdsAndAfter(roomIds, standardTime);
	}
	
	public Message encode(String payload) {
		Message msg = null;
		try {
			msg = JsonUtils.fromJson(payload, Message.class);
			msg.setTime(System.currentTimeMillis());
			return msg;
		} catch(Exception e) {
			throw new MessageException(e.getMessage() + "\n" + payload);
		}
	}
	
	public Message save(Message message) {
		message.setId(UUID.randomUUID());
		return messageRepository.save(message);
	}
}
