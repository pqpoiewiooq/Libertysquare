package data;

import java.io.Serializable;
import java.util.Arrays;

import util.JsonUtil;

public class Event implements Serializable{
	private static final long serialVersionUID = 9089640781272416356L;
	
	public static final String ZOOM_DESCRIPTION = "티켓 구매자들에게 Zoom 접속 방법이 별도로 안내됩니다.";
	
	public static final String DATE_FORMAT = "yyyy-MM-dd HH:mm";
	public static final int LIMIT_TITLE = 55;
	public static final int LIMIT_APPLY_LINK = 512;
	public static final int LIMIT_CATEGORY = 3;
	public static final int LIMIT_HASHTAG = 5;
	public static final int LIMIT_HASHTAG_STRING = 65535 / LIMIT_HASHTAG;
	public static final int LIMIT_VENUE = 55;
	public static final int LIMIT_VENUE_DETAIL = 512;
	public static final int LIMIT_VENUE_DESCRIPTION = 255;
	
	public static enum Type {LIBERTYSQUARE, OUTSIDE}
	
	public static enum Status { PUBLIC, PRIVATE, DELETED }
	
	public static enum Category {
		ECONOMY("경제"),
		PHILOSOPHY("철학"),
		CERTIFICATE("자격증"),
		POLITICS("정치"),
		STUDY("공부"),
		HOBBY("취미"),
		FINANCE("금융"),
		PARTY("파티"),
		READING("독서"),
		SELF_IMPROVEMENT("자기계발"),
		BUSINESS("비즈니스"),
		TRAVEL("여행"),
		HOME_AND_LIFESTYLE("홈&라이프스타일"),
		DISCUSSION("토론"),
		BOOK_CONCERT("북콘서트");

		private String str;
		
		Category(String str) {
			this.str = str;
		}
		
		@Override
		public String toString() {
			return str;
		}
	}
	
	public static enum Genre {
		CLASS("클래스"),
		CONFERENCE_SEMINAR("컨퍼런스 · 세미나"),
		LIFESTYLE("라이프스타일");
		
		private String str;
		
		Genre(String str) {
			this.str = str;
		}
		
		@Override
		public String toString() {
			return str;
		}
	}
	
	
	private Long eventID;
	private String uuid;
	private Type type;
	private String applyLink;
	private Status status;
	private String title;
	private String contactEmail;// = "";
	private String contactTel;// = "";
	private String dtStart;
	private String dtEnd;
	private Category[] categories;
	private Genre genre;
	private String[] hashtags;// = null;
	private Boolean isOnline;
	private String venue;
	private String venueDetail;
	private String venueDesc;// = "";
	private String content;
	private Long hostID;
	private String hostName;
	private long[] tickets;
	private String genDateTime;
	private String updateDateTime;
	
	private String coverPath;
	
	// Detail로 가져올 경우에만 있음.
	private int[] ticketPrices;// = -1;
	private Integer participants;// = -1; // 참가 인원
	
	/* Setter */
	public void setID(Long id) {
		this.eventID = id;
	}
	
	public void setUUID(String uuid) {
		this.uuid = uuid;
	}
	
	public void setType(Type type) {
		this.type = type;
	}
	
	public void setApplyLink(String url) {
		this.applyLink = url;
	}

