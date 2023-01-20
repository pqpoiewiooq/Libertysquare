package me.blockhead.web.attendant.domain;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import me.blockhead.common.user.domain.User;
import me.blockhead.web.ticket.domain.EventTicket;

public interface AttendantRepository extends JpaRepository<Attendant, Long> {
	Optional<Attendant> findFirstByAttendant(UUID userUuid);
	
	/**
	 * @Deprecated
	 * long countByAttendant_IdAndTicket(UUID attendantUuid, EventTicket ticket);
	 * 
	 * https://bcp0109.tistory.com/m/305 참고.
	 */
	long countByAttendantAndTicket(User attendant, EventTicket ticket);
}
