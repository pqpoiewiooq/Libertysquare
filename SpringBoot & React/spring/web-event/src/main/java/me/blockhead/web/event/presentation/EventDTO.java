package me.blockhead.web.event.presentation;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import me.blockhead.web.event.domain.Event;
import me.blockhead.web.event.domain.EventCategory;
import me.blockhead.web.event.domain.EventGenre;
import me.blockhead.web.event.domain.EventType;
import me.blockhead.web.organization.domain.Organization;
import me.blockhead.web.organization.presentation.OrganizationDTO;
import me.blockhead.web.ticket.domain.EventTicket;
import me.blockhead.web.ticket.presentation.EventTicketDTO;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventDTO {
	private long id;
	private EventType type;
	private String title;
	private LocalDateTime dtStart;
	private LocalDateTime dtEnd;
	private String[] hashtag;
	private boolean isPublic;
	private boolean isOnline;
	private String coverPath;
	
	// non-simple
	private String applyLink;
	private String contactEmail;
	private String contactTel;
	private Set<EventCategory> category;
	private EventGenre genre;
	private String venue;
	private String detailVenue;
	private String venueDescription;
	private String content;
	
//	private Integer price;
//	private Integer participants;//구매자 수
	private Set<EventTicketDTO> ticket;
	private OrganizationDTO organization;
	
	public EventDTO(Event event) {
		this(event, true);
	}
	
	public EventDTO(Event event, boolean simple) {
		this.id = event.getId();
		this.type = event.getType();
		this.title = event.getTitle();
		this.dtStart = event.getDtStart();
		this.dtEnd = event.getDtEnd();
		this.hashtag = event.getHashtag();
		this.isPublic = event.isPublic();
		this.isOnline = event.isOnline();
		this.coverPath = event.getCoverPath();
		
		if(!simple) {
			this.applyLink = event.getApplyLink();
			this.contactEmail = event.getContactEmail();
			this.contactTel = event.getContactTel();
			this.category = event.getCategory();
			this.genre = event.getGenre();
			this.venue = event.getVenue();
			this.detailVenue = event.getDetailVenue();
			this.venueDescription = event.getVenueDescription();
			this.content = event.getContent();
		}
	}
	
	
	
	// 메인페이지 - Array<날짜, 사진, 제목, 온/오프, 해시태그>
	// 주최한 이벤트, 내 티켓 - 시작 날짜, 사진, 제목 / 호스트 이름
	// 리스팅 페이지 - 시작 날짜, 사진, 제목, 내외부(타입) / 호스트 이름  / 가격
	// 호스트 페이지 - 시작 날짜, 사진, 제목, 내외부(타입) / 호스트 이름  / 가격, 참가자수
	public static class EventDTOBuilder {
		
		public EventDTOBuilder ticket(Set<EventTicket> tickets) {
			Set<EventTicketDTO> ticketDTOSet = new LinkedHashSet<>();
			for(EventTicket ticket : tickets) {
				EventTicketDTO ticketDTO = EventTicketDTO.builder()
						.personnel(ticket)
						.price(ticket.getPrice())
						.build();
				ticketDTOSet.add(ticketDTO);
			}
			this.ticket = ticketDTOSet;
			
			return this;
		}
		
		public EventDTOBuilder organization(Organization organization) {
			return organization(organization.getId(), organization.getName());
		}
		
		public EventDTOBuilder organization(long id, String name) {
			OrganizationDTO organization = OrganizationDTO.builder()
					.id(id)
					.name(name)
					.build();
			
			this.organization = organization;
			
			return this;
		} 
	}
}
