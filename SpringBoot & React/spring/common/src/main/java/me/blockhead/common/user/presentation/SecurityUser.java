package me.blockhead.common.user.presentation;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import lombok.Getter;
import lombok.Setter;
import me.blockhead.common.user.domain.User;

@Setter
@Getter
public class SecurityUser extends org.springframework.security.core.userdetails.User {
	private static final long serialVersionUID = -391042635254022360L;

	private UserDTO dto;
	
	public SecurityUser(String username, String password, Collection<? extends GrantedAuthority> authorities) {
		super(username, password, authorities);
	}

	public SecurityUser(User user) {
		super(user.getId(),user.getPw(), List.of(new SimpleGrantedAuthority(user.getRole().getRole())));

		this.dto = UserDTO.builder()
				.uuid(user.getUuid())
				.id(user.getId())
				.nickname(user.getNickname())
				.profilePath(user.getProfilePath())
				.build();
	}
}
