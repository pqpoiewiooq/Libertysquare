package me.blockhead.web.event.service;

import java.util.List;

import javax.persistence.EntityManager;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;

import me.blockhead.web.event.presentation.EventDTO;

@Repository
public class EventDAO {
	private JPAQueryFactory queryFactory;

	public EventDAO(EntityManager em) {
		this.queryFactory = new JPAQueryFactory(em);
	}
	
	public List<EventDTO> getRecommendationList(int page) {
//		return EventQueryFactory.start(queryFactory)
//				.recommendation()
//				.toDtoList();
		return List.of();
	}

	public List<EventDTO> getOnlineList(int page) {
//		return EventQueryFactory.start(queryFactory)
//				.isOnline(true)
//				.recommendation()
//				.toDtoList();
		return List.of();
	}
	
	public List<EventDTO> getRecencyList(int page) {
		return EventQueryFactory.start(queryFactory)
				.descCreatedDate()
				.toDtoList();
	}

	public List<EventDTO> getImminentList(int page) {
		return EventQueryFactory.start(queryFactory, true)
				.imminent()
				.descDateTimeEnd()
				.page(page)
				.toDtoList();
	}
	
	public List<EventDTO> getFreeList(int page) {
		return EventQueryFactory.start(queryFactory, true)
				.free()
				.page(page)
				.toDtoList();
	}
	

//	public List<EventDTO> getFreeList(int page) {
//		
//		JPAQuery<EventEntity> query = queryFactory
//				.select(event)
//				.from(ticket)
//				.innerJoin(ticket.event, event)
//				.where(ticket.price.eq(0), event.isPublic.eq(true))
//				.groupBy(event.id)
//				.offset((page - 1) * limit).limit(page);
//		
//		return q.fetch().stream().map(EventDTO::new).toList();
//	}
}
