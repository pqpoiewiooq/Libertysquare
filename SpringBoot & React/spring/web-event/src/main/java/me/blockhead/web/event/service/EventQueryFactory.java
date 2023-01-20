package me.blockhead.web.event.service;

import java.util.List;

import com.libertysquare.event.event.domain.EventEntity;
import com.libertysquare.event.ticket.domain.QEventTicketEntity;
import com.querydsl.core.types.Expression;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.core.types.dsl.NumberTemplate;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;

import me.blockhead.web.event.domain.Event;
import me.blockhead.web.event.domain.EventType;
import me.blockhead.web.event.presentation.EventDTO;

public class EventQueryFactory {
	private static final QEvent event = QEvent.eventEntity;
	private static final QEventTicket ticket = QEventTicket.eventTicketEntity;
	
	private int pagingRange = 10;
	
	private JPAQuery<Event> query;
	
	private EventQueryFactory(JPAQueryFactory queryFactory, boolean joinTicket) {
		this.query = queryFactory.select(event);
		
		if(joinTicket) {
			query.from(ticket).innerJoin(ticket.event, event);
		} else {
			query.from(event);
		}
		
		isPublic(true);
	}
	
	public static EventQueryFactory start(JPAQueryFactory queryFactory) {
        return new EventQueryFactory(queryFactory, false);
    }
	
	public static EventQueryFactory start(JPAQueryFactory queryFactory, boolean joinTicket) {
		return new EventQueryFactory(queryFactory, joinTicket);
    }
	
	public EventQueryFactory isOnline(boolean isOnline) {
		query.where(event.isOnline.eq(isOnline));
		
		return this;
	}
	
	public EventQueryFactory isPublic(boolean isPublic) {
		query.where(event.isPublic.eq(isPublic));
		
		return this;
	}
	
	public EventQueryFactory free() {
		query.where(ticket.price.eq(0));
		
		return this;
	}
	
	/**
	 * 임박한 행사만 가져오도록 where 추가.
	 * D-7 까지 허용
	 */
	public EventQueryFactory imminent() {
		NumberTemplate<Integer> diffTemplate = Expressions.numberTemplate(
				Integer.class,
				"TIMESTAMPDIFF(HOUR, {0}, {1})",
				event.dtEnd,
				Expressions.currentTimestamp());
		
		query.where(diffTemplate.between(-7, 0));
		
		return this;
	}
	
	public EventQueryFactory page(int page) {
		query.offset((page - 1) * pagingRange).limit(page);
		
		return this;
	}
	
	// 미완성. 확인 후 다시 설정 필요
	public EventQueryFactory recommendation() {
		QEventTicketEntity subTicket = new QEventTicketEntity("subTicket");
		
		Expression<Integer> higherPriceExp = 
                JPAExpressions
                	.select(subTicket.price.max())
                	.from(subTicket)
                	.where(subTicket.event.id.eq(event.id));
		//(SELECT GROUP_CONCAT(price) FROM ticket WHERE event.tickets LIKE CONCAT('%', ticket.id, '%')) AS price
		
		NumberExpression<Integer> orderCase = new CaseBuilder()
				.when(event.type.eq(EventType.INSIDE)).then(1)
				.otherwise(2);
		
		query.select(higherPriceExp, orderCase)
			.orderBy(orderCase.desc(), event.dtEnd.desc());

		return this;
	}
	
	public EventQueryFactory descCreatedDate() {
		query.orderBy(event.createdDate.desc());
		
		return this;
	}
	
	public EventQueryFactory descDateTimeEnd() {
		query.orderBy(event.dtEnd.desc());
		
		return this;
	}
	
	public List<EventDTO> toDtoList() {
		return query.fetch().stream()
					.map(entity -> EventDTO.builder()
							.id(entity.getId())
							.title(entity.getTitle())
							.dtStart(entity.getDtStart())
							.dtEnd(entity.getDtEnd())
							.isOnline(entity.isOnline())
							.hashtag(entity.getHashtag())
							.coverPath(entity.getCoverPath())
							.build())
					.toList();
	}
	
	public JPAQuery<EventEntity> query() {
		return query;
	}
}
