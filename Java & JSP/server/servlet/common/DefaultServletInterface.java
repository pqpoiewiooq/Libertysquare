package servlet.common;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import account.User;
import exception.MyServletException;
import util.CryptoHelper;
import util.JsonUtil;

public interface DefaultServletInterface {
	public static final String ATTR_USER = "user";
	
	default HttpSession getSession(HttpServletRequest request) {
		return getSession(request, true);
	}
	
	default HttpSession getSession(HttpServletRequest request, boolean throwable) {
		HttpSession session = request.getSession(false);
		if(session == null && throwable) throw MyServletException.UNAUTHORIZED;
		
		return session;
	}
	
	default User getUser(HttpServletRequest request) {
		return getUser(getSession(request));
	}
	
	default User getUser(HttpServletRequest request, boolean throwable) {
		return getUser(getSession(request, throwable), throwable);
	}
	
	default User getUser(HttpSession session) {
		return getUser(session, true);
	}
	
	default User getUser(HttpSession session, boolean throwable) {
		User user = (User) (session == null ? null : session.getAttribute(ATTR_USER));
		if(user == null && throwable) throw MyServletException.UNAUTHORIZED;
		
		return user;
	}

	default byte[] getUserUuid(HttpServletRequest request) {
		return getUserUuid(request, true);
	}
	
	default byte[] getUserUuid(HttpServletRequest request, boolean throwable) {
		User user = getUser(request, throwable);
		return user == null ? null : CryptoHelper.hexStringToByteArray(user.getUUID());
	}
	
	default void print(HttpServletResponse response, char[] charArray) throws IOException {
		response.getWriter().print(charArray);
	}
	
	default void print(HttpServletResponse response, String str) throws IOException {
		response.getWriter().print(str);
	}
	
	default void printbr(HttpServletResponse response, String str) throws IOException {
		print(response, str == null ? "<br/>" : (str + "<br/>"));
	}
	
	/**
	 * Buffer Size가 초과할 것을 대비해, {@link HttpServletResponse#setBufferSize(int)} 사용.<br>
	 * 
	 * @apiNote 다른 print* 메소드에서는 사용하지 않음. 필요할 경우 {@link #print(HttpServletResponse, String)} 에서 위 함수를 불러내도록 수정 예정
	 */
	default void printJson(HttpServletResponse response, Object obj) throws IOException {
		String json = obj instanceof String ? (String) obj : JsonUtil.toJson(obj);
		int length = json.length();
		int bufferSize = length + response.getBufferSize();
		if(bufferSize < 0) bufferSize = Integer.MAX_VALUE;
		
		//response.setContentLengthLong(length); // 이유는 몰라도 이거 쓰면 오류남
		response.setBufferSize(bufferSize);
		response.setHeader("content-type", "application/json;charset=UTF-8");
		print(response, json);
	}
}
