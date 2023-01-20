package com.libertysquare.chat.room;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.libertysquare.chat.message.Message;

import lombok.Getter;

@Getter
public class RoomDTO {
	private UUID id;
	private long linkedPostId;
	private RoomType type;
	private Set<Participant> participants;
	private List<Message> messages = new ArrayList<>();
	private String myParticipantId;
	private boolean isOnAlarm;
	
	public RoomDTO(Room room) {
		this.id = room.getId();
		this.participants = new HashSet<>(room.getParticipants().values());
		this.type = room.getType();
		this.linkedPostId = room.getLinkedPostId();
	}
	
	public RoomDTO(Room room, String requesterId) {
		this(room);
		updateOwner(requesterId);
	}
	
	public void updateOwner(String owner) {
		for(Participant participant : participants) {
			if(participant.getPrincipal().getId().equals(owner)) {
				updateOwner(participant);
				break;
			}
		}
	}
	
	/**
	 * 사용 유의. 검증 없이 해당 내용만으로 변경하기때문에, 잘못된 값이 저장될 수 있음
	 */
	public void updateOwner(Participant participant) {
		myParticipantId = participant.getId();
		isOnAlarm = participant.isOnAlarm();
	}
}
