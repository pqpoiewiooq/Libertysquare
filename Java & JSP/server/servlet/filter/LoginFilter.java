package servlet.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import servlet.util.ServletHelper;

public class LoginFilter implements Filter {
	public static final String ATTR_REDIRECT_AFTER_LOGIN = "redirect_after_login";
	private boolean flag;
	private String redirect;
	private String alert;

	public void init(FilterConfig config) throws ServletException {
		String flagString = config.getInitParameter("flag"); // web.xml의 param을 통해 보낸 인자값을 getInitParameter을 통해서 받습니다.
		flag = Boolean.parseBoolean(flagString);

		String tempRedirect = config.getInitParameter("redirect");
		if (!(tempRedirect == null || tempRedirect.length() == 0)) redirect = tempRedirect;

		alert = config.getInitParameter("alert");
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		if(request instanceof HttpServletRequest) {
			HttpServletRequest hsr = (HttpServletRequest) request;
			HttpSession session = hsr.getSession(true);

			boolean isLogin = session.getAttribute("user") != null;

			// flag와 로그인 여부가 동일할 경우 redirect 실행
			if((flag && isLogin) || (!flag && !isLogin)) {
				if("XMLHttpRequest".equals(hsr.getHeader("x-requested-with"))) {
					((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED);
				} else {
					ServletHelper.alert(response.getWriter(), alert, redirect == null ? "/" : redirect);
				}
			} else {
				chain.doFilter(request, response);
			}
		}
	}
	
	public static final void removeRedirectAfterLogin(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if(session != null) {
			session.removeAttribute(ATTR_REDIRECT_AFTER_LOGIN);
		}
	}

	public void destroy() {
	}
}
