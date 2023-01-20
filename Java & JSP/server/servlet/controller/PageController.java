package servlet.controller;
import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import servlet.filter.LoginFilter;

//@WebServlet(urlPatterns = {"/error-404", "/event", "/events", "/feedback", "/footer", "/header", "/index", "/login", "/search", "/sign", "/signup", "/document/"})
public class PageController extends HttpServlet{
	private static final long serialVersionUID = 6741928658173966324L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		LoginFilter.removeRedirectAfterLogin(request);
		
        String uri = request.getRequestURI();
        RequestDispatcher dispatcher = request.getRequestDispatcher("/WEB-INF/view/"+uri+".jsp");
        dispatcher.forward(request, response);
    }
} 