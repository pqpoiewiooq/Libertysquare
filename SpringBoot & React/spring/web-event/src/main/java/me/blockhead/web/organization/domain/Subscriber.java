package me.blockhead.web.organization.domain;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import me.blockhead.common.domain.BaseIdEntity;
import me.blockhead.common.user.domain.User;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Subscriber extends BaseIdEntity {
	@NotNull
	@JsonIgnoreProperties({ "subscribedOrganization" })
	@JoinColumn
	@ManyToOne
	private User subscriber;

	@NotNull
	@JsonIgnoreProperties({ "subscriber" })
	@JoinColumn
	@ManyToOne
	private Organization organization;
}
