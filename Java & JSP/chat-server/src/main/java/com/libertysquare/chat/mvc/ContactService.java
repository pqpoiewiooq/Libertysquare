package com.libertysquare.chat.mvc;

import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Service;

import com.libertysquare.chat.core.ChatService;
import com.libertysquare.chat.exception.ValidateException;
import com.libertysquare.chat.room.Room;
import com.libertysquare.chat.room.RoomService;
import com.libertysquare.chat.room.RoomType;
import com.libertysquare.chat.user.ChatUser;
import com.libertysquare.chat.user.UserService;
import com.libertysquare.common.config.websocket.WebSocketConfig;

import account.User;
import lombok.RequiredArgsConstructor;
import net.jodah.expiringmap.ExpirationPolicy;
import net.jodah.expiringmap.ExpiringMap;

@Service
@RequiredArgsConstructor
public class ContactService {
	private final MysqlDao mysqlDao;
	
	private ExpiringMap<String, ContactTarget> targetMap = ExpiringMap.builder()
			.expiration(10, TimeUnit.MINUTES)
			.expirationPolicy(ExpirationPolicy.ACCESSED)
			.build();
	
	/**
	 * 메모리에 {@link ContactTarget}이 있으면 가져오고 없으면 db 요청
	 * <br>
	 * [중요] 가져올 때, ContactTarget의 user id를 ChatUser의 Id값으로 변경
	 */
	public ContactTarget getTargetOrRequest(ContactRequest contactRequest) {
		String key = contactRequest.getType().name() + contactRequest.getId();
		ContactTarget target = targetMap.get(key);
		
		if(target == null) {
			target = mysqlDao.getTarget(contactRequest);
			
			User targetUser = target.getUser();
			String targetUserId = getChatUserId(targetUser);
			targetUser.setID(targetUserId);
			
			targetMap.put(key, target);
		}
		
		return target;
	}
	
	private final RoomService roomService;
	private final UserService userService;
	private final ChatService chatService;
	
	/**
	 * validation 의존성 추가하기 싫어서 직접 확인
	 * @throws ValidateException 검증 실패
	 */
	public void validateContactRequest(ContactRequest contactRequest) {
		if(contactRequest == null) throw new ValidateException(HttpServletResponse.SC_BAD_REQUEST, "");
		if(contactRequest.getType() == null) throw new ValidateException(HttpServletResponse.SC_BAD_REQUEST, "잘못된 타입");
		if(contactRequest.getId() < 1) throw new ValidateException(HttpServletResponse.SC_BAD_REQUEST, "id는 양수여야 합니다");
	}
	
	private RoomType toRoomType(ContactTarget target) {
		return target.isAnonymity() ? RoomType.PRIVATE : RoomType.PUBLIC;
	}
	
	public UUID getContactRoomId(String fromUserId, String toUserId, ContactTarget target) {
		return roomService.findContactRoomId(fromUserId, toUserId, target.getPostId(), toRoomType(target));
	}
	
	public String getChatUserId(User user) {
		ChatUser chatUser = userService.getOrSignup(user, chatService::welcome);
		return chatUser.getId();
	}
	
	public Room contact(Set<String> participants, ContactTarget target) {
		return roomService.create(participants, target.getPostId(), toRoomType(target));
	}
	
	/**
	 * session에 등록된 유저 가져옴.
	 */
	public User parseUser(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if(session != null) {
			Object attr = session.getAttribute(WebSocketConfig.ATTR_USER);
			if(attr != null && attr instanceof User) {
				return (User) attr;
			}
		}
		return null;
	}
}
