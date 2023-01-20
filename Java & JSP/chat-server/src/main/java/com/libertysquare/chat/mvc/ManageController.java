package com.libertysquare.chat.mvc;

import java.io.IOException;
import java.util.Map;
import java.util.Map.Entry;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.libertysquare.chat.core.ChatService;
import com.libertysquare.chat.exception.ValidateException;
import com.libertysquare.chat.message.Message;
import com.libertysquare.chat.message.MessageType;
import com.libertysquare.chat.room.Participant;
import com.libertysquare.chat.room.Room;
import com.libertysquare.chat.room.RoomDTO;
import com.libertysquare.common.util.JsonUtils;
import com.libertysquare.common.util.Set;

import account.User;

@RestController
public class ManageController {
	@Autowired
	private ContactService contactService;
	
	@Autowired
	private ChatService chatService;
	
	@PostMapping(value = "/contact")
	@ResponseStatus(HttpStatus.CREATED)
	public String requestContact(@ModelAttribute ContactRequest contactRequest, HttpServletRequest request, HttpServletResponse response) throws IOException {
		User fromUser = contactService.parseUser(request);
		if(fromUser == null) throw new ValidateException(HttpServletResponse.SC_UNAUTHORIZED, "");
		
		contactService.validateContactRequest(contactRequest);
		ContactTarget target = contactService.getTargetOrRequest(contactRequest);
		
		String fromUserId = contactService.getChatUserId(fromUser);
		String toUserId = target.getUser().getID();
		
		UUID roomId = contactService.getContactRoomId(fromUserId, toUserId, target);
		if(roomId != null) throw new ValidateException(HttpServletResponse.SC_CONFLICT, roomId.toString());

		Room room = contactService.contact(Set.of(fromUserId, toUserId), target);
		
		Map<String, Participant> participants = room.getParticipants();
		RoomDTO dto = new RoomDTO(room);
		Participant requester = participants.get(fromUserId);
		String requesterId = requester.getId();
		dto.updateOwner(requester);
		String responseData = JsonUtils.toJson(dto);
		
		for(Entry<String, Participant> entry : participants.entrySet()) {
			WebSocketSession session = chatService.findSession(entry.getKey());
			if(session != null) {// 현재 연결된 유저한테만 전송.
				dto.updateOwner(entry.getValue());
				
				Message notifyMessage = Message.builder()
						.type(MessageType.CREATE)
						.writer(requesterId)
						.content(JsonUtils.toJson(dto))
						.build();
				
				session.sendMessage(new TextMessage(JsonUtils.toJson(notifyMessage)));
			}
		}
		
		return responseData;// 요청 유저에게는 단순 정보만 전송.
	}
	
	@ExceptionHandler(ValidateException.class)
	public String handleValidateException(ValidateException exception, HttpServletResponse response) {
		response.setStatus(exception.getStatus());
		return exception.getMessage();
	}
}
