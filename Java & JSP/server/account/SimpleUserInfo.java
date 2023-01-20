package account;

import java.util.LinkedHashMap;
import java.util.Map;

import servlet.restapi.ImageAPI;

public class SimpleUserInfo {
	private String nickname;
	private String profilePath;
	
	private SimpleUserInfo() {}
	
	public static final SimpleUserInfo instance(String nickname, String profilePath) {
		SimpleUserInfo info = new SimpleUserInfo();
		info.nickname = nickname;
		info.profilePath = profilePath;
		return info;
	}
	
	public static final String ANONYMOUS_NAME = "익명";
	public static final String ANONYMOUS_PROFILE_PATH = ImageAPI.WEB_URI + "img/anonym.png";
	public static final SimpleUserInfo anonymous = instance(ANONYMOUS_NAME, ANONYMOUS_PROFILE_PATH);
	public static final SimpleUserInfo deleted = instance("(삭제)", ANONYMOUS_PROFILE_PATH);
	public static final SimpleUserInfo writer = instance("익명(글쓴이)", ANONYMOUS_PROFILE_PATH);
	
	private static final Map<Integer, SimpleUserInfo> anonymousMap = new LinkedHashMap<>();
	public static final SimpleUserInfo anonymous(int count) {
		SimpleUserInfo info = anonymousMap.get(count);
		if(info == null) {
			info = instance(ANONYMOUS_NAME + count, ANONYMOUS_PROFILE_PATH);
			anonymousMap.put(count, info);
		}
		return info;
	}
	
	public String getNickname() {
		return this.nickname;
	}
	
	public String getProfilePath() {
		return this.profilePath;
	}
}
