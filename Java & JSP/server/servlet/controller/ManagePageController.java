package servlet.controller;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import servlet.filter.LoginFilter;

public class ManagePageController extends HttpServlet {
	private static final long serialVersionUID = -1586065092157707428L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		LoginFilter.removeRedirectAfterLogin(request);

		String uri = request.getRequestURI();
		request.setAttribute("uri", uri);
		
		RequestDispatcher dispatcher = null;
		switch(request.getRequestURI()) {
		case "/qrscan":
			dispatcher = request.getRequestDispatcher("/WEB-INF/view/event/manage/qrscan.jsp");
			break;
		default:
			dispatcher = request.getRequestDispatcher("/WEB-INF/view/event/manage/form.jsp");
			break;
		}
		
		if(dispatcher == null) response.sendError(HttpServletResponse.SC_BAD_REQUEST);
        else dispatcher.forward(request, response);
	}
}
