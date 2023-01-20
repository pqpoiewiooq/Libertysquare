<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<% String innerPage = "/WEB-INF/view"+uri+".jsp"; %>
<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/document.css">
<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/events.css">
<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/mypage.css">
<div class="document-container">
    <nav class="lnb">
        <a class="lnb-link" href="/my/tickets">내 티켓</a>
        <a class="lnb-link" href="/my/hosts">호스트</a>
        <a class="lnb-link" href="/my/events">주최 내역</a>
        <a class="lnb-link" href="/my/profile">프로필</a>
        <a class="lnb-link" href="/logout" target="_blank">로그아웃</a>
    </nav>
    <!---->
    <div class="document-fomatter">
		<jsp:include page="<%=innerPage%>" flush="false"/>
    </div>

    <script type="text/javascript" src="https://ls2020.cafe24.com/js/document.js"></script>
    <!---->
</div>