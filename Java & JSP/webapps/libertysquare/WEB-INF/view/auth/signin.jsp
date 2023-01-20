<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    String id = request.getParameter("id");

    if(id == null || id.length() == 0){
        out.println("<script>");
        out.println("alert('잘못된 접근입니다.');");
        out.println("location.href = '/index';");
        out.println("</script>");
    }
%>
<%@ include file="rsa_generator.jsp" %>
<html lang="ko">
<head>
    <jsp:include page="/WEB-INF/view/head.jsp" flush="false">
		<jsp:param name="title" value="로그인 | 자유광장" />
	</jsp:include>

    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/layout.css">
    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/auth.css">
</head>
<body>
    <header>
        <a href="/" class="logo"></a>
        <h1 class="header-text">다시 만나서 정말 반가워요!</h1>
    </header>
    <form class="form-container" method="POST" action="/login">
        <input type="hidden" id="m" value="<%= modulus %>" />
        <input type="hidden" id="e" value="<%= exponent %>" />

        <div class="input-field-wrapper">
            <label class="input-label">휴대폰 번호</label>
            <input name="id" type="text" class="input-field" value="<%= id %>" readonly>
        </div>
        <div class="input-field-wrapper">
            <label class="input-label" required>비밀번호</label>
            <input name="password" type="password" autocomplete="new-password" class="input-field" maxlength="16" autofocus>
            <div class="error-text hidden">비밀번호를 입력해주세요</div>
        </div>
        <button type="submit" class="form-button sign">
            <div class="form-button-text">로그인</div>
        </button>
        <a class="text-link" href="/password">비밀번호를 잊으셨나요?</a>
    </form>
    <jsp:include page="/WEB-INF/view/feedback.html" flush="false" />
</body>
<script type="text/javascript" src="https://ls2020.cafe24.com/assets/rsa/rsalib.min.js"></script>
<script type="text/javascript" src="https://ls2020.cafe24.com/js/ls/auth/password.js"></script>
<script>
(function() {
    var findPwButton = document.querySelector(".text-link");
    var already = false;
    var mChild = null;
    function openPasswordCheckplus(event) {
        event.preventDefault();

        if(already) {
            alert('본인인증을 완료해주세요.');
        } else {
            already = true;
            mChild = window.open('', 'popupChk', 'width=500, height=550, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');
            
            majax.do("https://api.libertysquare.co.kr/checkplus?type=pw", "GET", undefined, function(xhr) {
                var chkForm = document.createElement("form");
                
                var m = document.createElement("input");
                m.type = "hidden";
                m.name = "m";
                m.value = "checkplusService";
                chkForm.append(m);
                
                var encodeData = document.createElement("input");
                encodeData.type = "hidden";
                encodeData.name = "EncodeData";
                encodeData.value = xhr.responseText;
                chkForm.append(encodeData);

                document.body.append(chkForm);

                chkForm.action = "https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb";
                chkForm.target = "popupChk";
                chkForm.submit();
            }, function(xhr) {
                mChild.alert("인증 모듈을 불러오지 못하였습니다.\n" + xhr.responseText);
                closeChild();
            });
        }
    }

    findPwButton.addEventListener('click', openPasswordCheckplus);

    window.closeChild = function(msg) {
        if(mChild != null) {
            if(msg) alert(msg);
            mChild.close();
        }
        alreay = false;
    };

    window.fowardPasswordPage = function() {
        findPwButton.removeEventListener('submit', openPasswordCheckplus);
        findPwButton.addEventListener('submit', function(event) {
            event.preventDefault();

            location.href = '/password';
        });

        location.href = '/password';
    };
}());
</script>
</html>