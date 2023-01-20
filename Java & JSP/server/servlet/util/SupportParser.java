package servlet.util;

import java.util.Arrays;

import javax.servlet.http.HttpServletRequest;

import data.Account;
import data.BusinessType;
import data.Support;
import data.SupportCategory;
import exception.MyServletException;
import servlet.common.ServletStatus;
import servlet.restapi.ImageAPI;
import util.JsonUtil;

public class SupportParser extends MyParser {
	private boolean isPatchMode;
	
	public SupportParser(HttpServletRequest request, boolean isPatchMode) {
		super(request);
		this.isPatchMode = isPatchMode;
	}
	
	public Support parse() throws MyServletException {
		Support support = new Support();
		
		/*** 공개 여부 ***/
		boolean isPublic = getBoolean("public_flag", null);
		support.setPublic(isPublic);
		
		/*** 신청 링크 ***/
		String link = get("link", Support.LIMIT_APPLY_LINK, true);
		support.setLink(link);
		
		/*** 제목 ***/
		String title = get("title", Support.LIMIT_TITLE, false);
		support.setTitle(title);
		
		/*** 연락처 ***/
		String email = getMatches("email", "^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$", true);
		String tel = getMatches("tel", "^0([2-6][1-5]?[2-9]\\d{2,3}|10\\d{4})\\d{4}$", true);

		if(email == null && tel == null) {
			throw new MyServletException(ServletStatus.NOT_FOUND_PARAMETER, "contact");
		}
		
		support.setContactEmail(email);
		support.setContactTel(tel);
		
		Account account = getTo("account", (str) -> JsonUtil.fromJson(str, Account.class), true);
		support.setAccount(account);
		
		/*** patch mode flag ***/
		if(isPatchMode) {
			/*** 행사 아이디 ***/
			int id = getInt("id");
			support.setID(id);
		} else {
			/*** 카테고리 ***/
			SupportCategory[] categories = getArray("category", SupportCategory::valueOf, SupportCategory[]::new, Support.LIMIT_CATEGORY);
			support.setCategories(categories);
			
			/*** 행사 유형(타입) ***/
			BusinessType type = getTo("businessType", BusinessType::valueOf);
			support.setBusinessType(type);
			
			if(link == null && account == null) {
				throw new MyServletException(ServletStatus.NOT_FOUND_PARAMETER, "support method");
			}
	
			/*** 해시태그 ***/
			String[] hashtags = getValues("hashtag", true);
			
			if(hashtags != null) {
				int hashtagLength = hashtags.length;
				if(hashtagLength > Support.LIMIT_HASHTAG) throw new MyServletException("hashtag too many : " + hashtagLength + " > " + Support.LIMIT_HASHTAG);
				String invalidHashtag = Arrays.stream(hashtags).filter(hashtag -> hashtag.length() > Support.LIMIT_HASHTAG_STRING).findAny().orElse(null);
				if(invalidHashtag != null) throw new MyServletException("hashtag too long -> (" + invalidHashtag + ") : " + invalidHashtag.length() + " > " + Support.LIMIT_HASHTAG_STRING);
				support.setHashtags(hashtags);
			}
		}
		
		/*** 행사 내용 ***/
		support.setContent(getHTML("content"));
		
		return support;
	}
	
	public String parseCoverImage() throws MyServletException {
		String cover = get("cover", isPatchMode);
		if(cover != null && ImageAPI.isTemp(cover)) {
			return cover;
		} else if(isPatchMode && cover == null) {
			return null;
		}
		throw new MyServletException(ServletStatus.INVALID_PARAMETER, "cover=" + cover);
	}
}
