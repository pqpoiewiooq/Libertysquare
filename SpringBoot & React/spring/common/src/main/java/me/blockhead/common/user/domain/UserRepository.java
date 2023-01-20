package me.blockhead.common.user.domain;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, UUID> {
	Optional<User> findFirstByIdAndState(String id, UserState state);
	boolean existsByIdAndState(String id, UserState state);
	Optional<User> findFirstByUuidAndState(UUID uuid, UserState state);
	Set<User> findByIdInAndState(Set<String> ids, UserState state);

	
	@Query("select uuid from member where (member.auth_id = ?1 or member.di = ?2) and member.state = ?3")
	boolean existsMember(String authId, String di, UserState state);
	

	Optional<User> findByIdAndPwAndState(String id, String pw, UserState state);
}