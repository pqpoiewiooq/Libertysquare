package me.blockhead.web.event.service;

import java.time.LocalDateTime;
import java.util.Set;

import javax.validation.Valid;
import javax.validation.constraints.Future;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import me.blockhead.common.annotation.validation.Email;
import me.blockhead.common.annotation.validation.Tel;
import me.blockhead.common.annotation.validation.URL;
import me.blockhead.common.constant.TemporalConfig;
import me.blockhead.web.event.domain.Event;
import me.blockhead.web.event.domain.EventCategory;
import me.blockhead.web.event.domain.EventGenre;
import me.blockhead.web.event.domain.EventType;
import me.blockhead.web.ticket.request.NewEventTicketRequest;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
// jdk 11 이상에서만 정상 작동해서 제외하고 controller에서 직접 확인
//@ScriptAssert(lang = "javascript", script = "_.contactEmail || _.contactTel", alias = "_", message = "이메일 혹은 전화 번호 둘 중 하나는 필수 입니다")
public class NewEventRequest {

	@NotNull
	private boolean isPublic;

	@NotNull
	private EventType type;

	@URL
	private String applyLink;

	@NotBlank
	@Size(max = Event.Limit.TITLE)
	private String title;

	@Email
	private String contactEmail;

	@Tel
	private String contactTel;

	@NotNull
	@JsonFormat(pattern = TemporalConfig.DATE_TIME_FORMAT)
	@Future
	private LocalDateTime dtStart;

	@NotNull
	@JsonFormat(pattern = TemporalConfig.DATE_TIME_FORMAT)
	@Future
	private LocalDateTime dtEnd;

	@NotNull
	@Size(max = 3)
	private Set<EventCategory> category;

	@NotNull
	private EventGenre genre;

	@Size(max = 3)
	private String[] hashtag;// = null;

	@NotNull
	private boolean isOnline;

	@NotBlank
	@Size(max = Event.Limit.VENUE)
	private String venue;

	@NotBlank
	@Size(max = Event.Limit.DETAIL_VENUE)
	private String detailVenue;

	@Size(max = Event.Limit.VENUE_DESCRIPTION)
	private String venueDescription;

	// 얘는 공백 허용
	@NotNull
	@Size(max = Event.Limit.CONTENT)
	private String content;

	@NotBlank
	@URL
	private String coverPath;

	@NotNull
	@Positive
	private long organizationId;

	@Valid
	private NewEventTicketRequest[] ticket;
}
