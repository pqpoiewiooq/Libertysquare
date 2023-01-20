package net;

@SuppressWarnings("unused")
public class FirebaseMessage {
	private String to;
	private Iterable<String> registration_ids;
	
	private Notification notification;
	private FirebaseData data;
	
	private FirebaseMessage() {}
	
	public static final FirebaseMessageBuilder builder() {
		return new FirebaseMessageBuilder();
	}
	
	public static class FirebaseMessageBuilder {
		private FirebaseMessage source = new FirebaseMessage();

		public FirebaseMessageBuilder to(String to) {
			source.to = to;
			return this;
		}
		
		public FirebaseMessageBuilder registration_ids(Iterable<String> registration_ids) {
			source.registration_ids = registration_ids;
			return this;
		}
		
		public FirebaseMessageBuilder notification(Notification notification) {
			source.notification = notification;
			return this;
		}
		
		public FirebaseMessageBuilder data(FirebaseData data) {
			source.data = data;
			return this;
		}
		
		public FirebaseMessage build() {
			return this.source;
		}
	}
	
	public static final FirebaseMessageBuilder template(String title, String body, String url) {
		Notification notification = Notification.builder()
				.title(title)
				.body(body)
				.build();
		
		URLData data = URLData.of(url);
		
		return FirebaseMessage.builder()
				.notification(notification)
				.data(data);
	}
	
	public static final FirebaseMessageBuilder buyTicket(String title, long eventId) {
		return template(title, "내가 주최한 행사에 참여자가 있습니다.", "https://libertysquare.co.kr/manage/attendee/" + eventId);
	}
	
	public static final FirebaseMessageBuilder comment(String title, long postId) {
		return template(title, "내 게시글에 댓글이 달렸습니다.", "https://flattop.kr/post/" + postId);
	}
	
	public static final FirebaseMessageBuilder nestedComment(String title, long postId) {
		return template(title, "내가 쓴 댓글에 대댓글이 달렸습니다.", "https://flattop.kr/post/" + postId);
	}
}
