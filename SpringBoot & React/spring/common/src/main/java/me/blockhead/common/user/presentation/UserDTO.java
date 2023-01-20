package me.blockhead.common.user.presentation;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserDTO {
	@JsonIgnore
	private UUID uuid;
	
	private String id;
	private String nickname;
	private String profilePath;
	
}
