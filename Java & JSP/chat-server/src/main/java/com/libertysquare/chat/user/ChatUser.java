package com.libertysquare.chat.user;

import org.springframework.data.cassandra.core.mapping.CassandraType;
import org.springframework.data.cassandra.core.mapping.CassandraType.Name;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import com.libertysquare.chat.core.Persistent;

import account.User;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CREATE TABLE user (id text PRIMARY KEY, nickname TEXT, profilePath TEXT, fcmToken TEXT, role TEXT);
 */
@Table("user")
@Getter
@Setter(AccessLevel.MODULE)
@NoArgsConstructor(access = AccessLevel.MODULE)
public class ChatUser implements Persistent<String> {
	@PrimaryKey
	private String id;
	
	@Column
	private String nickname;
	
	@Column
	private String profilePath;
	
	@Column
	private String fcmToken;
	
	@Column
	@CassandraType(type = Name.TEXT)
	private Role role;
	
	@Builder
	public ChatUser(String id, String nickname, String profilePath, String fcmToken) {
		this.id = id;
		this.nickname = nickname;
		this.profilePath = profilePath;
		this.fcmToken = fcmToken;
		this.role = Role.USER;
	}
	
	
	void update(User user) {
		String fcmToken = user.getFCMToken();
		String nickname = user.getNickname();
		String profilePath = user.getProfilePath();
		if(!(eq(this.nickname, nickname)
				&& eq(this.fcmToken, fcmToken)
				&& eq(this.profilePath, profilePath))) {
			this.nickname = nickname;
			this.profilePath = profilePath;
			this.fcmToken = fcmToken;
		}
	}
	
	private boolean eq(String lhs, String rhs) {
		if(lhs == rhs) return true;
		else if(lhs != null) return lhs.equals(rhs);
		else if(rhs != null) return rhs.equals(lhs);
		
		return false;
	}
	
	public static final ChatUser UNKMOWN = new ChatUser("unknown", "알 수 없음", "unknownPath://profilePath.img", null);
	public static final ChatUser ANONYMOUS = new ChatUser("anonymous", "익명", "https://ls2020.cafe24.com/img/anonym.png", null);
	
	@Override
	public boolean equals(Object o) {
		if (o == this) return true;
		
		if(o instanceof ChatUser) {
			return this.id.equals(((ChatUser)o).id);
		} else if(o instanceof String) {
			return this.id.equals(o);
		}
		
		return false;
	}

	@Override
	public int hashCode() {
		return this.id.hashCode();
	}
}
