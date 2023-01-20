<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="account.User"%>
<%@ page import="dao.DAOFactory"%>
<%@ page import="dao.SupportDAO"%>
<%@ page import="data.Support"%>
<%@ page import="data.Account"%>
<%@ page import="data.Host"%>
<%@ page import="java.util.Map"%>
<%@ page import="java.util.List"%>
<%@ page import="dao.HostDAO"%>
<%!
	public String tagEncode(String str) {
		if(str == null) return null;
		String regex = "^(?i)((https?:\\/\\/|ssh:\\/\\/|ftp:\\/\\/|file:\\/|www\\.|(?:mailto:)?[A-Z0-9._%+\\-]+@)(.+)$)";
		return str.replaceAll(regex, "<a href=\"$1\" target=\"_blank\">$1</a>");
	}
%>
<%
	String uri = request.getRequestURI();
	User user = (User) session.getAttribute("user");

	Map<String, Object> map = null;
	try (SupportDAO dao = DAOFactory.create(SupportDAO.class)) {
		String id = uri.substring(uri.lastIndexOf("/") + 1);
		map = dao.getDetail(id);
		if(map == null) throw new Exception("DAO Error");
	} catch(Exception e) {
		response.sendError(404);
		return;
	}

	Support support = (Support) map.get("support");
	long id = support.getID();
	Host host = (Host) map.get("host");
	boolean isMine = (user == null ? false : host.containMember(user.getUUID()));

	String buyLink = support.getLink();
	String priceString = "외부 후원";
	String buyButtonText = "후원하기(외부 후원)";

	String email = support.getContactEmail();
	String tel = support.getContactTel();
	String account = null;
	Account ac = support.getAccount();
	if(buyLink != null) {
		buyLink = "href=\"" + buyLink + "\"";
	}
	if(ac != null) {
		account = ac.getBank().toString() + "&nbsp;&nbsp;" + ac.getNumber() + "<br/>(예금주:" + ac.getHolder() + ")";
		if(buyLink == null) {
			buyLink = "onclick=\"copy(this)\" data-account=\"" + ac.getNumber() + "\"";
			buyButtonText = "계좌번호 복사하기";
		}
	}

	String content = support.getContent() + "<p style=\"color: red\">*본 서비스는 보다 더 많은 단체가 홍보할 수 있도록 별도의 진입장벽을 규정하지 않습니다. 후원자는 후원단체의 진위 여부, 활동 등을 확인 후 신중히 후원하시기 바랍니다. 회사는 이에 대해 책임을 지지 않습니다.</p>";

	String _title = support.getTitle() + " | 자유광장";
	String _image = support.getCoverPath();
%>
<html lang="ko">
<head>
	<jsp:include page="/WEB-INF/view/head.jsp" flush="false">
		<jsp:param name="title" value="<%= _title %>" />
		<jsp:param name="image" value="<%= _image %>" />
	</jsp:include>

	<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/layout.css">
	<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/event.css">

	<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8045181453001492" crossorigin="anonymous"></script>
