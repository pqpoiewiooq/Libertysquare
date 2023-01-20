<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="account.User"%>
<%
    String uri = (String) request.getAttribute("uri");
	User user = (User) session.getAttribute("user");

    String pageTitle = "";
    if("/event".equals(uri)) {
        pageTitle = "행사 페이지";
    } else if("/document/code-of-conduct".equals(uri)) {
        pageTitle = "LibertySqaure Code of Conduct | 자유광장";
    } else if("/document/help".equals(uri)) {
        pageTitle = "헬프 데스크 | 자유광장";
    } else if("/document/terms".equals(uri)) {
        pageTitle = "이용약관 | 자유광장";
    } else if("/document/privacy".equals(uri)) {
        pageTitle = "개인정보처리방침 | 자유광장";
    } else if("/document/payment-agreement".equals(uri)) {
        pageTitle = "결제정보제공동의 | 자유광장";
    } else {
        pageTitle = "자유광장";
    }
%>
<html lang="ko">
<head>
    <jsp:include page="/WEB-INF/view/head.jsp" flush="false">
		<jsp:param name="title" value="<%= pageTitle %>" />
	</jsp:include>
    
    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/layout.css">
</head>
<body>
    <%@ include file="/WEB-INF/view/header.jsp" %>

    <% if("/events".equals(uri)) { %>
        <%@ include file="/WEB-INF/view/events.jsp" %>
    <% } else if(uri.startsWith("/document/")) { %>
        <%@ include file="/WEB-INF/view/document/index.jsp" %>
    <% } else if(uri.matches("/my/refund/[0-9]*")) { %>
        <%@ include file="/WEB-INF/view/my/refund.jsp" %>
    <% } else if(uri.startsWith("/my/")) { %>
        <%@ include file="/WEB-INF/view/my/mypage-form.jsp" %>
    <% } else if(uri.startsWith("/event/new")){%>
        <%@ include file="/WEB-INF/view/event/new/index.jsp" %>
    <% } else if(uri.matches("/payment/[0-9]*")){%>
        <%@ include file="/WEB-INF/view/payment/select-ticket.jsp" %>
    <% } else { %>
        <jsp:include page="/WEB-INF/view/error-404.html" flush="false" />
    <% } %>
            
    <jsp:include page="/WEB-INF/view/footer.html" flush="false" />
    <jsp:include page="/WEB-INF/view/feedback.html" flush="false" />
</body>
</html>