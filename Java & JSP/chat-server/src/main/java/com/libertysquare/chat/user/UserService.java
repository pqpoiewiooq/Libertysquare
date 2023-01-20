package com.libertysquare.chat.user;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.function.Consumer;

import org.springframework.stereotype.Service;

import com.libertysquare.chat.core.AbstractPersistentManager;
import com.libertysquare.common.config.websocket.UserIdEncoder;

import account.User;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService extends AbstractPersistentManager<String, ChatUser> {
	private final UserRepository userRepository;
	private final UserIdEncoder userIdEncoder;
	
	@Override
	protected ChatUser savePersistent(ChatUser chatUser) {
		return userRepository.save(chatUser);
	}
	
	@Override
	protected Iterable<ChatUser> savePersistentAll(Iterable<ChatUser> chatUsers) {
		userRepository.saveAll(chatUsers);
		return chatUsers;
	}
	
	@Override
	protected Optional<ChatUser> loadPersistent(String userId) {
		return userRepository.findById(userId);
	}
	
	/**
	 * @param presenter signup시 호출
	 */
	public ChatUser getOrSignup(User user, Consumer<ChatUser> presenter) {
		String userId = userIdEncoder.encode(user.getUUID());

		ChatUser chatUser = find(userId);
		
		if(chatUser == null) {
			chatUser = signup(userId, user);
			if(presenter != null) presenter.accept(chatUser);
		} else {
			chatUser.update(user);
		}
		
		return chatUser;
	}
	
//	public ChatUser getOrSignup(User user) {
//		return getOrSignup(user, null);
//	}
	
	private ChatUser signup(String encodedUserId, User user) {
		ChatUser chatUser = ChatUser.builder()
				.id(encodedUserId)
				.nickname(user.getNickname())
				.fcmToken(user.getFCMToken())
				.profilePath(user.getProfilePath())
				.build();
		
		return save(chatUser);
	}

	/**
	 * 영속화된 {@link ChatUser}를 제외하고, {@link UserRepository#findAllById(Iterable)}로 가져온 다음 영속화
	 */
	public Set<ChatUser> findAllById(Set<String> ids) {
		Set<ChatUser> users = new HashSet<>();
		
		Set<String> noPersistIds = new HashSet<>();
		ids.forEach(id -> {
			ChatUser user = findPersistent(id);
			if(user == null) {
				noPersistIds.add(id);
			} else {
				users.add(user);
			}
		});
		
		Set<ChatUser> findUsers = userRepository.findAllById(noPersistIds);
		persistAll(findUsers);
		users.addAll(findUsers);
		
		return users;
	}
}
