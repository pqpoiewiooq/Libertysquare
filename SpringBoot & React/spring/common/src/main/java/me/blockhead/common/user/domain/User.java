package me.blockhead.common.user.domain;

import java.time.LocalDate;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.GenericGenerator;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import me.blockhead.common.annotation.validation.Password;
import me.blockhead.common.annotation.validation.PhoneNumber;
import me.blockhead.common.annotation.validation.URL;
import me.blockhead.common.domain.BaseEntity;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
public class User extends BaseEntity {
	@NoArgsConstructor(access = AccessLevel.PRIVATE)
	public class Limit {
		public static final int ID = 11;
		public static final int NAME = 14;
		public static final int NICKNAME = NAME;
		public static final int BIRTH = 6;
		public static final int GENDER = 255;
		public static final int NATIONAL = 8;
		public static final int DI = 64;
		public static final int MOBILE_CORP = 3;
		public static final int FCM_TOKEN = 200;
		public static final int STATE = 8;
		public static final int ROLE = 5;
	}

	@NotNull
	@Id
	@GeneratedValue(generator = "uuid2")
	@GenericGenerator(name = "uuid2", strategy = "uuid2")
	@Column(columnDefinition = "BINARY(16)", nullable = false)
	private UUID uuid;

	@NotBlank
	@PhoneNumber
	@Column(nullable = false)
	private String id;

	// 실제 입력은 제한이 있지만, db에 저장시에는 암호화된 비밀번호가 저장되므로, length 지정하지 않음.(text: 255)
	@Password
	@Column(nullable = false)
	private String pw;

	@NotBlank
	@Size(max = Limit.NAME)
	@Column(nullable = false)
	private String name;

	@NotBlank
	@Size(max = Limit.NICKNAME)
	@Column(nullable = false)
	private String nickname;

	@NotNull
	@Size(max = Limit.BIRTH)
	private LocalDate birth;

	@NotBlank
	@Size(max = Limit.GENDER)
	@Column(nullable = false)
	private String gender;

	@NotNull
	@Enumerated(EnumType.STRING)
	@Column(length = Limit.NATIONAL)
	private National national;

	@NotBlank
	@Size(max = Limit.DI)
	@Column(unique = true)
	private String di;

	@NotBlank
	@Size(max = Limit.MOBILE_CORP)
	@Column(nullable = false)
	private String mobileCorp;

	@NotBlank
	@URL
	@Column(nullable = false)
	private String profilePath;

	@Size(max = Limit.FCM_TOKEN)
	@Column(unique = true)
	private String fcmToken;

	@NotNull
	@Column(length = Limit.STATE)
	@Enumerated(EnumType.STRING)
	private UserState state;

	@NotNull
	@Column(length = Limit.NATIONAL)
	@Enumerated(EnumType.STRING)
	private Role role;

	public void updatePassword(String newPassword) {
		if (newPassword != null) this.pw = newPassword;
	}

	public void updateProfile(String nickname, String profilePath) {
		if (nickname != null) this.nickname = nickname;
		if (profilePath != null) this.profilePath = profilePath;
	}

	public void withdraw() {
		this.state = UserState.INACTIVE;
	}
}
