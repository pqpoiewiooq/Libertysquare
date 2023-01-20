package servlet.controller;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import servlet.common.NoCookieServlet;
import servlet.filter.LoginFilter;

public class DetailPageController extends NoCookieServlet {
	private static final long serialVersionUID = 6613723863041259691L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		LoginFilter.removeRedirectAfterLogin(request);

		String uri = request.getRequestURI();
		forwardDetailPage(request, response, uri);
	}

	public static void forwardDetailPage(HttpServletRequest request, HttpServletResponse response, String uri) throws ServletException, IOException {
		request.setAttribute("uri", uri);
		RequestDispatcher dispatcher = request.getRequestDispatcher("/WEB-INF/view/detail.jsp");
		dispatcher.forward(request, response);
	}
}