package com.libertysquare.chat.message;

import java.util.List;
import java.util.UUID;

import org.springframework.data.cassandra.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends CrudRepository<Message, UUID> {
	// 현재 Cassandra Driver에서는 IN 절 사용시 괄호 붙이면 오류 나옴. [ SELECT ... WHERE roomId IN (?0) ... ] 하면 오류
	@Query("SELECT * FROM message WHERE roomId IN ?0 AND time > (?1);")
	List<Message> findAllByRoomIdsAndAfter(List<UUID> roomIds, long standardTime);
}
