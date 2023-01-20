<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="account.User"%>
<%
    // import로 인한 충돌 방지를 위해 변수명을 조금 다르게 설정
    User hUser = (User) session.getAttribute("user");
    boolean isLoginHeader = (hUser != null);
%>
<header class="gnb-wrapper">
    <nav id="gnb">
        <div class="gnb-left">
            <a class="gnb-link" href="/event/new">후원 등록하기</a>
        </div>

        <a href="/"><img class="gnb-logo" src="https://ls2020.cafe24.com/img/ls/logo.png" /></a>

        <div class="gnb-right">
            <a class="gnb-link" href="/document/help">Help Desk</a>
            <a class="gnb-btn" href=<%= (hUser == null) ? "/sign>가입 혹은 로그인" : "/my/tickets>"+hUser.getNickname()%></a>

            <svg class="gnb-icon valign-down" viewBox="0 0 448 512" height="1.33em" width="1.33em" aria-hidden="true" focusable="false" fill="currentColor">
                <path fill="currentColor" d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
            </svg>
        </div>
    </nav>
    <nav id="gnbDropdown">
        <% if(hUser == null) {%>
            <a href="/sign">가입 또는 로그인</a>
            <hr class="gnb-hr">
            <a href="/event/new">후원 등록하기</a>
            <a href="/document/help">Help Desk</a>
        <% } else { %>
            <a href="/my/profile">프로필</a>
            <a href="/my/hosts">호스트</a>
            <hr class="gnb-hr">
            <a href="/my/tickets">결제 내역</a>
            <a href="/my/events">주최 내역</a>
            <a href="/event/new">행사 주최하기</a>
            <hr class="gnb-hr">
            <a href="/document/help">Help Desk</a>
            <a href="/logout">로그아웃</a>
        <% } %>
    </nav>
</header>