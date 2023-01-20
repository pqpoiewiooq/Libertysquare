package net;

@SuppressWarnings("unused")
public class Notification {
	private String title;
	private String body;
	private String image;
	private String click_action;

	private Notification() {}
	
	public static final NotificationBuilder builder() {
		return new NotificationBuilder();
	}
	
	public static class NotificationBuilder {
		private Notification source = new Notification();
		
		public NotificationBuilder title(String title) {
			source.title = title;
			return this;
		}
		
		public NotificationBuilder body(String body) {
			source.body = body;
			return this;
		}
		
		public NotificationBuilder image(String image) {
			source.image = image;
			return this;
		}
		
		public NotificationBuilder click_action(String click_action) {
			source.click_action = click_action;
			return this;
		}
		
		public Notification build() {
			return this.source;
		}
	}
}
