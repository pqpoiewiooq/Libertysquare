package me.blockhead.web.event.domain;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.GenericGenerator;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import me.blockhead.common.annotation.validation.Email;
import me.blockhead.common.annotation.validation.Tel;
import me.blockhead.common.annotation.validation.URL;
import me.blockhead.common.constant.MySQLTypeSize;
import me.blockhead.common.domain.BaseIdEntity;
import me.blockhead.web.organization.domain.Organization;
import me.blockhead.web.ticket.domain.EventTicket;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Event extends BaseIdEntity {
	@NoArgsConstructor(access = AccessLevel.PRIVATE)
	public class Limit {
		public static final int TITLE = 55;
		/**
		  * 카테고리 개수
		  */
		public static final int CATEGORY = 3;
		/**
		  * 해쉬태그 개수
		  */
		public static final int HASHTAG = 5;
		public static final int VENUE = 55;
		public static final int DETAIL_VENUE = 512;
		public static final int VENUE_DESCRIPTION = 255;
		
		public static final int CONTENT = MySQLTypeSize.MEDIUMTEXT;
	}

	
	@NotNull
	@GeneratedValue(generator = "uuid2")
	@GenericGenerator(name = "uuid2", strategy = "uuid2")
	@Column(columnDefinition = "BINARY(16)")
	private UUID uuid;
	
	@Column(nullable = false)
	private boolean isPublic;
	
	@NotNull
	@Enumerated(EnumType.STRING)
    private EventType type;
	
	@URL
	private String applyLink;
	
	@NotBlank
	@Size(max = Limit.TITLE)
	@Column(nullable = false)
	private String title;
	
	@NotBlank
	@Email
	@Column(nullable = false)
	private String contactEmail;

	@NotBlank
	@Tel
	@Column(nullable = false)
	private String contactTel;
	
	@NotNull
	private LocalDateTime dtStart;
	
	@NotNull
	@Column(nullable = false)
	private LocalDateTime dtEnd;
	
	@NotNull
	@Convert(converter = EventCategoryConverter.class)
    private Set<EventCategory> category;
	
	@NotNull
	@Enumerated(EnumType.STRING)
    private EventGenre genre;
	
	private String[] hashtag;// = null;
	
	@Column(nullable = false)
	private boolean isOnline;
	

	@NotBlank
	@Size(max = Limit.VENUE)
	@Column(nullable = false)
	private String venue;
	
	@NotBlank
	@Size(max = Limit.DETAIL_VENUE)
	@Column(nullable = false)
	private String detailVenue;
	
	@Size(max = Limit.VENUE_DESCRIPTION)
	private String venueDescription;
	
	/**
	 * allow white space.
	 */
	@NotNull
	@Column(columnDefinition = "MEDIUMTEXT")
	private String content;


	@NotBlank
	@URL
	@Column(nullable = false)
	private String coverPath;
	
	@OrderBy("id ASC")
	@OneToMany(mappedBy = "event", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY, orphanRemoval = true)
	private final Set<EventTicket> ticket = new LinkedHashSet<>();

	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
	private Organization organization;
	

	public final void addTicket(EventTicket ticket) {
		this.ticket.add(ticket);
	}
}
