package servlet.util;

import java.util.Arrays;

import javax.servlet.http.HttpServletRequest;

import data.Event;
import data.Ticket;
import exception.MyServletException;
import servlet.common.ServletStatus;
import servlet.restapi.ImageAPI;
import util.DateUtil;

public class EventParser extends MyParser {
	private boolean isPatchMode;
	
	public EventParser(HttpServletRequest request, boolean isPatchMode) {
		super(request);
		this.isPatchMode = isPatchMode;
	}

	public Event parseEvent() throws MyServletException {
		Event event = new Event();
		
		/*** 공개 여부 ***/
		boolean isPublic = getBoolean("public_flag", null);
		event.setStatus(isPublic ? Event.Status.PUBLIC : Event.Status.PRIVATE);
		
		/*** 신청 링크 ***/
		String applyLink = get("apply_link", Event.LIMIT_APPLY_LINK, true);
		event.setApplyLink(applyLink);
		
		/*** 제목 ***/
		String title = get("title", Event.LIMIT_TITLE, false);
		event.setTitle(title);
		
		/*** 연락처 ***/
		String email = getMatches("email", "^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$", true);
		String tel = getMatches("tel", "^0([2-6][1-5]?[2-9]\\d{2,3}|10\\d{4})\\d{4}$", true);
		
		if(email == null && tel == null) {
			throw new MyServletException(ServletStatus.NOT_FOUND_PARAMETER, "contact");
		}
		
		event.setContactEmail(email);
		event.setContactTel(tel);
        
		/*** 행사 날짜 ***/
		String datetime_start = get("datetime_start");
		if(!DateUtil.evaluateDate(datetime_start)) {
			throw new MyServletException("evaluate failed : " + datetime_start + " -> " + Event.DATE_FORMAT);
		}
		event.setDateTimeStart(datetime_start);
		
		String datetime_end = get("datetime_end");
		if(!DateUtil.evaluateDate(datetime_end)) {
			throw new MyServletException("evaluate failed : " + datetime_end + " -> " + Event.DATE_FORMAT);
		}
		event.setDateTimeEnd(datetime_end);
		
		/*** patch mode flag ***/
		if(isPatchMode) {
			/*** 행사 아이디 ***/
			long eventID = getLong("eventID");
			event.setID(eventID);
		} else {
			/*** 행사 유형(타입) ***/
			Event.Type type = getTo("type", Event.Type::valueOf);
			event.setType(type);
			
			/*** 카테고리 ***/
			Event.Category[] categories = getArray("category", Event.Category::valueOf, Event.Category[]::new, Event.LIMIT_CATEGORY);
			event.setCategories(categories);
			
			/*** 유형 ***/
			Event.Genre genre = getTo("genre", Event.Genre::valueOf);
			event.setGenre(genre);
			

			/*** 해시태그 ***/
			String[] hashtags = getValues("hashtag", true);
			
			if(hashtags != null) {
				int hashtagLength = hashtags.length;
				if(hashtagLength > Event.LIMIT_HASHTAG) throw new MyServletException("hashtag too many : " + hashtagLength + " > " + Event.LIMIT_HASHTAG);
				String invalidHashtag = Arrays.stream(hashtags).filter(hashtag -> hashtag.length() > Event.LIMIT_HASHTAG_STRING).findAny().orElse(null);
				if(invalidHashtag != null) throw new MyServletException("hashtag too long -> (" + invalidHashtag + ") : " + invalidHashtag.length() + " > " + Event.LIMIT_HASHTAG_STRING);
				event.setHashtags(hashtags);
			}
		}
		
		/*** 온라인 여부 ***/
		boolean isOnline = getBoolean("online_flag", null);
		event.setOnline(isOnline);
		
		/*** 장소 ***/
		String venue = get("venue", Event.LIMIT_VENUE);
		String venueDetail = get("venue_detail", Event.LIMIT_VENUE_DETAIL);
		String venueDesc = get("venue_desc", Event.LIMIT_VENUE_DESCRIPTION, true);
		
		if(isOnline && !("zoom".equals(venue) || "custom".equals(venue))) {
			throw new MyServletException(ServletStatus.INVALID_PARAMETER, "venue");
		}
		
		event.setVenue(venue);
		event.setDetailVenue(venueDetail);
		event.setVenueDescription(venueDesc);
		
		/*** 행사 내용 ***/
		event.setContent(getHTML("content"));
		
		return event;
	}
	
	public Ticket[] parseTickets() throws MyServletException {
		Ticket[] tickets = getArray("ticket", Ticket::fromJson, Ticket[]::new);
		for(Ticket ticket : tickets) {
			if(ticket.isHide() == null) {
				ticket.setHide(false);
				if(DateUtil.evaluateDate(ticket.getStartDate())) throw new MyServletException(ServletStatus.INVALID_PARAMETER, "startDate: " + ticket.getStartDate());
				if(DateUtil.evaluateDate(ticket.getEndDate())) throw new MyServletException(ServletStatus.INVALID_PARAMETER, "endDate: " + ticket.getEndDate());
				if(DateUtil.evaluateDate(ticket.getRefundDeadline())) throw new MyServletException(ServletStatus.INVALID_PARAMETER, "refundDeadline: " + ticket.getRefundDeadline());
				if(DateUtil.isAfter(ticket.getRefundDeadline(), ticket.getEndDate())) throw new MyServletException(ServletStatus.INVALID_PARAMETER, "refundDeadline is after endDate");
			}
		}
		return tickets;
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
