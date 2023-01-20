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

import account.User;
import servlet.common.DefaultServletInterface;
import servlet.common.ServletStatus;

public class AdminFilter implements Filter, DefaultServletInterface {
	public void init(FilterConfig config) throws ServletException {}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		if(request instanceof HttpServletRequest) {
			HttpServletRequest req = (HttpServletRequest) request;
			HttpServletResponse res = (HttpServletResponse) response;
			
			User user = getUser(req, false);
			if(user == null) res.sendError(ServletStatus.UNAUTHORIZED.getStatus());
			else if(!user.getName().startsWith("_ADMIN")) res.sendError(ServletStatus.FORBIDDEN.getStatus());
			else chain.doFilter(request, response);
		}
	}

	public void destroy() {}
}
