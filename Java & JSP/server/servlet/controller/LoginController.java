package servlet.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import account.User;
import dao.DAOFactory;
import dao.UserDAO;
import servlet.common.MyHttpServlet;
import servlet.filter.LoginFilter;
import servlet.util.RequestParser;
import servlet.util.ServletHelper;

public class LoginController extends MyHttpServlet {
	private static final long serialVersionUID = 9106192964670707924L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		this.doPost(request, response);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		switch (request.getRequestURI()) {
		case "/login":
			doLogin(request, response);
			break;
		case "/logout":
			doLogout(request, response);
			break;
		default:
		}
	}

	private void doLogin(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String id = RequestParser.get(request, "id");
		String pwd = RequestParser.getRSA(request, "password");
		Cookie fcmTokenCookie = ServletHelper.findCookieByName(request.getCookies(), ServletHelper.COOKIE_FCM_TOKEN);

		Map<String, String> attrs = new HashMap<>();
		attrs.put("id", id);

		PrintWriter out = response.getWriter();

		try (UserDAO dao = DAOFactory.create(UserDAO.class)) {
			if (dao == null) {
				ServletHelper.alertPost(out, "DB서버 연결에 실패하였습니다.\\n잠시 후 다시 시도해주세요.", "/signin", attrs);
				return;
			} else if (!dao.hasUser(id)) {
				ServletHelper.alert(out, "존재하지 않는 ID입니다.", "/sign");
				return;
			}

			User user = dao.login(id, pwd);
			if (user == null) {
				ServletHelper.alertPost(out, "비밀번호가 올바르지 않습니다.", "/signin", attrs);
				return;
			}

			Cookie cookie = ServletHelper.createLoginCookie();
			if (!dao.updateCookieAndFcmToken(user, cookie.getValue(), fcmTokenCookie == null ? null : fcmTokenCookie.getValue())) {
				ServletHelper.alertPost(out, "로그인에 실패하였습니다.\n잠시 후 다시 시도해주세요.\n지속될 경우 고객센터로 문의 바랍니다.", "/signin", attrs);
				return;
			}
			response.addCookie(cookie);

			HttpSession session = request.getSession(true);
			String redirect = null;
			if (session == null) {
				session = request.getSession(true);
			} else {
				redirect = (String) session.getAttribute(LoginFilter.ATTR_REDIRECT_AFTER_LOGIN);
				session.invalidate();
				session = request.getSession(true);
			}

			// session.setMaxInactiveInterval(3600); // n초 유지 (default : 30분). web.xml의
			// session-config에서 설정 가능.
			session.setAttribute("user", user);

			response.sendRedirect(redirect == null ? "/" : redirect);

		} catch (Exception e) {
			throw e;
		}
	}

	private void doLogout(HttpServletRequest request, HttpServletResponse response) throws IOException {
		// cookie 삭제
		Cookie[] cookies = request.getCookies();
		Cookie cookie = ServletHelper.findCookieByName(cookies, ServletHelper.COOKIE_AUTO_LOGIN);
		if (cookie != null) {
			cookie.setMaxAge(0);
			cookie.setValue("THISISLIBERTYSQUARECOOKIE");
			cookie.setPath("/");
			response.addCookie(cookie);
		}

		HttpSession session = request.getSession(false);
		if (session != null) {
			User user = getUser(session, false);

			session.invalidate();

			if (user != null) {
				UserDAO dao = DAOFactory.create(UserDAO.class);
				if (dao == null || !dao.updateCookieAndFcmToken(user, "_invalid_cookie_", null)) {
					ServletHelper.alert(response.getWriter(), "알 수 없는 오류가 발생하였습니다.", "/");
					return;
				}
			}
		}

		response.sendRedirect("/");
	}
}