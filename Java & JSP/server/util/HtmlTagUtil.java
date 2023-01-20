package util;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.TextNode;
import org.jsoup.safety.Cleaner;
import org.jsoup.safety.Safelist;
import org.jsoup.select.Elements;

import servlet.restapi.ImageAPI;

public class HtmlTagUtil {
	private static Safelist safeList = Safelist.basicWithImages();
	private static Cleaner cleaner = new Cleaner(safeList);
	
	private HtmlTagUtil() {}
	
	public static String clean(String html) {
		Document document = cleaner.clean(Jsoup.parse(html));
		Elements elements = document.getElementsByTag("img");
		elements.removeIf(HtmlTagUtil::imgFilter);
		return document.body().html();
	}
	
	private static boolean imgFilter(Element img) {
		String src = img.attr("src");
		
		if(src == null || (!src.startsWith(ImageAPI.SERVER_PATH) && !src.startsWith(ImageAPI.WEB_URI))) {
			img.remove();
			return true;
		}
		return false;
	}
	
	public static String limit(String html, int limit) {
		Document document = cleaner.clean(Jsoup.parse(html));
		return limit(document.body(), limit);
	}
	
	public static String limit(Element element, int limit) {
		StringBuilder builder = new StringBuilder();
		for(Node node : element.childNodes()) {
			node.unwrap();
			String text = node.toString();
			int length = text.length();
			int currentLength = builder.length();
			if((length + currentLength) > limit) {
				if(node instanceof TextNode) {
					builder.append(text.substring(0, limit - currentLength));
				}
				break;
			}
			builder.append(text);
		}
		return builder.toString();
	}
}
