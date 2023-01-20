<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <jsp:include page="/WEB-INF/view/head.jsp" flush="false">
		<jsp:param name="title" value="가입 혹은 로그인 | 자유광장" />
	</jsp:include>
    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/layout.css">
    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/auth.css">
</head>
<body class="sign">
    <header><a href="/" class="logo"></a></header>
    <section class="form-container">
        <form method="post">
            <div class="sign-label">휴대폰 번호</div>
            <input name="id" type="tel" autocomplete="tel" placeholder="-를 제외한 숫자만 기입해 주세요" class="input-field" maxlength="11" autofocus>
            <div class="error-text"></div>
            <button type="submit" class="form-button sign">
                <div class="form-button-text">로그인</div>
            </button>
            <button type="submit" class="form-button blue">
                <div class="form-button-text">회원가입</div>
            </button>
        </form>
    </section>
    <jsp:include page="/WEB-INF/view/feedback.html" flush="false" />
</body>
<script>
(function() {
    const mForm = document.querySelector("form");
    const errorText = document.querySelector(".error-text");
    const inputID = document.querySelector(".input-field");
    var regex = /^01(?:0|1|[6-9])\d{4}\d{4}$/;// - 없고, [010/011/016/017/018/109] + 4 + 4 전화번호만 허용

    // 입력양식 검사
    document.querySelector(".input-field").addEventListener('input', function(){
        if(inputID.value.length == 0) {
            errorText.className = "error-text";
            errorText.textContent = "휴대폰 번호를 입력해주세요";
        } else if(!regex.test(inputID.value)) {
            errorText.className = "error-text";
            errorText.textContent = "정확한 휴대폰 번호를 입력해주세요";
        } else {
            errorText.className = "error-text hidden";
        }
    });

    // 로그인 버튼
    document.querySelector(".form-button.sign").addEventListener('click', function(event){
        event.preventDefault();
        if(regex.test(inputID.value)){
            majax.checkID(inputID.value, function(result) {
                mForm.action = (result === true) ? "/signin" : "/signup?p=" + inputID.value;
                mForm.submit();
            });
        } else {
            inputID.focus();
        }
    });

    document.querySelector(".form-button.blue").addEventListener('click', function(event) {
        event.preventDefault();
        location.href = "/signup";
    });
}());
</script>
</html>