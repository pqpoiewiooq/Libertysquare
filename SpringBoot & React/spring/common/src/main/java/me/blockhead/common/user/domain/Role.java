package me.blockhead.common.user.domain;

import lombok.Getter;

@Getter
public enum Role {
	USER("USER"), ADMIN("ADMIN");

	String role;

	Role(String role) {
		this.role = role;
	}
}
