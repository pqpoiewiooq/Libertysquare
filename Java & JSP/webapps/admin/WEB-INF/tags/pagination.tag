<%@ tag language="java" pageEncoding="UTF-8" description="user list" %>
<%@ tag trimDirectiveWhitespaces="true" body-content="empty" %>
<%@ attribute name="current" required="true" type="java.lang.Integer"%>
<%@ attribute name="uri" required="true"%>


<% int _page = (int) jspContext.getAttribute("current"); %>

<nav class="pagination">
<% if (current > 2) { %>
	<a class="first" href="${uri += 1}">처음</a>
<% } if (current > 1) { %>
	<a class="prev" href="${uri += (current - 1)}">이전</a>
<% }%>
	<a class="next" href="${uri += (current + 1)}">다음</a>
</nav>