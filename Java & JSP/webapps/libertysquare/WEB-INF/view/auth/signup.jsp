<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="servlet.util.ServletHelper"%>
<%@ page import="net.NiceHelper"%>
<%@ page import="net.NiceData"%>
<%
NiceData data = NiceHelper.createRequestData(request, "/checkplus_signup", "/checkplus_fail");

if(data.encData == null) {
    ServletHelper.alert(response.getWriter(), data.msg, "/sign");
    return;
}

String phoneNumber = request.getParameter("p");
%>
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
        <h1 class="header-text">우리 같이 시작해 볼까요?</h1>
    </header>
    <section class="form-container">
        <form name="form_chk" method="post">
            <input type="hidden" name="m" value="checkplusService">
		    <input type="hidden" name="EncodeData" value="<%= data.encData %>">

            <div class="input-field-wrapper">
                <label class="input-label" required>휴대폰 번호</label>
                <input name="id" type="text" class="input-field" autocomplete="off" autofocus>
                <div class="error-text hidden"></div>
            </div>

            <p class="disclaimer">
				자유광장에 가입함으로써 <a target="_blank" href="/document/privacy">개인정보 이용약관</a>에 동의합니다.
            
                자유광장은 본인인증 대행사인 [NICE평가정보]에서 개인정보를 제공받습니다.
            </p>

            <button type="submit" class="form-button signup" disabled>
                <div class="form-button-text">본인인증</div>
            </button>
        </form>
    </section>
    <jsp:include page="/WEB-INF/view/feedback.html" flush="false" />
</body>
<script>
(function() {
    var phoneInput = document.querySelector(".input-field[name='id']");
    phoneInput._value = null;
    var phoneError = phoneInput.nextElementSibling;
    var regPhone = /^01(?:0|1|[6-9])\d{4}\d{4}$/;
    var phoneChecker = InputEventListener.on(['input'], phoneInput, phoneError, 11, "휴대폰 번호를 입력해주세요.", function() { 
        formButton.disabled = true;
        phoneInput._confirm = false;
        
        if(regPhone.test(phoneInput.value)) {
            console.log(phoneInput._value + " != " + phoneInput.value + " = " + (phoneInput._value != phoneInput.value));
            if(phoneInput._value != phoneInput.value) phoneInput.blur();
        } else {
            return "정확한 휴대폰 번호를 입력해주세요";
        }
    });

    var chkForm = document.querySelector('form');
    var formButton = chkForm.querySelector("button");
    var already = false;
    var mChild = null;

    phoneInput.addEventListener('focusout', function() {
        phoneInput.disabled = true;
        phoneInput._value = phoneInput.value;
        var ajaxResult = majax.checkID(phoneInput.value, function(result) {
            phoneInput.disabled = false;
            if(result) {
                phoneInput.classList.add("deny");
                phoneError.classList.remove("hidden");
                phoneError.textContent = "해당 번호가 이미 존재 합니다.";
                phoneInput.focus();
            } else {
                phoneInput.classList.add("confirm");
                formButton.disabled = false;
                //phoneInput._value = checkedValue;
                phoneInput._confirm = true;
                formButton.focus();
            }
        });
        if(!ajaxResult) {
            phoneInput.disabled = false;
        }
    });

    function submitListener(event) {
        event.preventDefault();

        if(formButton.disabled) return;

        if(already) {
            alert('본인인증을 완료해주세요.');
        } else if(!phoneInput._confirm) {
            phoneInput.focus();
        } else {
            already = true;
            phoneInput.disabled = true;
            mChild = window.open('', 'popupChk', 'width=500, height=550, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');
            chkForm.action = "https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb";
            chkForm.target = "popupChk";
            chkForm.submit();
        }
    }
    chkForm.addEventListener('submit', submitListener);

    window.closeChild = function(msg) {
        if(mChild != null) {
            if(msg) alert(msg);
            mChild.close();
        }
        alreay = false;
    };

    window.fowardPasswordPage = function() {
        chkForm.removeEventListener('submit', submitListener);
        chkForm.addEventListener('submit', function(event) {
            event.preventDefault();

            location.href = '/signup-pw';
        });

        location.href = '/signup-pw';
    };

    <% if(phoneNumber != null) { %>
    window.addEventListener("load", function() {
        phoneInput.value = "<%= phoneNumber %>";
        phoneInput.dispatchEvent(new Event("input"));
    });
    <% } %>
}());
</script>
</html>