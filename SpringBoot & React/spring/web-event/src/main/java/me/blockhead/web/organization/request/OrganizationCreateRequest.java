package me.blockhead.web.organization.request;

import java.util.Set;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import me.blockhead.web.organization.domain.Organization;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class OrganizationCreateRequest {
	@NotBlank
    @Size(max = Organization.Limit.NAME)
	private String name;
	
    @Size(max = Organization.Limit.SIMPLE_INTRODUCE)
	private String simpleIntroduce;
	
	private Set<String> organizer;
}