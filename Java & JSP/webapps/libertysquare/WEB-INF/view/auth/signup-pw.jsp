<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="servlet.util.ServletHelper"%>
<%@ page import="account.User"%>
<%@ page import="util.CryptoHelper"%>
<%@ page import="java.security.KeyPair"%>
<%@ page import="java.security.KeyFactory"%>
<%@ page import="java.security.spec.RSAPublicKeySpec"%>
<%
User userData = (User) session.getAttribute("checkplus-data");
if(userData == null) {
    ServletHelper.alert(response.getWriter(), "인증 정보를 찾지 못하였습니다.", "/sign");
    return;
}
%>
<%@ include file="rsa_generator.jsp" %>
<html lang="ko">
<head>
    <jsp:include page="/WEB-INF/view/head.jsp" flush="false">
		<jsp:param name="title" value="회원가입 | 자유광장" />
	</jsp:include>

    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/layout.css">
    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/auth.css">
</head>
<body>
    <header>
        <a href="/" class="logo"></a>
        <h1 class="header-text">비밀번호를 설정해 주세요!</h1>
    </header>
    <section class="form-container">
        <form method="post" action="https://api.libertysquare.co.kr/account" data-msg="회원가입되었습니다.">
            <input type="hidden" id="m" value="<%= modulus %>" />
            <input type="hidden" id="e" value="<%= exponent %>" />

            <div class="input-field-wrapper">
                <label class="input-label" required>휴대폰 번호</label>
                <input name="id" type="text" class="input-field" autocomplete="off" value="<%= userData.getID() %>" disabled>
                <div class="error-text hidden"></div>
            </div>

            <div class="input-field-wrapper">
                <label class="input-label" required>비밀번호</label>
                <input name="password" type="password" autocomplete="new-password" class="input-field" maxlength="16">
                <div class="error-text hidden"></div>
            </div>

            <p class="disclaimer">
                자유광장에 가입함으로써 <a target="_blank" href="/document/privacy">개인정보 이용약관</a>에 동의합니다.
            </p>

            <button type="submit" class="form-button signup">
                <div class="form-button-text">회원가입</div>
            </button>
        </form>
    </section>
    <jsp:include page="/WEB-INF/view/feedback.html" flush="false" />
</body>
<script type="text/javascript" src="https://ls2020.cafe24.com/assets/rsa/rsalib.min.js"></script>
<script type="text/javascript" src="https://ls2020.cafe24.com/js/ls/auth/password.js"></script>
</html>