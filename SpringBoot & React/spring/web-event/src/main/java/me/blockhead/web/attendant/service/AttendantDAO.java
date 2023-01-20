package me.blockhead.web.attendant.service;

import java.util.List;
import java.util.UUID;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

import com.libertysquare.event.attendant.domain.QAttendant;
import com.libertysquare.event.event.domain.QEvent;
import com.libertysquare.event.ticket.domain.QEventTicket;
import com.libertysquare.organization.domain.QOrganization;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;

import me.blockhead.web.event.presentation.EventDTO;

@Repository
@Transactional
public class AttendantDAO {
	private JPAQueryFactory query;

	public AttendantDAO(EntityManager em) {
		//this.em = em;
		this.query = new JPAQueryFactory(em);
	}

	public List<EventDTO> getAttendEventList(UUID userUuid) {
		QAttendant attendant = QAttendant.attendant;
		QEvent event = QEvent.event;
		QOrganization organization = QOrganization.organization;
		QEventTicket ticket = QEventTicket.eventTicket;
		
		return query.select(
					event.id, event.title, event.dtStart, event.coverPath,
					organization.id, organization.name
				)
				.from(ticket, organization)
				.innerJoin(organization.event, event)
				.innerJoin(ticket.event, event)
				.where(ticket.id.in(JPAExpressions
						.select(attendant.ticket.id)
						.from(attendant)
						.where(attendant.attendant.id.eq(userUuid))))
				.groupBy(event.id)
				.orderBy(event.id.asc())
				.fetch()
				.stream()
				.map(tuple -> EventDTO.builder()
						.id(tuple.get(event.id))
						.title(tuple.get(event.title))
						.dtStart(tuple.get(event.dtStart))
						.coverPath(tuple.get(event.coverPath))
						.organization(tuple.get(organization.id), tuple.get(organization.name))
						.build())
				.toList();
	}
}
