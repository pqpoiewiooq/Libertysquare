package servlet.util;

import java.io.PrintWriter;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import util.CryptoHelper;

public class ServletHelper {
	
	//public static String getLoginCookie
	
	public static void alert(PrintWriter writer, String msg, String href) {
		writer.println("<script>");
		if (msg != null && msg.length() != 0) {
			writer.println("alert('" + msg + "');");
		}
		//writer.println("history.pushState(null, null, '" + href + "');");
		writer.println("location.replace('" + href + "');");
		writer.println("</script>");
	}
	
	public static String createAlertAndPostScript(String msg, String href, Map<String, String> attrs) {
		StringBuilder scriptBuilder =new StringBuilder("");
		
		scriptBuilder.append("<script>")
			.append("window.onload = function() {")
				.append("alert('").append(msg).append("');")
				.append("var form = document.createElement('form');")
				.append("form.action = '").append(href).append("';")
				.append("form.method = 'POST';");
		
		attrs.forEach((key, value) -> {
			String name = "_" + key + "_";
			
			scriptBuilder
				.append("var ").append(name).append(" = document.createElement('input');")
				.append(name).append(".setAttribute('type', 'hidden');")
				.append(name).append(".setAttribute('name', '").append(key).append("');")
				.append(name).append(".setAttribute('value', '").append(value).append("');")
				.append("form.appendChild(").append(name).append(");");
		});
		
		scriptBuilder.append("document.body.appendChild(form);")
					.append("form.submit();")
				.append("}")
			.append("</script>");
		
		return scriptBuilder.toString();
	}

	public static void alertPost(PrintWriter writer, String msg, String href, Map<String, String> attrs) {
		writer.print(createAlertAndPostScript(msg, href, attrs));
	}
	
	public static String getPathParameter(HttpServletRequest request, int when) throws NullPointerException, ArrayIndexOutOfBoundsException {
		String uri = (String) request.getAttribute("uri");
		if(uri == null) uri = request.getRequestURI();
		String[] pathArray = uri.split("/");
		String pathParam = pathArray[when];
		return pathParam;
	}
	
	public static int getPathInt(HttpServletRequest request, int when) throws NumberFormatException, NullPointerException, ArrayIndexOutOfBoundsException {
		return Integer.parseInt(getPathParameter(request, when));
	}
	
	public static long getPathLong(HttpServletRequest request, int when) throws NumberFormatException, NullPointerException, ArrayIndexOutOfBoundsException {
		return Long.parseLong(getPathParameter(request, when));
	}
	
	public static final String COOKIE_AUTO_LOGIN = "aul";
	public static final String COOKIE_FCM_TOKEN = "ft";
	
	public static Cookie createLoginCookie() {
		String code = CryptoHelper.randomUUID();
		final int expiry = 60 * 60 * 24 * 30;// 30일 
		Cookie cookie = new Cookie(COOKIE_AUTO_LOGIN, code);
		cookie.setMaxAge(expiry);
		cookie.setPath("/");
		cookie.setSecure(true);
		cookie.setDomain("libertysquare.co.kr");
		cookie.setHttpOnly(true);
		return cookie;
	}
	
	public static Cookie findCookieByName(Cookie[] cookies, String findName) {
		if(cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals(findName)) {
					return cookie;
				}
			}
		}
		return null;
	}
}
