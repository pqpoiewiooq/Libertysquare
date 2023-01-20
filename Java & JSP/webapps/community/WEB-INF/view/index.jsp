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
	<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/flattop/layout.css">
	<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/flattop/community.css">
	<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/flattop/index.css">
	<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/search.css">

	<script type="text/javascript" src="https://ls2020.cafe24.com/js/popup.js"></script>
	<script type="text/javascript" src="https://ls2020.cafe24.com/js/googleads.js"></script>
	
	<meta name="naver-site-verification" content="00268195f5b05586c9d3f5095877a9e391065030" />
</head>
<body>
	<div id="top">
		<div class="top-container">
			<img class="logo" src="https://ls2020.cafe24.com/img/flattop/logo.svg"/>
			<ul class="top-link-box">
				<li><a href="/ad">광고문의</a></li>
				<% if(user == null) {%>
					<li><a href="/sign">로그인</a></li>
					<li><a href="/sign">회원가입</a></li>
				<% } else { %>
					<div class="btn-mypage" onclick="location.href = '/my/tickets'"><div class="inner2"><%= user.getNickname().substring(user.getNickname().length() - 2) %></div></div>
				<% } %>
			</ul>
		</div>
	</div>

	<div id="top_mobile">
		<img class="logo-mobile" src="https://ls2020.cafe24.com/img/flattop/logo.svg" />
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
			<input class="header-search-input-mobile" placeholder="어떤 글을 찾고 있나요?" readonly />
		</div>
	</div>

	<section id="container" class="index">
		<!--
		<article id="banner" class="mobileonly">
			<a>
				<img src="https://cf-eba.everytime.kr/20220101_Naver12_Sports_home.png"/>
			</a>
		</article>
		-->

		<aside id="leftside">
			<div class="card pconly">
				<form class="logged">
					<% if(user == null) { %>
						<img src="https://ls2020.cafe24.com/img/anonym.png" class="picture">
						<ul class="buttons">
							<li><a class="login" href="/sign">로그인</a></li>
							<li><a class="signup" href="/sign">회원가입</a></li>
						</ul>
					<% } else { %>
						<img src="<%= user.getProfilePath() %>" class="picture">
						<p class="nickname"><%= user.getNickname() %></p>
						<ul class="buttons">
							<li><a href="/my/profile">프로필</a></li>
							<li><a href="/logout">로그아웃</a></li>
						</ul>
					<% } %>
					<hr />
				</form>
			</div>
			
			<div class="card">
				<div class="menus">
					<a href="/board/myarticle" class="list">내가 쓴 글</a>
					<a href="/board/mycommentarticle" class="comment">댓글 단 글</a>
					<a href="/board/myscrap" class="like">내 스크랩</a>
					<hr />
				</div>
			</div>

			<!--
			<div class="card">
				<div class="banner">
				<a href="https://ad.everytime.kr/adClick?adToken=cybx1b1Z7aoontPdY3e7BxhO8PtiUQHrPkoFvKeonQgWo%2Fenahx4vJ2Ak1K2rohyTC%2BH1s9oi4w6Ezr1plnn6EgvmP83muheemDwXJ0J%2BWL%2FQKC4%2F5p41pNGQvIiUDkue4vQa%2B5jKFJhr2vpmaLCuMa%2BsZamFQYL5iK6LtyZzM32kQiwPqXC1gtoVW4k9bbsdBhfNSoY0iYPAVWjwAmjPo8Jem6DBmqQGgYwls30bqdc1tZeMI7aOAQfkhSvPFUG"><img src="https://cf-eba.everytime.kr/20220111_unistudy_gift_card.png"></a>
				</div>
			</div>
			-->
		</aside>

		
		<article id="main">
			<!--
			<article id="banner" class="pconly">
				<a>
					<img src="https://cf-eba.everytime.kr/20220101_Naver12_Sports_home.png"/>
				</a>
			</article>
			-->
			<div class="loading-container">
				<svg viewBox="0 0 512 512" height="60" width="60" aria-hidden="true" focusable="false" fill="currentColor" class="loading-inner"><path fill="currentColor" d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"></path></svg>
			</div>
		</article>

		<aside id="rightside">
			<form class="search pconly"><input type="text" name="keyword" placeholder="전체 게시판의 글을 검색하세요!" class="text"></form>
			<div class="loading-container pconly">
				<svg viewBox="0 0 512 512" height="60" width="60" aria-hidden="true" focusable="false" fill="currentColor" class="loading-inner"><path fill="currentColor" d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"></path></svg>
			</div>
		</aside>

	</section>

	<jsp:include page="/WEB-INF/view/footer.html" flush="false" />
	<%@ include file="/WEB-INF/view/index-dropdown.jsp" %>

	<script type="text/javascript" src="https://ls2020.cafe24.com/js/flattop/index.js"></script>
</body>
</html>