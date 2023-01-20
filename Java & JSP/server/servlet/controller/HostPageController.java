package servlet.controller;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import servlet.common.NoCookieServlet;
import servlet.filter.LoginFilter;

public class HostPageController extends NoCookieServlet {
	private static final long serialVersionUID = 6498784532639590414L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		LoginFilter.removeRedirectAfterLogin(request);

		String uri = request.getRequestURI();
		request.setAttribute("uri", uri);

		RequestDispatcher dispatcher = null;
		try {
			String[] sa = uri.split("/");
			long id = Long.parseLong(sa[2]);

			if (sa.length == 4 && uri.endsWith(".ls")) {
				ServletContext context = request.getServletContext();
				dispatcher = context.getNamedDispatcher("default");
			} else {
				request.setAttribute("hostID", id);
				dispatcher = request.getRequestDispatcher("/WEB-INF/view/host/form.jsp");
			}
		} catch (Exception e) {
		}

		if (dispatcher == null) response.sendError(HttpServletResponse.SC_BAD_REQUEST);
		else dispatcher.forward(request, response);
	}
}