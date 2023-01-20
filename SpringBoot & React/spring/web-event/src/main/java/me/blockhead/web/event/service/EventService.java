package me.blockhead.web.event.service;

import java.security.InvalidParameterException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import lombok.RequiredArgsConstructor;
import me.blockhead.common.exception.DataNotFoundException;
import me.blockhead.common.exception.ForbiddenException;
import me.blockhead.common.user.domain.User;
import me.blockhead.common.user.domain.UserRepository;
import me.blockhead.common.user.domain.UserState;
import me.blockhead.common.user.presentation.UserDTO;
import me.blockhead.web.event.domain.Event;
import me.blockhead.web.event.domain.EventRepository;
import me.blockhead.web.event.presentation.EventDTO;
import me.blockhead.web.organization.domain.Organization;
import me.blockhead.web.organization.domain.OrganizationRepository;
import me.blockhead.web.organization.domain.OrganizationState;
import me.blockhead.web.organization.domain.Organizer;
import me.blockhead.web.organization.domain.OrganizerRepository;
import me.blockhead.web.organization.presentation.OrganizationDTO;
import me.blockhead.web.ticket.domain.EventTicket;
import me.blockhead.web.ticket.domain.EventTicketRepository;
import me.blockhead.web.ticket.presentation.EventTicketDTO;
import me.blockhead.web.ticket.request.NewEventTicketRequest;

@Service
@RequiredArgsConstructor
@Transactional
public class EventService {
	private final EventRepository eventRepository;
	private final OrganizationRepository organizationRepository;
	private final OrganizerRepository organizerRepository;
	private final EventTicketRepository eventTicketRepository;
	private final UserRepository userRepository;
	private final EventDAO eventDAO;

	public void addEvent(NewEventRequest request, UserDTO user) {
		if (ObjectUtils.isEmpty(request.getContactEmail()) && ObjectUtils.isEmpty(request.getContactTel())) {
			throw new InvalidParameterException("이메일 혹은 전화 번호 둘 중 하나는 필수 입니다");
		}

		Organization organization = organizationRepository
				.findByIdAndState(request.getOrganizationId(), OrganizationState.ACTIVE)
				.orElseThrow(() -> new DataNotFoundException("호스트 정보를 찾지 못하였습니다."));

		boolean isOrganizer = organization.getOrganizer().stream()
				.anyMatch((organizer) -> organizer.getUser().getUuid().equals(user.getUuid()));
		if (!isOrganizer) throw new ForbiddenException("해당 호스트 멤버에 속하지 않습니다.");

		Event event = Event.builder()
				.isPublic(request.isPublic())
				.type(request.getType())
				.applyLink(request.getApplyLink())
				.title(request.getTitle())
				.contactEmail(request.getContactEmail())
				.contactTel(request.getContactTel())
				.dtStart(request.getDtStart())
				.dtEnd(request.getDtEnd())
				.category(request.getCategory())
				.genre(request.getGenre())
				.hashtag(request.getHashtag())
				.isOnline(request.isOnline())
				.venue(request.getVenue())
				.detailVenue(request.getDetailVenue())
				.venueDescription(request.getVenueDescription())
				.content(request.getContent())
				.coverPath(request.getCoverPath())
				.organization(organization)
				.build();

		for (NewEventTicketRequest tr : request.getTicket()) {
			event.addTicket(createTicket(event, tr));
		}

		eventTicketRepository.saveAll(event.getTicket());

		eventRepository.save(event);
	}

	private EventTicket createTicket(Event event, NewEventTicketRequest request) {
		EventTicket entity = EventTicket.builder()
				.type(request.getType())
				.name(request.getName())
				.description(request.getDescription())
				.price(request.getPrice())
				.quantity(request.getQuantity())
				.stock(request.getQuantity())
				.hideStock(request.isHideStock())
				.purchaseLimit(request.getPurchaseLimit())
				.startDateTime(request.getStartDateTime())
				.endDateTime(request.getEndDateTime())
				.refundDeadline(request.getRefundDeadline())
				.event(event)
				.build();

		return entity;
	}

