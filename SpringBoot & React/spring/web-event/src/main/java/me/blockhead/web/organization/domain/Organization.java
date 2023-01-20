package me.blockhead.web.organization.domain;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import me.blockhead.common.annotation.validation.HexColor;
import me.blockhead.common.annotation.validation.URL;
import me.blockhead.common.constant.MySQLTypeSize;
import me.blockhead.common.domain.BaseIdEntity;
import me.blockhead.common.user.domain.User;
import me.blockhead.web.event.domain.Event;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Organization extends BaseIdEntity {
	@NoArgsConstructor(access = AccessLevel.PRIVATE)
	public class Limit {
		public static final int NAME = 40;
		public static final int INTRODUCE = MySQLTypeSize.TEXT;
		public static final int SIMPLE_INTRODUCE = MySQLTypeSize.TINYTEXT;
		public static final int VENUE = 55;
		public static final int DETAIL_VENUE = 512;
		public static final int THEME_COLOR = 7;
		public static final int STATE = 8;
	}

	@NotBlank
	@Size(max = Limit.NAME)
	@Column(nullable = false, unique = true)
	private String name;

	@Size(max = Limit.INTRODUCE)
	private String introduce;

	@Size(max = Limit.SIMPLE_INTRODUCE)
	private String simpleIntroduce;

	@NotBlank
	@Size(max = Limit.VENUE)
	@Column(nullable = false)
	private String venue;

	@NotBlank
	@Size(max = Limit.DETAIL_VENUE)
	@Column(nullable = false)
	private String detailVenue;

	@NotNull
	@Column(nullable = false)
	private LocalDate since;

	@NotBlank
	@HexColor
	@Column(nullable = false)
	private String themeColor;// ^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$

	@NotBlank
	@URL
	@Column(nullable = false)
	private String coverPath;

	@NotBlank
	@URL
	@Column(nullable = false)
	private String profilePath;

	@NotNull
	@Enumerated(EnumType.STRING)
	@Column(length = Limit.STATE)
	private OrganizationState state;

	@JsonIgnoreProperties({ "organization" })
	@OneToMany(mappedBy = "organization", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY, orphanRemoval = true)
	private final Set<Organizer> organizer = new LinkedHashSet<>();

	@JsonIgnoreProperties({ "organization" })
	@OneToMany(mappedBy = "organization", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY, orphanRemoval = true)
	private final Set<Event> event = new LinkedHashSet<>();

	@JsonIgnoreProperties({ "organization" })
	@OneToMany(mappedBy = "organization", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY, orphanRemoval = true)
	private final Set<Subscriber> subscriber = new LinkedHashSet<>();

	public void delete() {
		this.state = OrganizationState.INACTIVE;
	}

	public void updateName(String name) {
		if (name != null) {
			this.name = name;
		}
	}

	public void updateIntroduce(String introduce) {
		if (introduce != null) {
			this.introduce = introduce;
		}
	}

	public void updateSimpleIntroduce(String simpleIntroduce) {
		if (simpleIntroduce != null) {
			this.simpleIntroduce = simpleIntroduce;
		}
	}

	public void updateVenue(String venue) {
		if (venue != null) {
			this.venue = venue;
		}
	}

	public void updateDetailVenue(String detailVenue) {
		if (detailVenue != null) {
			this.detailVenue = detailVenue;
		}
	}

	public void updateSince(LocalDate since) {
		if (since != null) {
			this.since = since;
		}
	}

	public void updateThemeColor(String themeColor) {
		if (themeColor != null) {
			this.themeColor = themeColor;
		}
	}

	public void updateCoverPath(String coverPath) {
		if (coverPath != null) {
			this.coverPath = coverPath;
		}
	}

	public void updateProfilePath(String profilePath) {
		if (profilePath != null) {
			this.profilePath = profilePath;
		}
	}

	public void updateOrganizer(Set<User> users, OrganizerRepository organizerRepository) {
		if (users == null) return;

		List<Organizer> search = new ArrayList<>(this.organizer.stream().toList());
		Set<Organizer> add = new LinkedHashSet<Organizer>();

		for (User user : users) {
			if (!search.removeIf(s -> s.getUser().getId().equals(user.getId()))) {
				Organizer organizer = Organizer.builder()
						.user(user)
						.organization(this)
						.build();
				add.add(organizer);
			}
		}

		for (Organizer removeOrganizer : search) {
			this.organizer.remove(removeOrganizer);
		}
		organizerRepository.deleteAll(search);

		for (Organizer addOrganizer : add) {
			this.organizer.add(addOrganizer);
		}
		organizerRepository.saveAll(add);
	}

//	public Organizer findOrganizer(UUID organizerId) {
//		if(organizerId != null) {
//			for(Organizer organizer : this.organizer) {
//				if(organizer.getMember().getId().equals(organizerId)) {
//					return organizer;
//				}
//			}
//		}
//		return null;
//	}

//	@OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//	@ElementCollection(targetClass = User.class)
//	private Set<User> subscriber;
}
