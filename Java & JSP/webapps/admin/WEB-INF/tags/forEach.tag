<%@ tag language="java" pageEncoding="UTF-8" description="user list" trimDirectiveWhitespaces="true" %>

<%@ tag import="java.lang.Iterable"%>

<%@ attribute name="items" required="true" type="java.lang.Iterable"%>
<%@ attribute name="var" required="true" rtexprvalue="false" type="java.lang.String"%>
<%@ variable alias="local" name-from-attribute="var" variable-class="java.lang.Object"%>
<%
	Iterable<?> iterable = (Iterable<?>) jspContext.getAttribute("items");
	String varName = (String) jspContext.getAttribute("var");
%>

<% for(Object object : iterable) { %>
	<% jspContext.setAttribute("local", object); %>
	<jsp:doBody/>
<% } %>