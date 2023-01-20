package me.blockhead.web.organization.request;

import java.time.LocalDate;
import java.util.Set;

import javax.validation.constraints.PositiveOrZero;
import javax.validation.constraints.Size;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import me.blockhead.common.annotation.validation.HexColor;
import me.blockhead.common.annotation.validation.URL;
import me.blockhead.web.organization.domain.Organization;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class OrganizationUpdateRequest {
	@PositiveOrZero
	private long id;

	@Size(max = Organization.Limit.NAME)
	private String name;

	@Size(max = Organization.Limit.INTRODUCE)
	private String introduce;

	@Size(max = Organization.Limit.SIMPLE_INTRODUCE)
	private String simpleIntroduce;

	@URL
	private String coverPath;

	@URL
	private String profilePath;
	
	@Size(max = Organization.Limit.VENUE)
	private String venue;

	@Size(max = Organization.Limit.DETAIL_VENUE)
	private String detailVenue;

	private LocalDate since;

	@HexColor
	private String themeColor;

	private Set<String> organizer;
}