<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="account.User"%>
<% User _user = (User) session.getAttribute("user"); %>
<div class="dropdown-menu-container">
    
    <% if(_user == null) { %>
    <div class="dropdown-menu-header">
        <div class="dropdown-menu-title">플랫탑에 오신 것을 환영합니다.</div>
        <div class="dropdown-menu-close"></div>
    </div>
    <div class="dropdown-menu-body">
        <a class="dropdown-menu-item" href="/">
            <div class="dropdown-menu-item-icon-box">
                <div class="dropdown-menu-item-icon home"></div>
            </div>
            <div class="dropdown-menu-item-text">홈으로</div>
        </a>
        <a class="dropdown-menu-item" href="/search">
            <div class="dropdown-menu-item-icon-box">
                <div class="dropdown-menu-item-icon search"></div>
            </div>
            <div class="dropdown-menu-item-text">글 검색</div>
        </a>
        <a class="dropdown-menu-item" href="/ad">
            <div class="dropdown-menu-item-icon-box">
                <div class="dropdown-menu-item-icon help"></div>
            </div>
            <div class="dropdown-menu-item-text">광고문의</div>
        </a>
    </div>
    <div class="dropdown-menu-footer">
        <a href="/sign">
            <button type="button" class="dropdown-footer-btn">회원가입 · 로그인</button>
        </a>
    </div>
    <% } else { %>
    <div class="dropdown-menu-header login">
        <div class="dropdown-menu-title"><%= _user.getNickname() %>님, 반가워요!</div>
        <div class="dropdown-menu-user-icon">
            <div class="dropdown-menu-user-icon-inner">
                <%= _user.getNickname().substring(_user.getNickname().length() - 2) %>
            </div>
        </div>
        <div class="dropdown-menu-close"></div>
    </div>
    <div class="dropdown-menu-body">
        <a class="dropdown-menu-item" href="/search">
            <div class="dropdown-menu-item-icon-box">
                <div class="dropdown-menu-item-icon search"></div>
            </div>
            <div class="dropdown-menu-item-text">글 검색</div>
        </a>

        <div class="dropdown-menu-divider">내 정보</div>

        <a class="dropdown-menu-item" href="/board/myarticle">
            <div class="dropdown-menu-item-icon-box">
                <div class="dropdown-menu-item-icon events"></div>
            </div>
            <div class="dropdown-menu-item-text">내가 쓴 글</div>
        </a>
        <a class="dropdown-menu-item" href="/board/mycommentarticle">
            <div class="dropdown-menu-item-icon-box">
                <div class="dropdown-menu-item-icon comment"></div>
            </div>
            <div class="dropdown-menu-item-text">댓글 단 글</div>
        </a>
        <a class="dropdown-menu-item" href="/board/myscrap">
            <div class="dropdown-menu-item-icon-box">
                <div class="dropdown-menu-item-icon star"></div>
            </div>
            <div class="dropdown-menu-item-text">내 스크랩</div>
        </a>
        
        <div class="dropdown-menu-divider">설정 및 도움</div>

        <a class="dropdown-menu-item" href="/my/profile">
            <div class="dropdown-menu-item-icon-box">
                <div class="dropdown-menu-item-icon profile"></div>
            </div>
            <div class="dropdown-menu-item-text">프로필</div>
        </a>
        <a class="dropdown-menu-item" href="/ad">
            <div class="dropdown-menu-item-icon-box">
                <div class="dropdown-menu-item-icon help"></div>
            </div>
            <div class="dropdown-menu-item-text">광고문의</div>
        </a>
        
        <a class="dropdown-menu-logout" href="/logout"></a>
    </div>
    <% } %>
</div>