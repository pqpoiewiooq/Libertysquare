<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.DAOFactory"%>
<%@ page import="dao.HostDAO"%>
<%@ page import="data.Host"%>
<%@ page import="account.User"%>
<%@ page import="util.DateUtil"%>
<%@ page import="java.util.Arrays"%>
<%
	String uri = (String) request.getAttribute("uri");
	
	HostDAO dao = null;
	Host host = null;
	long hostID = (long) request.getAttribute("hostID");
	User user = (User) session.getAttribute("user");
	try {
		dao = DAOFactory.create(HostDAO.class);
		host = dao.getHostDetail(hostID, user == null ? null : user.getUUID());
	} catch(Exception e) {
		response.sendError(404);
		try{
			if(dao != null) dao.close();
		} catch(Exception e2){}
		return;
	}
	if(host == null) {
		response.sendError(404);
		return;
	}

	String name = host.getName();
	String since = DateUtil.since(host.getSince());
	boolean isMember = (user != null && Arrays.stream(host.getMembers()).anyMatch(member -> member.equals(user.getUUID())));

	String _title = name + " | 자유광장";
	String _image = host.getCoverPath();
%>
<html lang="ko">
<head>
	<jsp:include page="/WEB-INF/view/head.jsp" flush="false">
		<jsp:param name="title" value="<%= _title %>" />
		<jsp:param name="image" value="<%= _image %>" />
	</jsp:include>

	<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/layout.css">
	<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/host.css">
</head>
<body>
	<input type="hidden" name="hid" value="<%= hostID %>">
	<div id="root">
		<header class="host-banner-container">
			<div class="host-banner" style="<%="background: url(" + host.getCoverPath() + ") center center / cover no-repeat"%>"></div>
		</header>

		<main class="host-content-container">
			<section>
				<div class="host-info-container">
					<div class="host-info-image" style="<%="background: url(" + host.getProfilePath() + ") center center / cover no-repeat"%>"></div>
					<div>
						<div class="host-info-name"><%= host.getName() %></div>
						<div class="host-info-since"><%= since %></div>
						<div class="host-info-introduce-simple"><%= host.getIntroduceSimple() %></div>
						<div class="host-info-inner">
							<button type="button" class="host-like-button<%= host.hasSubscribed() ? " like" : ""%>">
								<svg viewBox="0 0 512 512" height="1em" width="1em" aria-hidden="true" focusable="false" fill="currentColor" class="valign-down"><path fill="currentColor" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>
								<div class="host-like-num"><%= host.getSubscribeCount() %></div>
							</button>
							<div class="host-meta-info">주최한 행사 <%= host.getEventCount() %> | 주최한 후원행사 <%= host.getSupportCount() %> | 참가자 <%= host.getAttendantCount() %> 명</div>
						</div>
					</div>
				</div>

				<div class="host-menu-bar">
					<% String cur = "/host/" + hostID; %>
					<a class="host-menu" href="<%= cur %>">행사</a>
					<a class="host-menu" href="<%= cur %>/support">후원행사</a><!-- 자유후원 -->
					<a class="host-menu" href="<%= cur + "/info" %>">호스트 정보</a>
					<% if(isMember) { %>
						<a class="host-menu" href="<%= cur + "/edit" %>">호스트 관리</a>
					<% } %>
				</div>
			</section>

			<section id="content">
				<% if(cur.equals(uri)) { %>
					<%@ include file="/WEB-INF/view/host/event-list.jsp" %>
				<% } else if((cur + "/support").equals(uri)) { %>
					<%@ include file="/WEB-INF/view/host/support.jsp" %>
				<% } else if((cur + "/info").equals(uri)) { %>
					<%@ include file="/WEB-INF/view/host/info.jsp" %>
				<% } else if((cur + "/edit").equals(uri)) { %>
					<%@ include file="/WEB-INF/view/host/edit.jsp" %>
				<% } else { response.getWriter().print(uri+"<br>"+cur); }%>
			</section>

			<footer>
				<a href="/">
					<div class="footer-logo-wrapper">자유광장</div>
					<div class="footer-copyright">© 2021</div>
				</a>
			</footer>
		</main>
	</div>

	<jsp:include page="/WEB-INF/view/feedback.html" flush="false" />

	<script type="text/javascript" src="https://ls2020.cafe24.com/js/ls/host.js"></script>
</body>
</html>
<%
try{
	if(dao != null) dao.close();
} catch(Exception e){}
%>