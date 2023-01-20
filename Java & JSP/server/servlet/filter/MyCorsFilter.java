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

public class MyCorsFilter implements Filter {
	private String allowMethods;
	private String originFilter;

	public void init(FilterConfig config) throws ServletException {
		allowMethods = config.getInitParameter("allow-methods");
		if(allowMethods == null) allowMethods = "POST, GET, OPTIONS";
		originFilter = config.getInitParameter("origin-filter");
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		chain.doFilter(request, response);

		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
		
		String serverName = req.getHeader("origin");
		if(originFilter == null || serverName == null || serverName.contains(originFilter)) {
			if(serverName == null) serverName = "*";
			res.setHeader("Access-Control-Allow-Methods", allowMethods);
			res.setHeader("Access-Control-Max-Age", "3600");
			res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers");
			res.setHeader("Access-Control-Allow-Credentials", "true");
			
			res.setHeader("Access-Control-Allow-Origin", originFilter == null ? "*" : serverName);
		}
	}

	public void destroy() {
	}
}
