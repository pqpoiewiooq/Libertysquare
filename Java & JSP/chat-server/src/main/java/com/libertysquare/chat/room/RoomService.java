package com.libertysquare.chat.room;

import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import javax.annotation.Nonnull;

import org.springframework.stereotype.Service;

import com.libertysquare.chat.core.AbstractPersistentManager;
import com.libertysquare.chat.exception.MessageException;
import com.libertysquare.chat.user.ChatUser;
import com.libertysquare.chat.user.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomService extends AbstractPersistentManager<UUID, Room> {
	private final RoomRepository roomRepository;
	private final UserService userService;
	
	@Override
	protected Room savePersistent(Room room) {
		// 저장시 getter를 이용하는지 직접적으로 확인하는지 몰라서 일단 synchronizeProfile 호출
		Map<String, Participant> participants = room.getParticipants();
		participants.values().forEach(participant -> {
			participant.synchronizeProfile();
		});
		
		return roomRepository.save(room);
	}

	@Override
	protected Iterable<Room> savePersistentAll(Iterable<Room> rooms) {
		roomRepository.saveAll(rooms);
		return rooms;
	}
	
	@Override
	protected Optional<Room> loadPersistent(UUID roomId) {
		Optional<Room> findRoom = roomRepository.findById(roomId);
		
		if(findRoom.isPresent()) {
			injectParticipantPrincipal(findRoom.get());
		}
		
		return findRoom;
	}
	
	/**
	 * @param userIds {@link ChatUser#getId()}
	 */
	public Room create(Set<String> userIds, long linkedPostId, RoomType type) {
		if(userIds.size() < 2) throw new MessageException("Requires 2 participants to create a room");
		ProfileType profileType = (type == RoomType.PRIVATE) ? ProfileType.ANONYMOUS : ProfileType.SYNCHRONIZE;
		
		long currentTime = System.currentTimeMillis();
		Map<String, Participant> participantsMap = new HashMap<>();
		Set<ChatUser> users = userService.findAllById(userIds);
		ParticipantIdGenerator idGenerator = new ParticipantIdGenerator();
		users.forEach(user -> {
			// save가 호출하는 savePersistent에서 synchronizeProfile을 호출해주기 때문에 프로필 설정은 별도로 해주지 않음
			Participant participant = new Participant.ParticipantBuilder()
					.id(idGenerator.generate())
					.profileType(profileType)
					.lastViewTime(currentTime)
					.principal(user)
					.build();
			participantsMap.put(user.getId(), participant);
		});
		
		Room room = Room.builder()
				.linkedPostId(linkedPostId)
				.type(type)
				.participants(participantsMap)
				.build();
		
		return save(room);
	}
	
	public Set<Room> findAllByUserId(String userId) {
		Set<Room> findRooms = roomRepository.findAllByUserId(userId);

		Set<Room> rooms = new LinkedHashSet<>();
		
		findRooms.stream().forEach(room -> {
			Room persistent = findPersistent(room.getId());
			if(persistent == null) {
				injectParticipantPrincipal(room);
				persist(room);
				
				rooms.add(room);
			} else {
				rooms.add(persistent);
			}
		});
		
		return rooms;
	}
	
	/**
	 * 현재는 1:1이 기반이므로 비효율적이더라도 ALLOW FILTERING 활성화하여 조회
	 * 
	 * 아래 주소는 key값만 가져오는 UserDefineFunction 생성 자료
	 * https://www.google.com/search?q=cassandra+get+key+in+map&oq=cassandra+get+key+in+map&aqs=chrome..69i57.7363j0j4&sourceid=chrome&ie=UTF-8
	 */
	public UUID findContactRoomId(String userId1, String userId2, long linkedPostId, RoomType type) {
		Room room = roomRepository.findContactRoom(userId1, userId2, linkedPostId, type);
		if(room == null) return null;
		
		return room.getId();
	}
	
	/**
	 * Participants에 Principal 주입
	 */
	private void injectParticipantPrincipal(@Nonnull Room room) {
		Map<String, Participant> participants = room.getParticipants();
		
		Set<ChatUser> users = userService.findAllById(participants.keySet());
		users.forEach(user -> {
			Participant participant = participants.get(user.getId());
			participant.setPrincipal(user);
		});
	}
}
