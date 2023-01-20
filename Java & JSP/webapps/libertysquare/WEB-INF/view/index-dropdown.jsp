<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="account.User"%>
<% User _user = (User) session.getAttribute("user"); %>
<div class="dropdown-menu-container">
    
    <% if(_user == null) { %>
    <div class="dropdown-menu-header">
        <div class="dropdown-menu-title">행사 플랫폼 자유광장에 오신 것을 환영합니다.</div>
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
            <div class="dropdown-menu-item-text">행사 및 호스트 검색</div>
        </a>
        <a class="dropdown-menu-item" href="/event/new">
            <div class="dropdown-menu-item-icon-box">
                <div class="dropdown-menu-item-icon star"></div>
            </div>
            <div class="dropdown-menu-item-text">행사 주최하기</div>
        </a>
        <a class="dropdown-menu-item" href="/document/help">
            <div class="dropdown-menu-item-icon-box">
                <div class="dropdown-menu-item-icon help"></div>
            </div>
            <div class="dropdown-menu-item-text">도움이 필요하신가요?</div>
        </a>
    </div>
    <div class="dropdown-menu-footer">
        <a href="/sign">
            <button type="button" class="footer-btn">회원가입 · 로그인</button>
        </a>
    </div>
    <% } else { %>
    <div class="dropdown-menu-header login">
        <!--<div class="dropdown-menu-logo">자유광장</div>-->
        <div class="dropdown-menu-title"><%= _user.getNickname() %>님, 반가워요!</div>
        <div class="dropdown-menu-user-icon">
            <div class="dropdown-menu-user-icon-inner">
                <%= _user.getNickname().substring(_user.getNickname().length() - 2) %>
            </div>
        </div>
        <div class="dropdown-menu-close"></div>
    </div>
    <div class="dropdown-menu-body">
        <a class="dropdown-menu-item" href="/my/tickets">
            <div class="dropdown-menu-item-icon-box">
                <div class="dropdown-menu-item-icon tickets"></div>
            </div>
            <div class="dropdown-menu-item-text">구입한 티켓</div>
        </a>
        <a class="dropdown-menu-item" href="/search">
            <div class="dropdown-menu-item-icon-box">
                <div class="dropdown-menu-item-icon search"></div>
            </div>
            <div class="dropdown-menu-item-text">행사 및 호스트 검색</div>
        </a>

        <div class="dropdown-menu-divider">호스팅</div>

        <a class="dropdown-menu-item" href="/my/hosts">
            <div class="dropdown-menu-item-icon-box">
                <div class="dropdown-menu-item-icon hosts"></div>
            </div>
            <div class="dropdown-menu-item-text">내 호스트</div>
        </a>
        <a class="dropdown-menu-item" href="/event/new">
            <div class="dropdown-menu-item-icon-box">
                <div class="dropdown-menu-item-icon star"></div>
            </div>
            <div class="dropdown-menu-item-text">행사 주최하기</div>
        </a>
        <a class="dropdown-menu-item" href="/my/events">
            <div class="dropdown-menu-item-icon-box">
                <div class="dropdown-menu-item-icon events"></div>
            </div>
            <div class="dropdown-menu-item-text">내가 주최한 행사</div>
        </a>
        
        <div class="dropdown-menu-divider">설정 및 도움</div>

        <a class="dropdown-menu-item" href="/my/profile">
            <div class="dropdown-menu-item-icon-box">
                <div class="dropdown-menu-item-icon profile"></div>
            </div>
            <div class="dropdown-menu-item-text">프로필</div>
        </a>
        <a class="dropdown-menu-item" href="/document/help">
            <div class="dropdown-menu-item-icon-box">
                <div class="dropdown-menu-item-icon help"></div>
            </div>
            <div class="dropdown-menu-item-text">도움이 필요하신가요?</div>
        </a>
        
        <a class="dropdown-menu-logout" href="/logout"></a>
    </div>
    <% } %>
</div>