	public void setStatus(Status status) {
		this.status = status;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	public void setContactEmail(String email) {
		this.contactEmail = email;
	}
	
	public void setContactTel(String tel) {
		this.contactTel = tel;
	}
	
	public void setDateTimeStart(String start) {
		this.dtStart = start;
	}
	
	public void setDateTimeEnd(String end) {
		this.dtEnd = end;
	}
	
	public void setCategories(Category[] categories) {
		this.categories = categories;
	}
	
	public void setGenre(Genre genre) {
		this.genre = genre;
	}
	
	public void setHashtags(String[] hashtags) {
		this.hashtags = hashtags;
	}
	
	public void setOnline(Boolean isOnline) {
		this.isOnline = isOnline;
	}
	
	public void setVenue(String venue) {
		this.venue = venue;
	}
	
	public void setDetailVenue(String detail) {
		this.venueDetail = detail;
	}
	
	public void setVenueDescription(String desc) {
		this.venueDesc = desc;
	}
	
	public void setContent(String content) {
		this.content = content;
	}
	
	public void setHost(Long hostID) {
		this.hostID = hostID;
	}
	
	public void setHostName(String hostName) {
		this.hostName = hostName;
	}
	
	public void setTickets(long[] tickets) {
		this.tickets = tickets;
	}
	
	public void setGeneratedDateTime(String dt) {
		this.genDateTime = dt;
	}
	
	public void setUpdateDateTime(String dt) {
		this.updateDateTime = dt;
	}
	
	public void setCoverPath(String path) {
		this.coverPath = path;
	}
	
	public void setTicketPrices(int[] prices) {
		this.ticketPrices = prices;
		if(this.ticketPrices != null) {
			Arrays.sort(this.ticketPrices);
		}
	}
	
	public void setParticipants(Integer participants) {
		this.participants = participants;
	}
	
	/* Getter */
	public Long getID() {
		return this.eventID;
	}
	
	public String getUUID() {
		return this.uuid;
	}
	
	public Type getType() {
		return this.type;
	}

	public String getApplyLink() {
		return this.applyLink;
	}
	
	public Status getStatus() {
		return this.status;
	}
	
	public String getTitle() {
		return this.title;
	}
	
	public String getContactEmail() {
		return this.contactEmail;
	}
	
	public String getContactTel() {
		return this.contactTel;
	}
	
	public String getDateTimeStart() {
		return this.dtStart;
	}
	
	public String getDateTimeEnd() {
		return this.dtEnd;
	}
	
	public String getCoverPath() {
		return this.coverPath;
	}
	
	public Category[] getCategories() {
		return this.categories;	
	}
	
	public Genre getGenre() {
		return this.genre;
	}
	
	public String[] getHashtags() {
		return this.hashtags;
	}
	
	public String getHashtagsJson() {
		 return JsonUtil.toJson(getHashtags());
	}
	
	public Boolean isOnline() {
		return this.isOnline;
	}
	
	public String getVenue() {
		return this.venue;
	}
	
	public String getDetailVenue() {
		return this.venueDetail;
	}
	
	public String getVenueDescription() {
		return this.venueDesc;
	}
	
	public String getContent() {
		return this.content;
	}
	
	public Long getHost() {
		return this.hostID;
	}
	
	public String getHostName() {
		return this.hostName;
	}
	
	public long[] getTickets() {
		return this.tickets;
	}
	
	public String getGeneratedDateTime() {
		return this.genDateTime;
	}
	
	public String getUpdateDateTime() {
		return this.updateDateTime;
	}
	
	public int[] getTicketPrices() {
		return this.ticketPrices;
	}
	
	public Integer getHighestPrice() {
		if(this.ticketPrices == null) return 0;
		
		return this.ticketPrices[this.ticketPrices.length - 1];
	}
	
	public String getPricesString() {
		if(this.ticketPrices == null) return "";
		Integer min = ticketPrices[0];
		Integer max = getHighestPrice();
		String _min = min == 0 ? "무료" : ("₩" + min).replaceAll("\\B(?=(\\d{3})+(?!\\d))", ",");
		
		if(min == max) return _min;
		else {
			String _max = ("₩" + max).replaceAll("\\B(?=(\\d{3})+(?!\\d))", ",");
			
			return _min + " ~ " + _max;
		}
	}
	
	public String getHighestPriceString() {
		String str = getHighestPrice() + "";
		return "₩" + str.replaceAll("\\B(?=(\\d{3})+(?!\\d))", ",");
	}
	
	public Integer getParticipants() {
		return this.participants;
	}
	
	public boolean isZoom() {
		return isOnline() && "zoom".equals(getVenue());
	}
	
	public void changeWebInfo() {
		if(isOnline()) {
			if(isZoom()) {
				setDetailVenue("Zoom");
				setVenueDescription(ZOOM_DESCRIPTION);
			}
			setVenue("온라인 플랫폼");
		}
	}
}