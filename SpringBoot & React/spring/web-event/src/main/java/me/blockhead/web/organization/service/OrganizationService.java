package me.blockhead.web.organization.service;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import me.blockhead.common.exception.DataNotFoundException;
import me.blockhead.common.exception.ForbiddenException;
import me.blockhead.common.user.domain.User;
import me.blockhead.common.user.domain.UserRepository;
import me.blockhead.common.user.domain.UserState;
import me.blockhead.web.event.domain.Event;
import me.blockhead.web.event.presentation.EventDTO;
import me.blockhead.web.organization.domain.Organization;
import me.blockhead.web.organization.domain.OrganizationRepository;
import me.blockhead.web.organization.domain.OrganizationState;
import me.blockhead.web.organization.domain.Organizer;
import me.blockhead.web.organization.domain.OrganizerRepository;
import me.blockhead.web.organization.presentation.OrganizationDTO;
import me.blockhead.web.organization.request.OrganizationCreateRequest;
import me.blockhead.web.organization.request.OrganizationSimpleUpdateRequest;
import me.blockhead.web.organization.request.OrganizationUpdateRequest;

@Service
@RequiredArgsConstructor
@Transactional
public class OrganizationService {
	private final OrganizationRepository organizationRepository;
	private final OrganizerRepository organizerRepository;
	private final UserRepository userRepository;
	//private final OrganizationDAO organizationDAO;
	
	public Organization findById(long id) {
		return findById(id, OrganizationState.ACTIVE);
	}
	
	private Organization findById(long id, OrganizationState state) {
		Optional<Organization> organization = state == null ? organizationRepository.findById(id) : organizationRepository.findByIdAndState(id, state);
		
		return organization.orElseThrow(() -> new DataNotFoundException("호스트 정보를 찾지 못하였습니다."));
	}
	
	private User findUser(String authId) {
		return userRepository.findFirstByIdAndState(authId, UserState.ACTIVE)
				.orElseThrow(() -> new DataNotFoundException(authId));
	}
	
	private Set<User> toUserSet(Set<String> userIds) {
		if(userIds == null) return null;
		
		Set<User> users = userRepository.findByIdInAndState(userIds, UserState.ACTIVE);
		if(users.size() < 1) throw new DataNotFoundException(userIds.toString());
		
		return users;
	}
	
	private void verifyOrganizer(Organization organization, UUID userUuId) {
		for(Organizer organizer : organization.getOrganizer()) {
			if(organizer.getUser().getUuid().equals(userUuId)) {
				return;
			}
		}
		throw new ForbiddenException("You don't have permission to edit.\n수정 권한이 없습니다.");
	}
	
	public void create(OrganizationCreateRequest request, String requestUserId) {
		Organization newOrganization = Organization.builder()
				.name(request.getName())
				.simpleIntroduce(request.getSimpleIntroduce())// null 가능
				.coverPath("temp cover")
				.profilePath("temp profile")
				.venue("")
				.detailVenue("")
				.since(LocalDate.now())
				.themeColor("#FF2D54")
				.state(OrganizationState.ACTIVE)
                .build();
		organizationRepository.save(newOrganization);
		
		Set<Organizer> organizerSet = new LinkedHashSet<>();
		Set<String> requestSet = request.getOrganizer();
		if(!requestSet.contains(requestUserId)) requestSet.add(requestUserId);
		for(String organizerId : requestSet) {
			Organizer organizer = Organizer.builder()
					.user(findUser(organizerId))
					.organization(newOrganization)
					.build();
			organizerSet.add(organizer);
		}
		
		organizerRepository.saveAll(organizerSet);
	}
	
	public OrganizationDTO get(long id, UUID requestUserUuid) {
		Organization organization = findById(id);
		
		return OrganizationDTO.builder()
				.detail(organization, requestUserUuid)
				.organizer(organization.getOrganizer())
				.build();
	}
	
	public boolean exists(String name) {
		return organizationRepository.existsByNameAndState(name, OrganizationState.ACTIVE);
	}
	
	public Set<OrganizationDTO> getAffiliated(User user) {
		Set<Organizer> organizers = organizerRepository.findAllByUser(user);
		return OrganizationDTO.simpleSetFromOrganizerSet(organizers);
	}
	
	public Set<EventDTO> getHostedEvent(long id) {
		Set<Event> events =  findById(id).getEvent();
		
		Set<EventDTO> eventDTOSet = new LinkedHashSet<>();
		for(Event event : events) {
			EventDTO eventDTO = EventDTO.builder()
					.id(event.getId())
					.title(event.getTitle())
					.dtStart(event.getDtStart())
					.type(event.getType())
					.coverPath(event.getCoverPath())
					.organization(event.getOrganization())
					.ticket(event.getTicket())
					.build();
			
			eventDTOSet.add(eventDTO);
		}
		
		return eventDTOSet;
	}
	
	public void updateSimple(OrganizationSimpleUpdateRequest request, UUID userUuid) {
		Organization organization = findById(request.getId());
		
		verifyOrganizer(organization, userUuid);

		organization.updateName(request.getName());
		organization.updateSimpleIntroduce(request.getSimpleIntroduce());
		organization.updateOrganizer(toUserSet(request.getOrganizer()), organizerRepository);
	}
	
	public void update(OrganizationUpdateRequest request, UUID userUuid) {
		Organization organization = findById(request.getId());
		
		verifyOrganizer(organization, userUuid);

		organization.updateName(request.getName());
		organization.updateIntroduce(request.getIntroduce());
		organization.updateSimpleIntroduce(request.getSimpleIntroduce());
		organization.updateCoverPath(request.getCoverPath());
		organization.updateProfilePath(request.getProfilePath());
		organization.updateVenue(request.getVenue());
		organization.updateDetailVenue(request.getDetailVenue());
		organization.updateSince(request.getSince());
		organization.updateThemeColor(request.getThemeColor());
		organization.updateOrganizer(toUserSet(request.getOrganizer()), organizerRepository);
	}
	
	public void delete(long id) {
		Optional<Organization> organization = organizationRepository.findById(id);
		
		organization.ifPresent(selectOrganization -> {
			selectOrganization.delete();
		});
	}
}
