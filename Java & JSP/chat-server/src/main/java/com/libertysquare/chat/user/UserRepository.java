package com.libertysquare.chat.user;

import java.util.Set;

import org.springframework.data.cassandra.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<ChatUser, String> {
	@Override
	Set<ChatUser> findAllById(Iterable<String> ids);
	
	@Query("update user SET nickname = ?1, profilePath = ?2, fcmToken = ?3 WHERE id = ?0;")
	void update(String id, String nickname, String profilePath, String fcmToken);
}