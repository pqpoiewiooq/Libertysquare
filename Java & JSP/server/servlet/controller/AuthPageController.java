package servlet.controller;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import servlet.common.NoCookieServlet;
import servlet.filter.LoginFilter;

public class AuthPageController extends NoCookieServlet {
	private static final long serialVersionUID = 7210748711755245155L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String uri = request.getRequestURI();
		RequestDispatcher dispatcher = request.getRequestDispatcher("/WEB-INF/view/auth/" + uri + ".jsp");

		String referer = request.getHeader("Referer");
		String hostName = request.getScheme() + "://" + request.getServerName();
		if (referer != null && referer.startsWith(hostName) && !referer.contains("/sign") && !referer.contains("/api") && !referer.contains("/password") && !referer.contains("/login") && !referer.contains("/logout")) {
			HttpSession session = request.getSession();
			session.setAttribute(LoginFilter.ATTR_REDIRECT_AFTER_LOGIN, referer);
		}

		dispatcher.forward(request, response);
	}
}
