package com.libertysquare.chat.room;

import java.util.Map;
import java.util.UUID;

import org.springframework.data.cassandra.core.mapping.CassandraType;
import org.springframework.data.cassandra.core.mapping.CassandraType.Name;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import com.datastax.oss.driver.api.core.uuid.Uuids;
import com.libertysquare.chat.core.Persistent;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;

/**
 * <p>
 * CREATE TABLE room (id TIMEUUID PRIMARY KEY, linkedPostId BIGINT, type TEXT, participants MAP<TEXT, FROZEN<participant>>);
 * CREATE INDEX idx_participants ON room (KEYS(participants));
 * </p>
 */
@Table
@EqualsAndHashCode(of = "id")
@Getter
@Builder
public class Room implements Persistent<UUID> {
	/**
	 * default {@link Uuids#timeBased()}
	 */
	@PrimaryKey
	@Builder.Default
	@CassandraType(type = Name.TIMEUUID)
	private UUID id = Uuids.timeBased();
	
	@Column
	private long linkedPostId;
	
	@Column
	@CassandraType(type = Name.TEXT)
	private RoomType type;
	
	/**
	 * Key - ChatUser id
	 */
	@Column
	@CassandraType(type = Name.MAP, typeArguments = { Name.TEXT, Name.UDT }, userTypeName = Participant.UDT_NAME)
	private Map<String, Participant> participants;
	
	public String getParticipantId(String chatUserId) {
		if(participants == null) return null;
		
		Participant participant = participants.get(chatUserId);
		
		return participant == null ? null : participant.getId();
	}
}