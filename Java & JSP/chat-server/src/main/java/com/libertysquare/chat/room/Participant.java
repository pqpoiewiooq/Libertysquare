package com.libertysquare.chat.room;

import org.springframework.data.annotation.Transient;
import org.springframework.data.cassandra.core.mapping.CassandraType;
import org.springframework.data.cassandra.core.mapping.CassandraType.Name;
import org.springframework.data.cassandra.core.mapping.Element;
import org.springframework.data.cassandra.core.mapping.UserDefinedType;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.libertysquare.chat.user.ChatUser;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <p>
 * CREATE TYPE participant (id TEXT, profileType INT, nickname TEXT, profilePath TEXT, lastViewTime BIGINT, isOnAlarm BOOLEAN);
 * </p>
 */
@Getter
@Setter(AccessLevel.MODULE)
@UserDefinedType(Participant.UDT_NAME)
@EqualsAndHashCode(of = "id")
@Builder
@AllArgsConstructor(access = AccessLevel.MODULE)// Builder를 위함
@NoArgsConstructor(access = AccessLevel.MODULE)// Cassandra에서 Mapping시, 자꾸 principal도 찾으려고 해서 추가
public class Participant {
	static final String UDT_NAME = "participant";
	
	@Element(0)
	private String id;
	
	@Element(1)
	@CassandraType(type = Name.INT)
	@JsonIgnore
	private ProfileType profileType;
	
	@Element(2)
	private String nickname;
	
	@Element(3)
	private String profilePath;
	
	@Setter
	@Element(4)
	private long lastViewTime;

	@Element(5)
	@Builder.Default
	@JsonIgnore
	private boolean isOnAlarm = true;
	
	@Transient
	@JsonIgnore
	private ChatUser principal;
	
	/**
	 * Override getter generated for {@link Getter}<br>
	 * <br>
	 * if can synchronize then called {@link ChatUser#getNickname()}
	 * else return {@link #nickname}
	 */
	public String getNickname() {
		if(canSynchronize()) return principal.getNickname();
		else if(profileType == ProfileType.ANONYMOUS) return ChatUser.ANONYMOUS.getNickname();
		return this.nickname;
	}
	
	/**
	 * Override getter generated for {@link Getter}<br>
	 * <br>
	 * if can synchronize then called {@link ChatUser#getProfilePath()}
	 * else return {@link #profilePath}
	 */
	public String getProfilePath() {
		if(canSynchronize()) return principal.getProfilePath();
		else if(profileType == ProfileType.ANONYMOUS) return ChatUser.ANONYMOUS.getProfilePath();
		return this.nickname;
	}
	
	/**
	 * {@link ProfileType#SYNCHRONIZE} - {@link #principal}과 연동<br>
	 * {@link ProfileType#CUSTOM} - 아무 작업도 하지 않음<br>
	 * {@link ProfileType#ANONYMOUS} - 익명과 연동
	 * 
	 */
	void synchronizeProfile() {
		if(canSynchronize()) {
			this.nickname = principal.getNickname();
			this.profilePath = principal.getProfilePath();
		} else if(profileType == ProfileType.ANONYMOUS) {
			this.nickname = ChatUser.ANONYMOUS.getNickname();
			this.profilePath = ChatUser.ANONYMOUS.getProfilePath();
		}
	}
	
	private boolean canSynchronize() {
		return profileType == ProfileType.SYNCHRONIZE && principal != null;
	}
	
	public void toggleAlarm() {
		this.isOnAlarm = !this.isOnAlarm;
	}
}
