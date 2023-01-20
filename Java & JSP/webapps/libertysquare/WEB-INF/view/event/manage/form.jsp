<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="account.User"%>
<%@ page import="data.Event"%>
<%@ page import="dao.EventDAO"%>
<%@ page import="dao.DAOFactory"%>
<%
    String uri = (String) request.getAttribute("uri");
	User user = (User) session.getAttribute("user");

    String pageTitle = null;
    if(uri.matches("/manage/attendee/[0-9]*")) {
        pageTitle = "참가자 목록 | 자유광장";
    } else if(uri.matches("/manage/edit/[0-9]*")) {
        pageTitle = "행사 수정 | 자유광장";
    } else if(uri.matches("/manage/download-center/[0-9]*")) {
        pageTitle = "다운로드 센터 | 자유광장";
    }

    Event event = null;
    long eventID = -1;
    try (EventDAO dao = DAOFactory.create(EventDAO.class)) {
        eventID = Long.parseLong(uri.split("/")[3]);
        event = dao.get(eventID);
        if(event == null) throw new Exception("DAO Error");
    } catch(Exception e) {
        response.sendError(HttpServletResponse.SC_NOT_FOUND);
        return;
    }
%>
<html lang="ko">
<head>
    <jsp:include page="/WEB-INF/view/head.jsp" flush="false">
		<jsp:param name="title" value="<%=pageTitle%>" />
	</jsp:include>
    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/layout.css">
    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/document.css">
    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/event_manage.css">
</head>
<body>
    <header>
        <nav id="gnb">
            <div class="gnb-left">
                <a href="/"><img class="gnb-logo" src="https://ls2020.cafe24.com/img/ls/logo.png" /></a>
                <span class="cross-mark">✕</span>
                <a class="gnb-event-title" href="/event/<%= eventID %>"><%= event.getTitle() %></a>
                <% if(event.getStatus() != Event.Status.PUBLIC) { %><span class="publish-state">(비공개)</span><% } %>
            </div>

            <div class="gnb-right">
                <div class="manage-gnb-link-container">
                    <a class="manage-gnb-link" href="/manage/attendee/<%= eventID %>">참가자 목록</a>
                    <a class="manage-gnb-link" href="/manage/edit/<%= eventID %>">행사 수정</a>
                    <a class="manage-gnb-link" href="/qrscan" target="_blank">QR 스캐너</a>
                </div>
                <a class="gnb-btn" href="/my/tickets" style="display: inline-block;"><%= user.getNickname() %></a>
                <!--
                <svg class="gnb-icon valign-down" viewBox="0 0 448 512" height="1.33em" width="1.33em" aria-hidden="true" focusable="false" fill="currentColor">
                    <path fill="currentColor" d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
                </svg>
                -->
            </div>
        </nav>
    </header>

    <section class="manage-fomatter">
        <% if(uri.matches("/manage/attendee/[0-9]*")){ %>
            <%@ include file="/WEB-INF/view/event/manage/attendee.jsp" %>
        <% } else if(uri.matches("/manage/edit/[0-9]*")) { %>
            <%@ include file="/WEB-INF/view/event/manage/edit.jsp" %>
        <% } else if(uri.matches("/manage/download-center/[0-9]*")) { %>
            <%@ include file="/WEB-INF/view/event/manage/download-center.jsp" %>
        <% } else { %>
            <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/error.css">
            <jsp:include page="/WEB-INF/view/error-404.html" flush="false" />
        <% } %>
    </section>
            
    <jsp:include page="/WEB-INF/view/feedback.html" flush="false" />
</body>
</html>