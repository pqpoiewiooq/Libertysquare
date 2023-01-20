<%@ tag language="java" pageEncoding="UTF-8" description="if ~ else statement" trimDirectiveWhitespaces="true" %>
<%@ attribute name="test" required="true" type="java.lang.Boolean"%>
<%@ attribute name="then" fragment="true" %>
<%@ attribute name="else" fragment="true" %>

<% Boolean test = (Boolean) jspContext.getAttribute("test"); %>
<% if(test) { %>
	<% if(jspContext.getAttribute("then") == null) { %>
		<jsp:doBody/>
	<% } else { %>
		<jsp:invoke fragment="then"/>
	<% } %>
<% } else { %>
	<jsp:invoke fragment="else"/>
<% } %>