	public Map<String, List<EventDTO>> getMainEventMap() {
		List<EventDTO> recommendation = eventDAO.getRecommendationList(1);
		if (recommendation == null) throw new DataNotFoundException("recommendation");

		List<EventDTO> recency = eventDAO.getRecencyList(1);
		if (recency == null) throw new DataNotFoundException("recency");

		List<EventDTO> online = eventDAO.getOnlineList(1);
		if (online == null) throw new DataNotFoundException("online");

		List<EventDTO> imminent = eventDAO.getImminentList(1);
		if (imminent == null) throw new DataNotFoundException("imminent");

		List<EventDTO> free = eventDAO.getFreeList(1);
		if (free == null) throw new DataNotFoundException("free");

		Map<String, List<EventDTO>> eventMap = new LinkedHashMap<>();
		eventMap.put("recommendation", recommendation);
		eventMap.put("recency", recency);
		eventMap.put("online", online);
		eventMap.put("imminent", imminent);
		eventMap.put("free", free);

		return eventMap;
	}

	public Map<String, Object> getDetailEvent(String id) {
		Map<String, Object> map = new HashMap<>();

		Optional<Event> optionalEvent = Optional.empty();
		try {
			try {
				long eventId = Long.parseLong(id);
				optionalEvent = eventRepository.findById(eventId);
			} catch (NumberFormatException e) {
				optionalEvent = eventRepository.findFirstByUuid(UUID.fromString(id));
			}
		} catch (Exception e) {
			throw new DataNotFoundException("인식할 수 없는 값입니다.\n" + id);
		}

		optionalEvent.orElseThrow(() -> new DataNotFoundException("행사 정보를 찾지 못하였습니다."));
		Event event = optionalEvent.get();
		map.put("event", new EventDTO(event, false));

		Organization organization = event.getOrganization();
		OrganizationDTO organizationDto = OrganizationDTO.builder()
				.simple(organization)
				.organizer(organization.getOrganizer())
				.build();
		map.put("organization", organizationDto);

		Set<EventTicket> ticketSet = event.getTicket();
		List<EventTicketDTO> ticketList = new ArrayList<>();
		for (EventTicket ticket : ticketSet) {
			ticketList.add(new EventTicketDTO(ticket));
		}
		map.put("ticket", ticketList);

		return map;
	}

	public List<Map<String, Object>> getAffiliatedOrganizationEvents(UUID userUuid) {
		User user = userRepository.findFirstByUuidAndState(userUuid, UserState.ACTIVE)
				.orElseThrow(() -> new DataNotFoundException("회원 정보를 찾지 못하였습니다."));

		List<Map<String, Object>> result = new ArrayList<>();

		Set<Organizer> affiliatedSet = organizerRepository.findAllByUser(user);
		for (Organizer organizer : affiliatedSet) {
			Organization organization = organizer.getOrganization();
			OrganizationDTO organizationDTO = OrganizationDTO.builder()
					.id(organization.getId())
					.name(organization.getName())
					.build();

			Set<Event> eventSet = organization.getEvent();
			Set<EventDTO> eventDTOSet = new LinkedHashSet<>();
			for (Event event : eventSet) {
				EventDTO eventDTO = EventDTO.builder()
						.id(event.getId())
						.title(event.getTitle())
						.dtStart(event.getDtStart())
						.type(event.getType())
						.coverPath(event.getCoverPath())
						.build();
				eventDTOSet.add(eventDTO);
			}

			Map<String, Object> resultValueMap = new LinkedHashMap<>();
			resultValueMap.put("organization", organizationDTO);
			resultValueMap.put("event", eventDTOSet);
			result.add(resultValueMap);
		}

		return result;
	}

	public List<EventDTO> getList(int page) {
		Page<Event> entityPage = eventRepository.findAll(Pageable.ofSize(10).withPage(page));

		return entityPage.stream()
				.map(event -> EventDTO.builder()
						.id(event.getId())
						.title(event.getTitle())
						.dtStart(event.getDtStart())
						.type(event.getType())
						.coverPath(event.getCoverPath())
						.organization(event.getOrganization())
						.build())
				.toList();
	}
}
