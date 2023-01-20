<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="account.User"%>
<% User user = (User) session.getAttribute("user"); %>
<%@ include file="rsa_generator.jsp" %>
<html lang="ko">
<head>
    <jsp:include page="/WEB-INF/view/head.jsp" flush="false">
		<jsp:param name="title" value="회원 탈퇴 | 자유광장" />
	</jsp:include>

    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/layout.css">
    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/auth.css">
</head>
<body>
    <header>
        <a href="/" class="logo"></a>
        <h1 class="header-text">다시 만날 날 기다릴게요!</h1>
    </header>
    <form class="form-container" action="https://api.libertysquare.co.kr/account" method="DELETE" data-msg="탈퇴되었습니다.">
        <input type="hidden" id="m" value="<%= modulus %>" />
        <input type="hidden" id="e" value="<%= exponent %>" />
        <div class="input-field-wrapper">
            <label class="input-label">휴대폰 번호</label>
            <input name="id" type="text" class="input-field" value="<%= user.getID() %>" disabled>
        </div>
        <div class="input-field-wrapper">
            <label class="input-label" required>비밀번호</label>
            <input name="password" type="password" autocomplete="off" class="input-field" maxlength="16" autofocus>
            <div class="error-text hidden">비밀번호를 입력해주세요</div>
        </div>
        <button type="submit" class="form-button">
            <div class="form-button-text">회원 탈퇴</div>
        </button>
    </form>
    <jsp:include page="/WEB-INF/view/feedback.html" flush="false" />
</body>
<script type="text/javascript" src="https://ls2020.cafe24.com/assets/rsa/rsalib.min.js"></script>
<script type="text/javascript" src="https://ls2020.cafe24.com/js/ls/auth/password.js"></script>
</html>