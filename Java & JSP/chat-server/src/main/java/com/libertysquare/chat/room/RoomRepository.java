package com.libertysquare.chat.room;

import java.util.Set;
import java.util.UUID;

import org.springframework.data.cassandra.core.mapping.CassandraType;
import org.springframework.data.cassandra.core.mapping.CassandraType.Name;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends CrudRepository<Room, UUID> {
	
	@Query("SELECT * FROM room WHERE participants CONTAINS KEY (?0);")
	Set<Room> findAllByUserId(String userId);

	/**
	 * 현재 최대 1:1 채팅 기준으로, 익명방/기본방 둘 밖에 안 나뉘므로 LIMIT 2 사용
	 */
	@Query("SELECT * FROM room WHERE linkedpostid = (?2) AND participants CONTAINS KEY (?0) AND participants CONTAINS KEY (?1) LIMIT 2 ALLOW FILTERING;")
	Set<Room> findAllContactRoom(String userId1, String userId2, long linkedpostid);
	
	@Query("SELECT * FROM room WHERE linkedpostid = (?2) AND type = (?3) AND participants CONTAINS KEY (?0) AND participants CONTAINS KEY (?1) LIMIT 1 ALLOW FILTERING;")
	Room findContactRoom(String userId1, String userId2, long linkedpostid, @CassandraType(type = Name.TEXT) RoomType roomType);
}