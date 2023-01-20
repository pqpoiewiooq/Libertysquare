<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="servlet.util.ServletHelper"%>
<%@ page import="dao.DAOFactory"%>
<%@ page import="dao.UserDAO"%>
<%@ page import="account.User"%>
<%
// 택 1
// - 아이디 존재 여부 체크. 없으면 alert 후 이동
// - DI 체크, 동일한게 있으면 해당 user 정보를 불러와서 하단 부 실행
User userData = (User) session.getAttribute("checkplus-data2");
if(userData == null) {
    ServletHelper.alert(response.getWriter(), "인증 정보를 찾지 못하였습니다.", "/sign");
    return;
}
session.removeAttribute("checkplus-data2");
session.setAttribute("checkplus-data", userData);

UserDAO dao = DAOFactory.createUserDAO();
if(dao == null) {
    ServletHelper.alert(response.getWriter(), "회원 정보를 불러오는데 문제가 발생하였습니다.", "/sign");
    return;
}

String salt = dao.getSalt(userData.getID());
if(salt == null) {
    ServletHelper.alert(response.getWriter(), "회원 정보를 찾지 못하였습니다.", "/sign");
    return;
}
userData.setSalt(salt);
%>
<%@ include file="rsa_generator.jsp" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <jsp:include page="/WEB-INF/view/head.jsp" flush="false">
		<jsp:param name="title" value="비밀번호 찾기 | 자유광장" />
	</jsp:include>

    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/layout.css">
    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/auth.css">
</head>
<body>
    <header>
        <a href="/" class="logo"></a>
        <h1 class="header-text">비밀번호를 설정해 주세요!</h1>
    </header>
    <form class="form-container" method="PATCH" action="https://api.libertysquare.co.kr/account/password" data-msg="변경되었습니다.">
        <input type="hidden" id="m" value="<%= modulus %>" />
        <input type="hidden" id="e" value="<%= exponent %>" />
        <div class="input-field-wrapper">
            <label class="input-label">휴대폰 번호</label>
            <input name="id" type="text" class="input-field" value="<%= userData.getID() %>" readonly>
        </div>
        <div class="input-field-wrapper">
            <label class="input-label" required>비밀번호</label>
            <input name="password" type="password" autocomplete="new-password" class="input-field" maxlength="16" autofocus>
            <div class="error-text hidden">비밀번호를 입력해주세요</div>
        </div>
        <button type="submit" class="form-button sign">
            <div class="form-button-text">비밀번호 변경</div>
        </button>
    </form>
    <jsp:include page="/WEB-INF/view/feedback.html" flush="false" />
</body>
<script type="text/javascript" src="https://ls2020.cafe24.com/assets/rsa/rsalib.min.js"></script>
<script type="text/javascript" src="https://ls2020.cafe24.com/js/ls/auth/password.js"></script>
</html>