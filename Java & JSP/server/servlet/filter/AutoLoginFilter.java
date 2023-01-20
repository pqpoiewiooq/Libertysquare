package servlet.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import account.User;
import dao.DAOFactory;
import dao.UserDAO;
import servlet.util.ServletHelper;

public class AutoLoginFilter implements Filter {
	public void init(FilterConfig config) throws ServletException {}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		
		HttpServletRequest req = (HttpServletRequest) request;
		String uri = req.getRequestURI();
		if (!uri.contains(".")) {
			// 아래 코드로 인해 mime-type에 문제 발생.
			// web.xml에서 html과 htm에 대한 mime-type에 charset 추가.
			// 이외 필요한 경우 직접 사용 권장
			// response.setContentType("text/html; charset=utf-8");
			response.setContentType("text/html; charset=utf-8");

			HttpServletResponse res = (HttpServletResponse) response;

			HttpSession session = req.getSession();
			if (session.getAttribute("user") == null) {
				Cookie[] cookies = req.getCookies();
				Cookie cookie = ServletHelper.findCookieByName(cookies, ServletHelper.COOKIE_AUTO_LOGIN);
				Cookie tokenCookie = ServletHelper.findCookieByName(cookies, ServletHelper.COOKIE_FCM_TOKEN);
				
				if(cookie != null) {
					try (UserDAO dao = DAOFactory.create(UserDAO.class)) {
						String value = cookie.getValue();
						Cookie newCookie = ServletHelper.createLoginCookie();
						
						User user = dao.loginByCookie(value);
						
						if(user != null && dao.updateCookieAndFcmToken(user, newCookie.getValue(), tokenCookie == null ? null : tokenCookie.getValue())) {
							res.addCookie(newCookie);
							session.invalidate();
							session = req.getSession(true);
							session.setAttribute("user", user);
						}
					} catch(Exception e) {}
				}
			}
		}

		chain.doFilter(request, response);
	}

	public void destroy() {
	}
}
