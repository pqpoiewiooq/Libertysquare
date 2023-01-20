package me.blockhead.web.organization.presentation;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import me.blockhead.common.user.domain.User;
import me.blockhead.web.event.domain.Event;
import me.blockhead.web.organization.domain.Organization;
import me.blockhead.web.organization.domain.Organizer;
import me.blockhead.web.organization.domain.Subscriber;
import me.blockhead.web.ticket.domain.EventTicket;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizationDTO {
	/*** required field ***/
	private long id;
	private String name;
	private String introduce;
	private String simpleIntroduce;
	private String coverPath;
	private String profilePath;

	/* organizer - Custom Lombok Setter */
	@Setter(AccessLevel.NONE)
	private Set<OrganizerDTO> organizer;

	private static Set<OrganizerDTO> organizerSet(Set<Organizer> organizers) {
		Set<OrganizerDTO> organizerSet = new LinkedHashSet<>();
		for (Organizer organizer : organizers) {
			User user = organizer.getUser();
			OrganizerDTO organizerDTO = OrganizerDTO.builder()
					.id(user.getId())
					.nickname(user.getNickname())
					.build();
			organizerSet.add(organizerDTO);
		}
		return organizerSet;
	}

	public void setOrganizer(Set<Organizer> organizers) {
		this.organizer = organizerSet(organizers);
	}

	/*** detail field ***/
	private String venue;
	private String detailVenue;
	private LocalDate since;
	private String themeColor;// ^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$

	private Boolean hasSubscribed;
	private Integer subscribeCount;

	private Integer hostedEventCount;
	private Integer totalAttendee;

//	@QueryProjection
//	public OrganizationDTO(long id, String name, String introduce, String simpleIntroduce, String venue, String detailVenue, LocalDate since, String themeColor, String coverPath, String profilePath, Set<String> organizer) {
//		this.id = id;
//		this.name = name;
//		this.introduce = introduce;
//		this.simpleIntroduce = simpleIntroduce;
//		this.venue = venue;
//		this.detailVenue = detailVenue;
//		this.since = since;
//		this.themeColor = themeColor;
//		this.coverPath = coverPath;
//		this.profilePath = profilePath;
//		this.organizer = organizer;
//	}

	public static Set<OrganizationDTO> simpleSet(Set<Organization> organizations, boolean parseOrganizer) {
		Set<OrganizationDTO> set = new LinkedHashSet<>();
		for (Organization organization : organizations) {
			OrganizationDTO dto = OrganizationDTO.builder()
					.simple(organization)
					.build();
			if (parseOrganizer)
				dto.setOrganizer(organization.getOrganizer());
			set.add(dto);
		}
		return set;
	}

	public static Set<OrganizationDTO> simpleSet(Set<Organization> oorganizations) {
		return simpleSet(oorganizations, false);
	}

	public static Set<OrganizationDTO> simpleSetFromOrganizerSet(Set<Organizer> organizers) {
		Set<OrganizationDTO> set = new LinkedHashSet<>();
		for (Organizer organizer : organizers) {
			set.add(OrganizationDTO.builder()
					.simple(organizer.getOrganization())
					.build());
		}
		return set;
	}

	/* Custom Lombok Builder */
	public static class OrganizationDTOBuilder {
		/**
		 * @see OrganizationDTO#setOrganizer(Set)
		 */
		public OrganizationDTOBuilder organizer(Set<Organizer> organizers) {
			this.organizer = organizerSet(organizers);

			return this;
		}

		/**
		 * {@link OrganizationDTO#id} {@link OrganizationDTO#name}
		 * {@link OrganizationDTO#simpleIntroduce} {@link OrganizationDTO#themeColor}
		 * {@link OrganizationDTO#coverPath} {@link OrganizationDTO#profilePath}
		 */
		public OrganizationDTOBuilder simple(Organization organization) {
			return this.id(organization.getId())
					.name(organization.getName())
					.simpleIntroduce(organization.getSimpleIntroduce())
					.themeColor(organization.getThemeColor())
					.coverPath(organization.getCoverPath())
					.profilePath(organization.getProfilePath());
		}

		/**
		 * {@link #simple(Organization)} {@link OrganizationDTO#venue}
		 * {@link OrganizationDTO#detailVenue} {@link OrganizationDTO#since}
		 * {@link OrganizationDTO#introduce} {@link OrganizationDTO#hasSubscribed}
		 * {@link OrganizationDTO#subscribeCount}
		 * {@link OrganizationDTO#hostedEventCount}
		 * {@link OrganizationDTO#totalAttendee}
		 */
		public OrganizationDTOBuilder detail(Organization organization, UUID requestUserId) {
			this.simple(organization);

			/* set subscribe */
			Set<Subscriber> subscribers = organization.getSubscriber();
			if (requestUserId != null) {
				this.hasSubscribed(false);

				for (Subscriber subscriber : subscribers) {
					if (subscriber.getSubscriber().getUuid().equals(requestUserId)) {
						this.hasSubscribed(true);
						break;
					}
				}
			}
			this.subscribeCount(subscribers.size());

			// set event data
			Set<Event> events = organization.getEvent();
			/* repository에서 count 하는 방식으로 변경 */
			int totalAttendee = 0;
			for (Event event : events) {
				Set<EventTicket> tickets = event.getTicket();
				for (EventTicket ticket : tickets) {
					totalAttendee += ticket.getAttendee();
				}
			}
			this.totalAttendee(totalAttendee);
			this.hostedEventCount(events.size());

			// 남은 파라미터들까지 세팅
			this.venue(organization.getVenue());
			this.detailVenue(organization.getDetailVenue());
			this.since(organization.getSince());
			this.introduce(organization.getIntroduce());

			return this;
		}
	}

}
