package me.blockhead.web.event.domain;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
	Optional<Event> findFirstByUuid(UUID uuid);
}
