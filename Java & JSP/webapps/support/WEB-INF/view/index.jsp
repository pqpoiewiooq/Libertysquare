<!DOCTYPE html>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="account.User"%>
<%
	User user = (User) session.getAttribute("user");
%>
<html lang="ko">
<head>
	<jsp:include page="/WEB-INF/view/head.jsp" flush="false"></jsp:include>

	<style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');</style>

	<link href='https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/layout.css">
	<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/list.css">
	<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/search.css">
	<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/index.css">
	
	<script type="text/javascript" src="https://ls2020.cafe24.com/js/support/list.js"></script>
	<script type="text/javascript" src="https://ls2020.cafe24.com/js/popup.js"></script>

	<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8045181453001492" crossorigin="anonymous"></script>
	<meta name="naver-site-verification" content="3408305628097e6c61ba7acdb57944ad69b636ce" />
</head>
<body>
	<div id="top">
		<div class="top-container">
			<img class="logo" src="https://ls2020.cafe24.com/img/ls/logo.png"/>
			<a class="logo-support" href="/">후원</a>
			<ul class="top-link-box">
				<li><a href="/event/new">후원 등록하기</a></li>
				<li><a href="/document/help">헬프 데스크</a></li>
				<% if(user == null) {%>
					<li><a href="/sign">로그인</a></li>
					<li><a href="/signup">회원가입</a></li>
				<% } else { %>
					<div class="btn-mypage" onclick="location.href = '/my/tickets'"><div class="inner2"><%= user.getNickname().substring(user.getNickname().length() - 2) %></div></div>
				<% } %>
			</ul>
		</div>

		<ul class="lnb">
			<!-- li로 바꿀 것(css 포함) -->
			<button onclick="_scroll(0)" selected>추천</button>
			<button onclick="_scroll(1)">최신</button>
			<button onclick="_scroll(2)">베스트</button>
		</ul>
	</div>

	<div id="top_mobile">
		<img class="logo-mobile" src="https://ls2020.cafe24.com/img/ls/logo.png" />
		<a class="logo-support-mobile" href="/">후원</a>
		<% if(user == null) { %>
		<div class="dropdown-btn dropdown-btn-icon"></div>
		<% } else { %>
		<div class="dropdown-btn dropdown-menu-user-icon">
            <div class="dropdown-menu-user-icon-inner">
                <%= user.getNickname().substring(user.getNickname().length() - 2) %>
            </div>
        </div>
		<% } %>
		<div class="header-search-bar-mobile">
			<div class="header-search-icon-mobile"></div>
			<input class="header-search-input-mobile" placeholder="어떤 후원을 찾고 있나요?" readonly />
		</div>
		<ul class="lnb-mobile">
			<!-- li로 바꿀 것(css 포함) -->
			<li onclick="_scroll(0)" selected>추천</li>
			<li onclick="_scroll(1)">최신</li>
			<li onclick="_scroll(2)">베스트</li>
		</ul>
	</div>

	<!-- header -->
	<style>
		header {display:none;}
		@media screen and (min-width: 700px){
			.content-container {
    			padding: 90px 80px 40px;
			}
		}
	</style>
	<header>
		<div class="header-text-box">
			<div class="header-animation-box">
				<span class="header-animation-text first">자유광장</span>에서<br>
				<span class="header-animation-text second">온라인 모임</span>과<br>
				<span class="header-animation-text third">커뮤니티</span>를 만나세요.
			</div>
			<div class="header-text">강의, 모임, 행사 등 여러분이 생각하는 모든 것을 찾으세요.</div>
		</div>
		<div class="header-search-bar">
			<div style="width: 30%; max-width: 300px;">
				<div class="header-search-bar-inner input">
					<div class="header-search-bar-title">검색어</div>
					<input type="text" placeholder="제목, 호스트 이름으로 검색 하세요." class="header-search-bar-input">
				</div>
			</div>
			<div style="width: 22%; max-width: 200px;">
				<div class="header-search-bar-inner select">
					<div class="header-search-bar-title">후원단체 종류</div>
					<div class="header-search-bar-text">전체</div>
				</div>
			</div>
			<div style="width: 23%; max-width: 250px;">
				<div class="header-search-bar-inner select">
					<div class="header-search-bar-title">카테고리</div>
					<div class="header-search-bar-text">전체</div>
				</div>
			</div>

			<div style="width: 100%; max-width: 85px;">
				<div class="header-search-bar-inner select">
					<div class="header-search-bar-title">정기/특별</div>
					<div class="header-search-bar-text">전체</div>
				</div>
			</div>

			<button class="header-search-btn">검색</button>
		</div>
		<div class="header-neon-container">
			<img src="https://ls2020.cafe24.com/img/neon/web.png" style="position:absolute;width:171px;height:172px;top:56px;left:calc(40% - 350px)">
			<img src="https://ls2020.cafe24.com/img/neon/bulb.png" style="position:absolute;width:195px;height:194px;top:179px;left:calc(30% - 410px)">
			<img src="https://ls2020.cafe24.com/img/neon/rocket.png" style="position:absolute;width:156px;height:152px;top:393px;left:calc(30% - 280px)">
			<img src="https://ls2020.cafe24.com/img/neon/bulb2.png" style="position:absolute;width:161px;height:151px;top:88px;left:calc(60% + 150px)">
			<img src="https://ls2020.cafe24.com/img/neon/rocket2.png" style="position:absolute;width:172px;height:175px;top:166px;left:calc(70% + 150px)">
			<img src="https://ls2020.cafe24.com/img/neon/clock.png" style="position:absolute;width:195px;height:191px;top:389px;left:calc(70% + 200px)">
		</div>
	</header>

	<!-- body -->
	<section>
		<article class="content-container">
			<ul class="content-box">
				<li class="content-title">추천 후원</li>
				<li class="content-description">자유광장에서 추천하는 후원입니다!</li>
				<li class="event-container"></li>
			</ul>
		
			<ul class="content-box">
				<li class="content-title">최근 등록된 후원</li>
				<li class="content-description">등록된 지 얼마 안 된 단체를 만나봐요!</li>
				<li class="event-container"></li>
			</ul>
		
			<ul class="content-box">
				<li class="content-title">베스트 후원</li>
				<li class="content-description">자유광장 회원들이 많이 후원하는 단체를 만나봐요!</li>
				<li class="event-container"></li>
			</ul>
		</article>
	</section>

	<!-- bottom -->
	<section class="bottom-container">
		<a href="/events">
			<button class="bottom-btn">모든 후원 보러가기</button>
		</a>
	</section>

	<!-- dropdown menu -->
	<%@ include file="/WEB-INF/view/index-dropdown.jsp" %>

	<!-- footer -->
	<footer>
		<div>
			<img class="footer-logo" src="https://ls2020.cafe24.com/img/ls/logo.png">
			<span class="copylight"><br>© 2020 Libertysqaure, Inc. All rights reserved.</span>
		</div>
		<div>
			<div class="footer-section">
				<ul class="footer-link-container">
					<li><a href="mailto:biz@libertysquare.kr">고객센터: biz@libertysquare.kr</a></li>|
					<li><a href="/document/help">자주 묻는 질문</a></li>|
					<li><a href="/document/code-of-conduct">자유광장 규칙</a></li>|
					<li><a href="/document/terms">이용약관</a></li>|
					<li><a href="/document/privacy">개인정보처리방침</a></li>
				</ul>
			</div>
			<div class="footer-section mobile">
				<a href="mailto:biz@libertysquare.kr"><strong>고객센터: biz@libertysquare.kr</strong></a>
				<br>
				<ul class="footer-link-container">
					<li><a href="/document/help">자주 묻는 질문</a></li>|
					<li><a href="/document/code-of-conduct">자유광장 규칙</a></li>|
					<li><a href="/document/terms">이용약관</a></li>|
					<li><a href="/document/privacy">개인정보처리방침</a></li>
				</ul>
			</div>
		</div>

		<div>
			<div class="footer-section">
				<span class="footer-info-text">주식회사 자유광장</span>|
				<span class="footer-info-text">서울시 노원구 중계로 230, 506-402</span>|
				<span class="footer-info-text">대표 : 신현우</span>|
				<span class="footer-info-text">사업자 등록번호 : 396-87-01750</span>|
				<span class="footer-info-text">2020-서울노원-0804</span>|
				<span class="footer-info-text">대표번호 : 070-8098-7697(문의는 이메일로 주세요)</span>
			</div>
			<div class="footer-section mobile">
				<b>주식회사 자유광장</b>
				<br>
				<span class="footer-info-text">서울시 노원구 중계로 230, 506-402</span>|
				<span class="footer-info-text">대표 : 신현우</span>|
				<span class="footer-info-text">사업자 등록번호 : 396-87-01750</span>|
				<span class="footer-info-text">2020-서울노원-0804</span>|
				<span class="footer-info-text">대표번호 : 070-8098-7697(문의는 이메일로 주세요)</span>
			</div>
		</div>

		<p>자유광장은 통신판매중개자로써 행사에 대한 거래 당사자 및 주최자가 아니며 , 주최자가 등록한 모든 내용과 거래에 대해 자유광장은 일체의 책임을 지지 않습니다.</p>

		<span class="copylight mobile">© 2021 Libertysqaure, Inc. All rights reserved.</span>
	</footer>

	<script type="text/javascript" src="https://ls2020.cafe24.com/js/support/search_dialog.js"></script>
	<script type="text/javascript" src="https://ls2020.cafe24.com/js/support/index.js"></script>
</body>
</html>