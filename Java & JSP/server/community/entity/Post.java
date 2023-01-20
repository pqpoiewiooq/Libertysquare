package community.entity;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import util.CryptoHelper;
import util.HtmlTagUtil;

public class Post extends BaseCommunityEntity {
	private byte[] writer;
	private Board board;
	private String title;
	private String content;
	private Boolean isQuestion;
	
	private Integer comments;
	private Integer scrap;
	private Boolean wasScraped;
	
	private Status status;
	
	public void setWriter(String uuid) {
		this.writer = CryptoHelper.hexStringToByteArray(uuid);
	}
	
	public void setWriter(byte[] uuid) {
		this.writer = uuid;
	}
	
	public void removeWriter() {
		this.writer = null;
	}
	
	public byte[] getWriter() {
		return this.writer;
	}
	
	public void setBoard(Board board) {
		this.board = board;
	}
	
	public Board getBoard() {
		return this.board;
	}
	
	public void setComments(Integer comments) {
		this.comments = comments;
	}
	
	public Integer getComments() {
		return this.comments;
	}

	public void setScrapCount(Integer scrapCount) {
		this.scrap = scrapCount;
	}
	
	public Integer getScrapCount() {
		return this.scrap;
	}
	
	public void setScraped(Boolean wasScraped) {
		this.wasScraped = wasScraped;
	}
	
	public Boolean wasScraped() {
		return this.wasScraped;
	}
	
	public void setStatus(Status status) {
		this.status = status;
	}
	
	public Status getStatus() {
		return this.status;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	public String getTitle() {
		return this.title;
	}
	
	public void setContent(String content) {
		this.content = content;
	}
	
	public String getContent() {
		return this.content;
	}
	
	public void setQuestion(Boolean isQuestion) {
		this.isQuestion = isQuestion;
	}
	
	public Boolean isQuestion() {
		return this.isQuestion;
	}
	
	public enum Status {
		ACTIVE, DELETED,
	}
	
	
	
	
//	public static class PostTimeFoarmatter {
//		private final LocalDateTime base = LocalDateTime.now();
//		//private static final DateTimeFormatter m = DateTimeFormatter.ofPattern("mm분 전");
//		private static final DateTimeFormatter h = DateTimeFormatter.ofPattern("MM/dd KK:mm");
//		private static final DateTimeFormatter y = DateTimeFormatter.ofPattern("yy/MM/dd KK:mm");
//		
//		public String format(LocalDateTime when) {
//			if(base.getYear() == when.getYear()) {
//				long diffHours = (base.until(when, ChronoUnit.HOURS) * -1);
//				if(diffHours < 1) {
//					return when.until(base, ChronoUnit.MINUTES) + "분 전";
//				}
//				return h.format(when);
//			} else {
//				return y.format(when);
//			}
//		}
//	}
//	
	public static class PostContentManager {
		private static final Pattern pattern = Pattern.compile("<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>");
		
		public static class PostContent {
			public String pure = "";
			public int images = 0;
			public String firstImageSrc = null;
		}
		
		public static PostContent optimize(String content, int max) {
			PostContent c = new PostContent();
			
			c.pure = HtmlTagUtil.limit(content, max);
			
			Matcher matcher = pattern.matcher(content);
	  		while (matcher.find()) {
	  			if(c.images == 0) c.firstImageSrc = matcher.group(1);
	  			c.images++;
	  		}
	  		
			return c;
		}
	}
}
