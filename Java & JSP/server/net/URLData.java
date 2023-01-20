package net;

@SuppressWarnings("unused")
public class URLData implements FirebaseData {
	private String url;
	
	private URLData(String url) {
		this.url = url;
	}
	
	public static final URLData of(String url) {
		if(url == null) return null;
		return new URLData(url);
	}
}
