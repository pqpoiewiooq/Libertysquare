<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="account.User"%>
<%@ page import="servlet.util.ServletHelper"%>
<%@ page import="community.dao.PostDAO"%>
<%@ page import="dao.DAOFactory"%>
<%@ page import="community.entity.Post"%>
<%@ page import="community.entity.Post.PostContentManager"%>
<%@ page import="community.entity.Post.PostContentManager.PostContent"%>
<%
    String uri = (String) request.getAttribute("uri");
	User user = (User) session.getAttribute("user");
%>
<html lang="ko">
<head>
	<%
		if(uri.matches("/post/[a-zA-Z\\d]*((?:\\?)[a-zA-Z0-9-_&=]*|/?)+")) { 
			PostDAO dao = null;
			try {
				long id = ServletHelper.getPathLong(request, 2);
				dao = DAOFactory.create(PostDAO.class);
				Post post = dao.get(id);
				PostContent content = PostContentManager.optimize(post.getContent(), 320);
				if(content.firstImageSrc == null) content.firstImageSrc = "https://ls2020.cafe24.com/img/flattop/og.png";
				post.setTitle(post.getTitle() + " | FLATTOP");
				%>
					<jsp:include page="/WEB-INF/view/head.jsp" flush="false">
						<jsp:param name="title" value="<%= post.getTitle() %>" />
						<jsp:param name="image" value="<%= content.firstImageSrc %>" />
					</jsp:include>
				<%
			} catch(Exception e) {
				response.sendError(404);
				return;
			} finally {
				try {
					if(dao != null) dao.close();
				} catch(Exception e) {}
			}
		} else { %>
    		<jsp:include page="/WEB-INF/view/head.jsp" flush="false" />
	<% } %>
    
    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/flattop/layout.css">
	<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/flattop/community.css">
</head>
<body>
    <%@ include file="/WEB-INF/view/header.jsp" %>

	<% try { %>
		<% if(uri.startsWith("/document/")) { %>
			<%@ include file="/WEB-INF/view/document/index.jsp" %>
		<% } else if(uri.matches("/ad")) { %>
			<jsp:include page="/WEB-INF/view/ad.html" flush="false" />
		<% } else if(uri.matches("/board/[\\d]+/new(/?)+")) { %>
			<%@ include file="/WEB-INF/view/board/index.jsp" %>
		<% } else if(uri.matches("/(board|post)/[a-zA-Z\\d]*((?:\\?)[a-zA-Z0-9-_&=]*|/?)+") || uri.startsWith("/search") || uri.matches("/board/[\\d]/search.*")) { %>
			<%@ include file="/WEB-INF/view/board/index.jsp" %>
		<% } else if(uri.startsWith("/my/")) { %>
			<%@ include file="/WEB-INF/view/my/mypage-form.jsp" %>
		<% } else { %>
			<jsp:include page="/WEB-INF/view/error-404.html" flush="false" />
		<% } %>
	<% } catch(Exception e) {
		response.sendError(404);
	} %>
            
    <jsp:include page="/WEB-INF/view/footer.html" flush="false" />
    <jsp:include page="/WEB-INF/view/feedback.html" flush="false" />

	<script id="data">
		(function(){
			window.isLogin = <%= (user != null) %>;
			document.addEventListener('DOMContentLoaded', function() {
				var volatileScript = document.getElementById('data');
				if(volatileScript) volatileScript.remove();
			}, { once: true });
		})();
	</script>
</body>
</html>