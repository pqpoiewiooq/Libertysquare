package me.blockhead.web.organization.domain;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import me.blockhead.common.user.domain.User;

public interface OrganizerRepository extends JpaRepository<Organizer, Long> {
	Set<Organizer> findAllByUser(User user);
}
