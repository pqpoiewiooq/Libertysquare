<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="account.User"%>
<%@ page import="dao.DAOFactory"%>
<%@ page import="dao.EventDAO"%>
<%@ page import="data.Event"%>
<%@ page import="data.Ticket"%>
<%@ page import="data.Host"%>
<%@ page import="util.DateUtil"%>
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
	boolean isNativeId = false;
	try (EventDAO dao = DAOFactory.create(EventDAO.class)) {
		String eventID = uri.substring(uri.lastIndexOf("/") + 1);
		try {
			Long.parseLong(eventID);
			isNativeId = true;
		} catch(Exception e) {}
		map = dao.getEventDetail(eventID);
		if(map == null) throw new Exception("DAO Error");
	} catch(Exception e) {
		response.sendError(404);
		return;
	}

	Event event = (Event) map.get("event");
	long eventID = event.getID();
	boolean wasDeleted = event.getStatus() == Event.Status.DELETED;
	if(wasDeleted && isNativeId) {
		response.sendError(404);// 삭제된 행사는 uuid로만 접속 가능
		return;
	}

	List<Ticket> ticketList = (List<Ticket>) map.get("ticket");
	Host host = (Host) map.get("host");
	boolean isMine = (user == null ? false : host.containMember(user.getUUID()));

	String at, venue, venueDetail;
	event.changeWebInfo();
	venue = tagEncode(event.getVenue());
	venueDetail = tagEncode(event.getDetailVenue());
	event.setVenueDescription(tagEncode(event.getVenueDescription()));
	at = event.isOnline() ? venueDetail : venue;

	int personnel = 0;
	int minPrice = 99999999;
	int maxPrice = 0;
	if(ticketList != null) {
		for(Ticket ticket : ticketList) {
			personnel += ticket.getAmount() - ticket.getCurrentAmount();
			int price = ticket.getPrice();
			if(price < minPrice) minPrice = price;
			if(price > maxPrice) maxPrice = price;
		}
	}

	boolean isOutsideEvent = event.getType() == Event.Type.OUTSIDE;
	String buyLink;
	String priceString;
	String buyButtonText;
	boolean wasExpiredEvent = DateUtil.wasExpired(event.getDateTimeEnd());
	if(isOutsideEvent) {
		buyLink = event.getApplyLink();
		priceString = "외부 행사";
		buyButtonText = "행사 신청(외부 등록)";
	} else {
		buyLink = "/payment/" + eventID;
		if(maxPrice > 0) {
			String _min = minPrice == 0 ? "무료" : ("₩" + minPrice).replaceAll("\\B(?=(\\d{3})+(?!\\d))", ",");
			priceString = (minPrice == maxPrice ? _min : _min + " ~ " + ("₩" + maxPrice).replaceAll("\\B(?=(\\d{3})+(?!\\d))", ","));
			buyButtonText = "티켓 구입";
		} else {
			priceString = "무료";
			buyButtonText = "등록";
		}
		if(wasExpiredEvent) {
			buyButtonText = "행사 종료";
		}
	}
	if(wasDeleted) wasExpiredEvent = true;

	String email = event.getContactEmail();
	String tel = event.getContactTel();

	String content = event.getContent();
	//content = content.replaceAll("<img src=\"../..", "<img src=\"/image/event/"+eventID);

	String date = DateUtil.convert(event.getDateTimeStart(), event.getDateTimeEnd());

	String _title = event.getTitle() + " | 자유광장";
	String _image = event.getCoverPath();
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
						<% if(wasDeleted) { %>
							<div class="manager-tab-container">
								<div class="manager-tab-notice">내가 삭제한 행사입니다.</div>
							</div>
						<% } else { %>
							<div class="manager-tab-container">
								<div class="manager-tab-notice">이 행사는 내가 주최 중입니다!</div>
								<div class="manager-tab-button-row">
									<a href="/manage/edit/<%= eventID %>"><button class="form-button blue manager-tab-button">행사 수정하기</button></a>
									<a href="/manage/attendee/<%= eventID %>"><button class="form-button blue manager-tab-button">참가자 목록</button></a>
									<a class="js-delete" data-id="<%= eventID %>"><button class="form-button manager-tab-button">행사 삭제하기</button></a>
								</div>
							</div>
						<% } %>

						<h1 class="primary-title" style="margin-top: 5px;">
					<% } else { %>
						<h1 class="primary-title">
					<% } %> <%= event.getTitle() %></h1>
					<div class="primary-venue">at <%=at%></div>
					<div class="primary-date-wrapper">
						<div class="meta-title">일시</div>
						<div class="meta-text"><%=date%></div>
					</div>
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
							<div class="info-bar-title"><%=event.getTitle()%></div>
							<span class="personnel fsize0">
								<svg viewBox="0 0 640 512" height="1em" width="1em" aria-hidden="true" focusable="false" fill="currentColor" class="valign-down"><path fill="currentColor" d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path></svg>
								<span><%=personnel%>명</span>
							</span>
						</div>
					</div>
					<a class="buy-button<%= wasExpiredEvent ? " expired-button" : "" %>" href="<%= buyLink %>"><%=buyButtonText%></a>
				</div>
			</article>

			<article class="desktop-info-container">
				<div class="content-box"><%= content %></div>
				<div class="ticket-box">
					<% if(!isOutsideEvent) { %>
						<div class="ticket-label">티켓</div>
						<% for(Ticket ticket : ticketList) { 
							String ticketWrapperClass;
							String term;
							if(DateUtil.wasExpired(ticket.getEndDate())) {
								ticketWrapperClass = "ticket-wrapper expired";
								term = "판매 기간이 종료되었습니다.";
							} else {
								ticketWrapperClass = "ticket-wrapper";
								term = DateUtil.term(ticket.getEndDate()) + "일 후에 판매마감";
							} %>
							<div class="<%= ticketWrapperClass %>">
								<div class="ticket-price"><%=ticket.getPriceString()%></div>
								<div class="ticket-name"><%=ticket.getName()%></div>
								<div class="ticket-desc"><%=ticket.getDescription()%></div>
								<% if(!ticket.isHide()) { %>
								<div class="fsize0">
									<svg viewBox="0 0 576 512" height="0.75em" width="0.75em" aria-hidden="true" focusable="false" fill="currentColor" style="transform: rotate(135deg)" class="valign-down">
										<path fill="currentColor" d="M128 160h320v192H128V160zm400 96c0 26.51 21.49 48 48 48v96c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48v-96c26.51 0 48-21.49 48-48s-21.49-48-48-48v-96c0-26.51 21.49-48 48-48h480c26.51 0 48 21.49 48 48v96c-26.51 0-48 21.49-48 48zm-48-104c0-13.255-10.745-24-24-24H120c-13.255 0-24 10.745-24 24v208c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24V152z"></path>
									</svg>
									<span class="ticket-text"><%=ticket.getCurrentAmount()%>명 남음</span>
								</div>
								<% } %>
								<div class="fsize0">
									<svg viewBox="0 0 576 512" height="0.75em" width="0.75em" aria-hidden="true" focusable="false" fill="currentColor" class="valign-down">
										<path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
									</svg>
									<span class="ticket-text">1인당 <%=ticket.getPurchaseLimit()%>개 구입가능</span>
								</div>
								<div class="fsize0">
									<svg viewBox="0 0 576 512" height="0.75em" width="0.75em" aria-hidden="true" focusable="false" fill="currentColor" class="valign-down">
										<path fill="currentColor" d="M148 288h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm108-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 96v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96-260v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"></path>
									</svg>
									<span class="ticket-text"><%= term %></span>
								</div>
							</div>
						<% }
					} %>
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
					</div>
				</div>
			</article>

			<article class="location-container">
				<% if(!event.isOnline()) { %>
				<div class="map-container">
					<iframe style="width: 100%; height: 100%; border: 0;" loading="lazy" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBvGKFCLL6khttyoTqy_7haBhgoA2pPR6Q&q=<%=venue%>" allowfullscreen></iframe>
				</div>
				<div class="location-label">장소</div>
				<div class="location-name"><%=venue%></div>
				<div class="location-label"><%=venueDetail%></div>
				<% } else { %>
				<div class="location-label"><%=venue%></div>
				<div class="location-name"><%=venueDetail%></div>
				<% } %>
				
				<% if(event.getVenueDescription() != null) { %>
					<div class="location-desc"><%=event.getVenueDescription()%></div>
				<% } %>
			</article>
		</section>
	</div>

	<!-- 모바일 뷰 -->

	<div id="mobileView">
		<div class="main-image" style="<%="background: url(" + _image + ") center center / cover no-repeat"%>"></div>
		<section class="event-container">
			<article class="primary-wrapper">
				<% if(isMine) { %>
					<% if(wasDeleted) { %>
						<div class="manager-tab-container">
							<div class="manager-tab-notice">내가 삭제한 행사입니다.</div>
						</div>
					<% } else { %>
						<div class="manager-tab-container">
							<div class="manager-tab-notice">이 행사는 내가 주최 중입니다!</div>
							<div class="manager-tab-button-row">
								<a href="/manage/edit/<%= eventID %>"><button class="form-button blue manager-tab-button">행사 수정하기</button></a>
								<a href="/manage/attendee/<%= eventID %>"><button class="form-button blue manager-tab-button">참가자 목록</button></a>
								<a class="js-delete" data-id="<%= eventID %>"><button class="form-button manager-tab-button">행사 삭제하기</button></a>
							</div>
						</div>
					<% } %>
				<% } %>
				<h1><%=event.getTitle()%></h1>
				<div class="primary-venue">at <%=at%></div>
				<div class="personnel fsize0">
					<svg viewBox="0 0 24 24" height="0.75em" width="0.75em" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
						<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
						<circle cx="9" cy="7" r="4"></circle>
						<path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
					</svg>
					<span><%=personnel%>명</span>
				</div>
				<hr class="primary-hr">
				<div class="date-wrapper">
					<div class="meta-title">일시</div>
					<div class="meta-text"><%=date%></div>
				</div>
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
			<article class="location-container">
				<% if(!event.isOnline()) { %>
				<div class="map-container">
					<iframe style="width: 100%; height: 100%; border: 0;" loading="lazy" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBvGKFCLL6khttyoTqy_7haBhgoA2pPR6Q&q=<%=venue%>" allowfullscreen></iframe>
				</div>
				<div class="location-name"><%=venue%></div>
				<div class="location-label"><%=venueDetail%></div>
				<% } else { %>
				<div class="location-label"><%=venue%></div>
				<div class="location-name"><%=venueDetail%></div>
				<% } %>
				<% if(event.getVenueDescription() != null) { %>
					<div class="location-desc"><%=event.getVenueDescription()%></div>
				<% } %>
			</article>
			<% if(!isOutsideEvent) { %>
				<div class="ticket-label">티켓</div>
				<% for(Ticket ticket : ticketList) { 
					long term = DateUtil.term(ticket.getEndDate());
					String ticketWrapperClass;
					String _term;
					if(term < 0) {
						ticketWrapperClass = "ticket-wrapper expired";
						_term = "판매 기간이 종료되었습니다.";
					} else {
						ticketWrapperClass = "ticket-wrapper";
						_term = term + "일 후에 판매마감";
					} %>
					<div class="<%= ticketWrapperClass %>">
						<div class="ticket-price"><%=ticket.getPriceString()%></div>
						<div class="ticket-name"><%=ticket.getName()%></div>
						<div class="ticket-desc"><%=ticket.getDescription()%></div>
						<% if(!ticket.isHide()) { %>
						<div class="fsize0">
							<svg viewBox="0 0 576 512" height="0.75em" width="0.75em" aria-hidden="true" focusable="false" fill="currentColor" class="valign-down ticket-icon">
								<path fill="currentColor" d="M128 160h320v192H128V160zm400 96c0 26.51 21.49 48 48 48v96c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48v-96c26.51 0 48-21.49 48-48s-21.49-48-48-48v-96c0-26.51 21.49-48 48-48h480c26.51 0 48 21.49 48 48v96c-26.51 0-48 21.49-48 48zm-48-104c0-13.255-10.745-24-24-24H120c-13.255 0-24 10.745-24 24v208c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24V152z"></path>
							</svg>
							<span class="ticket-text"><%=ticket.getCurrentAmount()%>명 남음</span>
						</div>
						<% } %>
						<div class="fsize0">
							<svg viewBox="0 0 576 512" height="0.75em" width="0.75em" aria-hidden="true" focusable="false" fill="currentColor" class="valign-down">
								<path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
							</svg>
							<span class="ticket-text">1인당 <%=ticket.getPurchaseLimit()%>개 구입가능</span>
						</div>
						<div class="fsize0">
							<svg viewBox="0 0 576 512" height="0.75em" width="0.75em" aria-hidden="true" focusable="false" fill="currentColor" class="valign-down">
								<path fill="currentColor" d="M148 288h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm108-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 96v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96-260v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"></path>
							</svg>
							<span class="ticket-text"><%= _term %></span>
						</div>
					</div>
				<% }
			}%>
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
			</article>
			<div class="bottom-padding"></div>
		</section>
		<article class="mobile-info-bar">
			<a class="mobile-buy-button <%= wasExpiredEvent ? " expired-button" : "" %>" href="<%= buyLink %>"><%=buyButtonText%></a>
		</article>
	</div>
			
	<jsp:include page="/WEB-INF/view/footer.html" flush="false" />
	<jsp:include page="/WEB-INF/view/feedback.html" flush="false" />
</body>
<script type="text/javascript" src="https://ls2020.cafe24.com/js/ls/event/event.js"></script>
</html>