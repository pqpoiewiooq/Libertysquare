package me.blockhead.common.user.service;

import java.io.File;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Consumer;

import javax.transaction.Transactional;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import me.blockhead.common.exception.DataNotFoundException;
import me.blockhead.common.exception.JWTException;
import me.blockhead.common.jwt.JWTProvider;
import me.blockhead.common.jwt.JWToken;
import me.blockhead.common.user.domain.Role;
import me.blockhead.common.user.domain.User;
import me.blockhead.common.user.domain.UserRepository;
import me.blockhead.common.user.domain.UserState;
import me.blockhead.common.user.presentation.SecurityUser;
import me.blockhead.common.user.presentation.UserDTO;
import me.blockhead.common.user.request.SignUpRequest;
import me.blockhead.common.util.ImageUtil;
import me.blockhead.common.util.RedisUtil;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService implements UserDetailsService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JWTProvider jwtTokenProvider;
	private final AuthenticationManagerBuilder authenticationManagerBuilder;
	private final RedisUtil redisUtil;
	private final ImageUtil imageUtil;

	public void singUp(SignUpRequest request) {
		User newUser = User.builder()
				.id(request.getId())
				.pw(passwordEncoder.encode(request.getPw()))
				.name(request.getName())
				.nickname(request.getName())
				.birth(request.getBirth())
				.gender(request.getGender())
				.national(request.getNational())
				.di(request.getDi())
				.mobileCorp(request.getMobileCorp())
				.profilePath(imageUtil.getDefaultUserProfile())
				.fcmToken(request.getFcmToken())
				.role(Role.USER)
				.state(UserState.ACTIVE)
				.build();
		userRepository.save(newUser);
	}

	public boolean exists(String id) {
		return userRepository.existsByIdAndState(id, UserState.ACTIVE);
	}

	public boolean exists(String id, String di) {
		return userRepository.existsMember(id, di, UserState.ACTIVE);
	}

	public JWToken login(String id, String pw) {
		UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(id, pw);
		// authenticate ????????? loadUserByUsername ??? ?????????
		Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
		
		JWToken token = jwtTokenProvider.generateToken(authentication);
		
		redisUtil.setRefreshToken(authentication, token);

		return token;
	}

	/**
	 * ?????? ????????? ?????? + Redis??? ?????? token ????????? ?????? -> ?????????
	 * @param reissue : refreshToken ??????
	 */
	public JWToken reissue(String refreshToken) {
		if (!jwtTokenProvider.validateToken(refreshToken)) {
			throw new JWTException("Refresh Token ????????? ???????????? ????????????.");
		}

		Authentication authentication = jwtTokenProvider.getAuthentication(refreshToken);
		String reissue = redisUtil.getRefreshToken(authentication);

		if (reissue == null) {
			throw new JWTException("????????? ???????????????.");
		}
		if (!reissue.equals(refreshToken)) {
			throw new JWTException("Refresh Token ????????? ???????????? ????????????.");
		}

		JWToken token = jwtTokenProvider.generateToken(authentication);
		redisUtil.setRefreshToken(authentication, token);

		return token;
	}

	public void logout(String accessToken) {
		if (!jwtTokenProvider.validateToken(accessToken)) {
			throw new JWTException("????????? ???????????????.");
		}

		Authentication authentication = jwtTokenProvider.getAuthentication(accessToken);
		redisUtil.deleteRefreshToken(authentication);

		long expiration = jwtTokenProvider.getExpiration(accessToken);
		redisUtil.setBlackList(accessToken, expiration);
	}
	
	private Authentication generateAuthentication(User entity) {
		SecurityUser principal = new SecurityUser(entity);
		return new UsernamePasswordAuthenticationToken(principal, "", principal.getAuthorities());
	}

	private JWToken update(String accessToken, Consumer<User> action) {
		Authentication authentication = jwtTokenProvider.getAuthentication(accessToken);
		SecurityUser securityUser = (SecurityUser) authentication.getPrincipal();
		UserDTO dto = securityUser.getDto();
		
		User user = findById(dto.getUuid());
		action.accept(user);
		
		Authentication newAuthentication = generateAuthentication(user);
		JWToken token = jwtTokenProvider.generateToken(newAuthentication);
		redisUtil.setRefreshToken(newAuthentication, token);// refreshToken ??????
		redisUtil.setBlackList(accessToken, jwtTokenProvider.getExpiration(accessToken));// ?????? ?????? ??????????????? ??????
	
		return token;
	}
	
	public JWToken updateProfile(String accessToken, String profilePath, String nickname) {
		final String updatedProfilePath;
		if(profilePath == null) {
			updatedProfilePath = null;
		} else {
			updatedProfilePath = imageUtil.move(new File(imageUtil.getRealPath(profilePath)), imageUtil.getRealPath(ImageUtil.USER_ROOT));
		}
		
		return update(accessToken, user -> {
			user.updateProfile(nickname, updatedProfilePath);
		});
	}

	public JWToken updatePassword(String accessToken, String curPassword, String newPassword) {
		if(curPassword.equals(newPassword)) {
			throw new IllegalArgumentException("?????? ?????? ?????? ?????????????????????.");
		}
		
		return update(accessToken, user -> {
			if (!passwordEncoder.matches(curPassword, user.getPw())) {
				throw new IllegalArgumentException("?????? ??????????????? ????????????.");
			}

			user.updatePassword(passwordEncoder.encode(newPassword));
		});
	}

	public void withdraw(UUID uuid) {
		findById(uuid).withdraw();
	}
	
	/**
	 * {@link UserState#ACTIVE} ??? uuid??? ?????? ?????? ??????
	 * @throws DataNotFoundException ????????? ?????? ?????? ??????
	 */
	public User findById(UUID uuid) {
		return findById(uuid, false);
	}
	
	private User findById(UUID uuid, boolean nullable) {
		return findById(uuid, UserState.ACTIVE, nullable);
	}
	
	private User findById(UUID uuid, UserState state, boolean nullable) {
		Optional<User> entity = (state == null ? userRepository.findById(uuid) : userRepository.findFirstByUuidAndState(uuid, state));
		
		if(!nullable && entity.isEmpty()) {
			throw new DataNotFoundException("?????? ????????? ?????? ??????????????????.");
		}
		
		return entity.get();
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User findUser = userRepository.findFirstByIdAndState(username, UserState.ACTIVE)
				.orElseThrow(() -> new DataNotFoundException("?????? ????????? ?????? ??????????????????."));

		return new SecurityUser(findUser);
	}
}
