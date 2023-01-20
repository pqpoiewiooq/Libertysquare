<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="account.User"%>
<% User user = (User) session.getAttribute("user"); %>
<%@ include file="/WEB-INF/view/auth/rsa_generator.jsp" %>
<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/host.css">
<section class="mypage-profile-section">
    <h1 class="mypage-profile-header">기본 정보</h1>
    <form>
        <div class="input-field-wrapper">
            <label class="input-label" required>닉네임</label>
            <input name="nickname" type="text" class="input-field" autocomplete="nickname" maxlength="14" value="<%= user.getNickname() %>">
            <div class="error-text hidden"></div>
        </div>

        <div class="host-edit-form-field">
            <div class="host-edit-form-title">프로필 이미지</div>
            <div class="host-edit-form-sub-title">10MB이하의 이미지만 업로드 되며 이미지를 눌러 변경할 수 있습니다.</div>
            <div class="host-edit-form-body" style="margin-top: 20px;">
                <div class="host-edit-form-image-container">
                    <div class="host-edit-form-image profile" style="<%="background: url(" + user.getProfilePath() + "?dt=" + System.currentTimeMillis() + ") center center / cover no-repeat"%>"></div>
                </div>
            </div>
        </div>

        <button type="submit" class="confirm-btn js-form-info">수정하기</button>
    </form>
</section>

<section class="mypage-profile-section">
    <h1 class="mypage-profile-header">비밀번호 변경</h1>
    <form>
        <input type="hidden" id="m" value="<%= modulus %>" />
        <input type="hidden" id="e" value="<%= exponent %>" />
        <div class="input-field-wrapper">
            <label class="input-label">새로운 비밀번호</label>
            <input name="password" type="password" autocomplete="new-password" class="input-field" maxlength="16">
            <div class="error-text hidden"></div>
        </div>
        <div class="input-field-wrapper">
            <label class="input-label">동일하게 재입력</label>
            <input name="_password" type="password" autocomplete="new-password" class="input-field" maxlength="16">
            <div class="error-text hidden"></div>
        </div>
        <div class="input-field-wrapper">
            <label class="input-label">현재 비밀번호</label>
            <input name="current_password" type="password" autocomplete="off" class="input-field" maxlength="16">
        </div>
        <button type="submit" class="confirm-btn js-form-pw">변경하기</button>
    </form>
</section>

<section class="mypage-profile-section">
    <h1 class="mypage-profile-header">회원 탈퇴</h1>
    <form><button type="submit" class="form-button js-form-withdraw" style="width: auto">탈퇴요청</button></form>
</section>
<script type="text/javascript" src="https://ls2020.cafe24.com/assets/rsa/rsalib.min.js"></script>
<script type="text/javascript" src="https://ls2020.cafe24.com/js/ls/my/profile.js"></script>