package me.blockhead.web.ticket.domain;

import org.springframework.data.repository.CrudRepository;

public interface EventTicketRepository extends CrudRepository<EventTicket, Long> {
}