</head>
<body>
	<%@ include file="/WEB-INF/view/header.jsp" %>

	<div id="desktopView">
		<section class="event-container">
			<article class="info-box">
				<div class="image-wrapper">
					<div class="main-image" style="<%="background: url(" + _image + ") center center / cover no-repeat"%>"></div>
				</div>
				<div class="primary-wrapper">
					<% if(isMine) { %>
						<div class="manager-tab-container">
							<div class="manager-tab-notice">이 후원은 내가 모금 중입니다.</div>
							<div class="manager-tab-button-row">
								<a href="/manage/edit/<%= id %>" style="width: 40%"><button class="form-button blue manager-tab-button">후원 수정하기</button></a>
								<a class="js-delete" style="width: 40%" data-id="<%= id %>"><button class="form-button manager-tab-button">후원 삭제하기</button></a>
							</div>
						</div>

						<h1 class="primary-title" style="margin-top: 5px;">
					<% } else { %>
						<h1 class="primary-title">
					<% } %> <%= support.getTitle() %></h1>
					<div class="primary-venue"><%= support.getBusinessType().toString() %></div>
					<div class="organizer-wrapper">
						<div class="meta-title">주최</div>
						<a class="host-box fsize0" href="<%= "/host/"+host.getID()+"\""%>">
							<img class="host-image" src="<%= host.getProfilePath() %>">
							<div class="host-text"><%=host.getName()%></div>
							<svg viewBox="0 0 576 512" height="1em" width="1em" aria-hidden="true" focusable="false" fill="currentColor" style="margin:11px">
								<path fill="currentColor" d="M576 24v127.984c0 21.461-25.96 31.98-40.971 16.971l-35.707-35.709-243.523 243.523c-9.373 9.373-24.568 9.373-33.941 0l-22.627-22.627c-9.373-9.373-9.373-24.569 0-33.941L442.756 76.676l-35.703-35.705C391.982 25.9 402.656 0 424.024 0H552c13.255 0 24 10.745 24 24zM407.029 270.794l-16 16A23.999 23.999 0 0 0 384 303.765V448H64V128h264a24.003 24.003 0 0 0 16.97-7.029l16-16C376.089 89.851 365.381 64 344 64H48C21.49 64 0 85.49 0 112v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V287.764c0-21.382-25.852-32.09-40.971-16.97z"></path>
							</svg>
						</a>
					</div>
				</div>
			</article>
			
			<div class="main-price"><%=priceString%></div>
			<div class="info-bar-default-height"></div>
			<article class="info-bar">
				<div class="info-bar-wrapper">
					<div class="info-bar-inner">
						<div>
							<div class="info-bar-title"><%=support.getTitle()%></div>
						</div>
					</div>
					<a class="buy-button" <%=buyLink%>><%=buyButtonText%></a>
				</div>
			</article>

			<article class="desktop-info-container">
				<div class="content-box"><%= content %></div>
				<div class="ticket-box">
					<div class="contact-wrapper">
						<div class="contact-label">주최자 연락처</div>
						<div class="contact-inner">
							<% if(email != null) { %>
								<div class="fsize0">
									<svg viewBox="0 0 24 24" height="18px" width="14px" aria-hidden="true" focusable="false" fill="currentColor">
										<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
									</svg>
									<div class="contact-text">
										<a href="<%= "mailto:" + email %>" style="text-decoration: underline"><%=email%></a>
									</div>
								</div>
							<% } if (tel != null) { %>
								<div class="fsize0">
									<svg viewBox="0 0 24 24" height="18px" width="14px" aria-hidden="true" focusable="false" fill="currentColor">
										<path d="M14.594 13.994l-1.66 1.66c-.577-.109-1.734-.471-2.926-1.66-1.193-1.193-1.553-2.354-1.661-2.926l1.661-1.66.701-.701-5.414-5.414-.701.701-1 1a.991.991 0 0 0-.291.649c-.015.25-.302 6.172 4.291 10.766C11.6 20.414 16.618 20.707 18 20.707c.202 0 .326-.006.358-.008a.994.994 0 0 0 .649-.291l1-1 .697-.697-5.414-5.414-.696.697z"></path>
									</svg>
									<div class="contact-text"><%= tel %></div>
								</div>
							<% } %>
						</div>
						<% if (account != null) { %>
							<div class="contact-label" style="margin-top: 15px;">계좌</div>
							<div class="contact-inner">
								<div class="fsize0">
									<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="18px" viewBox="0 0 24 24" width="18px" fill="currentColor"><g><rect fill="none" height="24" width="24"/></g><g><path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8c0-4.41,3.59-8,8-8 s8,3.59,8,8C20,16.41,16.41,20,12,20z M12.89,11.1c-1.78-0.59-2.64-0.96-2.64-1.9c0-1.02,1.11-1.39,1.81-1.39 c1.31,0,1.79,0.99,1.9,1.34l1.58-0.67c-0.15-0.44-0.82-1.91-2.66-2.23V5h-1.75v1.26c-2.6,0.56-2.62,2.85-2.62,2.96 c0,2.27,2.25,2.91,3.35,3.31c1.58,0.56,2.28,1.07,2.28,2.03c0,1.13-1.05,1.61-1.98,1.61c-1.82,0-2.34-1.87-2.4-2.09L8.1,14.75 c0.63,2.19,2.28,2.78,3.02,2.96V19h1.75v-1.24c0.52-0.09,3.02-0.59,3.02-3.22C15.9,13.15,15.29,11.93,12.89,11.1z"/></g></svg>
									<div class="contact-text" data-account="<%= ac.getNumber() %>"><%= account %></div>
								</div>
							</div>
						<% } %>
					</div>
				</div>
			</article>
		</section>
	</div>

	<!-- 모바일 뷰 -->

	<div id="mobileView">
		<div class="main-image" style="<%="background: url(" + _image + ") center center / cover no-repeat"%>"></div>
		<section class="event-container">
			<article class="primary-wrapper">
				<% if(isMine) { %>
					<div class="manager-tab-container">
						<div class="manager-tab-notice">이 후원은 내가 모금 중입니다!</div>
						<div class="manager-tab-button-row">
							<a href="/manage/edit/<%= id %>" style="width: 40%"><button class="form-button blue manager-tab-button">후원 수정하기</button></a>
							<a class="js-delete" style="width: 40%" data-id="<%= id %>"><button class="form-button manager-tab-button">후원 삭제하기</button></a>
						</div>
					</div>
				<% } %>
				<h1><%=support.getTitle()%></h1>
				<div class="primary-venue"><%= support.getBusinessType().toString() %></div>
				<hr class="primary-hr">
				<div class="organizer-wrapper">
					<div class="meta-title">주최</div>
					<a class="host-box fsize0" href="<%="/host/"+host.getID()+"\""%>">
						<img class="host-image" src="<%= host.getProfilePath() %>">
						<div class="host-text"><%=host.getName()%></div>
						<svg viewBox="0 0 576 512" height="1em" width="1em" aria-hidden="true" focusable="false" fill="currentColor" style="margin:11px">
							<path fill="currentColor" d="M576 24v127.984c0 21.461-25.96 31.98-40.971 16.971l-35.707-35.709-243.523 243.523c-9.373 9.373-24.568 9.373-33.941 0l-22.627-22.627c-9.373-9.373-9.373-24.569 0-33.941L442.756 76.676l-35.703-35.705C391.982 25.9 402.656 0 424.024 0H552c13.255 0 24 10.745 24 24zM407.029 270.794l-16 16A23.999 23.999 0 0 0 384 303.765V448H64V128h264a24.003 24.003 0 0 0 16.97-7.029l16-16C376.089 89.851 365.381 64 344 64H48C21.49 64 0 85.49 0 112v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V287.764c0-21.382-25.852-32.09-40.971-16.97z"></path>
						</svg>
					</a>
				</div>
				<hr class="primary-hr">
			</article>
			<article class="content-box"><%=content%></article>
			<article class="contact-wrapper">
				<div class="contact-label">주최자 연락처</div>
				<div class="contact-inner">
					<% if(email != null) { %>
						<div class="fsize0">
							<svg viewBox="0 0 24 24" height="18px" width="14px" aria-hidden="true" focusable="false" fill="currentColor">
								<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
							</svg>
							<div class="contact-text">
								<a href="<%= "mailto:" + email %>" style="text-decoration: underline"><%=email%></a>
							</div>
						</div>
					<% } if (tel != null) { %>
						<div class="fsize0">
							<svg viewBox="0 0 24 24" height="18px" width="14px" aria-hidden="true" focusable="false" fill="currentColor">
								<path d="M14.594 13.994l-1.66 1.66c-.577-.109-1.734-.471-2.926-1.66-1.193-1.193-1.553-2.354-1.661-2.926l1.661-1.66.701-.701-5.414-5.414-.701.701-1 1a.991.991 0 0 0-.291.649c-.015.25-.302 6.172 4.291 10.766C11.6 20.414 16.618 20.707 18 20.707c.202 0 .326-.006.358-.008a.994.994 0 0 0 .649-.291l1-1 .697-.697-5.414-5.414-.696.697z"></path>
							</svg>
							<div class="contact-text"><%= tel %></div>
						</div>
					<% } %>
				</div>
				<% if (account != null) { %>
					<div class="contact-label" style="margin-top: 15px;">계좌</div>
					<div class="contact-inner">
						<div class="fsize0">
							<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="18px" viewBox="0 0 24 24" width="18px" fill="currentColor"><g><rect fill="none" height="24" width="24"/></g><g><path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8c0-4.41,3.59-8,8-8 s8,3.59,8,8C20,16.41,16.41,20,12,20z M12.89,11.1c-1.78-0.59-2.64-0.96-2.64-1.9c0-1.02,1.11-1.39,1.81-1.39 c1.31,0,1.79,0.99,1.9,1.34l1.58-0.67c-0.15-0.44-0.82-1.91-2.66-2.23V5h-1.75v1.26c-2.6,0.56-2.62,2.85-2.62,2.96 c0,2.27,2.25,2.91,3.35,3.31c1.58,0.56,2.28,1.07,2.28,2.03c0,1.13-1.05,1.61-1.98,1.61c-1.82,0-2.34-1.87-2.4-2.09L8.1,14.75 c0.63,2.19,2.28,2.78,3.02,2.96V19h1.75v-1.24c0.52-0.09,3.02-0.59,3.02-3.22C15.9,13.15,15.29,11.93,12.89,11.1z"/></g></svg>
							<div class="contact-text" data-account="<%= ac.getNumber() %>"><%= account %></div>
						</div>
					</div>
				<% } %>
			</article>
			<div class="bottom-padding"></div>
		</section>
		<article class="mobile-info-bar">
			<a class="mobile-buy-button" <%=buyLink%>><%=buyButtonText%></a>
		</article>
	</div>
			
	<jsp:include page="/WEB-INF/view/footer.html" flush="false" />
	<jsp:include page="/WEB-INF/view/feedback.html" flush="false" />
</body>
<script type="text/javascript" src="https://ls2020.cafe24.com/js/support/event/event.js"></script>
</html>