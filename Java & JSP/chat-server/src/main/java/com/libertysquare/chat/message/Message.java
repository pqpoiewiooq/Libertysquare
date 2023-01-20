package com.libertysquare.chat.message;

import java.util.UUID;

import org.springframework.data.cassandra.core.cql.Ordering;
import org.springframework.data.cassandra.core.cql.PrimaryKeyType;
import org.springframework.data.cassandra.core.mapping.CassandraType;
import org.springframework.data.cassandra.core.mapping.CassandraType.Name;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;
import org.springframework.data.cassandra.core.mapping.Table;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CREATE TABLE message (id UUID, writer TEXT, roomId TIMEUUID, type TEXT, content TEXT, time BIGINT, PRIMARY KEY (roomId, time)) WITH CLUSTERING ORDER BY (time ASC);
 */
@Table
@Getter
@Setter(AccessLevel.MODULE)
@NoArgsConstructor(access = AccessLevel.MODULE)// serialize
@AllArgsConstructor(access = AccessLevel.PRIVATE)// builder
@Builder
public class Message {
	@CassandraType(type = Name.UUID)
	private UUID id;

	@Column
	@Setter(AccessLevel.PUBLIC)
	private String writer;
	
	@Column
	@PrimaryKeyColumn(type = PrimaryKeyType.PARTITIONED)
	@CassandraType(type = Name.TIMEUUID)
	private UUID roomId;
	
	@Column
	@CassandraType(type = Name.TEXT)
	private MessageType type;
	
	@Column
	private String content;
	
	@Column
	@PrimaryKeyColumn(type = PrimaryKeyType.CLUSTERED, ordering = Ordering.ASCENDING)
	private long time;
	
	public void clearRoomId() {
		this.roomId = null;
	}
}
