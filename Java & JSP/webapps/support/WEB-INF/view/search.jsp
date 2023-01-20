<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="ko">
<head>
    <jsp:include page="/WEB-INF/view/head.jsp" flush="false">
		<jsp:param name="title" value="자유후원 | 검색" />
	</jsp:include>
    
    <link href='https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/layout.css">
    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/list.css">
    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/search.css">
    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/index.css">

    <script type="text/javascript" src="https://ls2020.cafe24.com/js/support/list.js"></script>
</head>
<body>
    <div class="mobileView">
        <div class="default-flex-box search-container">
            <div class="default-flex-box search-bar">
                <svg class="js-return-btn" width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-top:-5px"><path d="M24 10.5H5.745L14.13 2.115L12 0L0 12L12 24L14.115 21.885L5.745 13.5H24V10.5Z" fill="#000"></path></svg>
                <div class="default-flex-box search-input-box">
                    <div class="search-input-icon-wrapper"><svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.4406 14.5269C11.5499 14.5269 14.8812 11.2749 14.8812 7.26344C14.8812 3.25195 11.5499 0 7.4406 0C3.33127 0 0 3.25195 0 7.26344C0 11.2749 3.33127 14.5269 7.4406 14.5269Z" fill="#BDBDBD"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M7.44056 12.0466C9.98443 12.0466 12.0466 9.98443 12.0466 7.44056C12.0466 4.89669 9.98443 2.83447 7.44056 2.83447C4.89669 2.83447 2.83447 4.89669 2.83447 7.44056C2.83447 9.98443 4.89669 12.0466 7.44056 12.0466Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.6577 12.2866L12.6606 10.3059L17 14.5975L14.9972 16.5782L10.6577 12.2866Z" fill="#BDBDBD"></path></svg></div>
                    <form action="#">
                        <input type="search" name="q_search" placeholder="제목, 채널 이름으로 검색하세요." class="search-input" autofocus>
                    </form>
                </div>
                <button class="search-btn">
                    <svg width="18" height="18" viewBox="0 0 19 19" fill="none" style="margin-top: 2px;"><path d="M15.0709 8.08817C15.0709 11.6928 12.0672 14.6763 8.28544 14.6763C4.50366 14.6763 1.5 11.6928 1.5 8.08817C1.5 4.48349 4.50366 1.5 8.28544 1.5C12.0672 1.5 15.0709 4.48349 15.0709 8.08817Z" stroke="#ffffff" stroke-width="3"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M11.8672 13.6816L14.0974 11.476L18.9297 16.2549L16.6994 18.4605L11.8672 13.6816Z" fill="#fff"></path></svg>
                </button>
            </div>
            <div class="search-filter-text"></div>
        </div>

        <div class="default-flex-box search-filter-header-container">
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.3571 8.35729H6.98014C6.63153 6.98756 5.23852 6.15978 3.86874 6.50839C2.96036 6.73959 2.25104 7.44891 2.01984 8.35729H0.642869C0.287816 8.35729 0 8.64511 0 9.00016C0 9.35522 0.287816 9.64299 0.642869 9.64299H2.01988C2.36849 11.0127 3.7615 11.8405 5.13128 11.4919C6.03966 11.2607 6.74898 10.5514 6.98018 9.64299H17.3571C17.7122 9.64299 18 9.35518 18 9.00012C18 8.64507 17.7122 8.35729 17.3571 8.35729ZM4.50001 10.2859C3.78994 10.2859 3.21431 9.71023 3.21431 9.00016C3.21431 8.29009 3.78994 7.71446 4.50001 7.71446C5.21008 7.71446 5.78571 8.29009 5.78571 9.00016C5.78571 9.71023 5.21008 10.2859 4.50001 10.2859Z" fill="#212121"></path><path d="M17.3571 1.92809H15.3373C14.9887 0.558358 13.5957 -0.269421 12.2259 0.0791909C11.3175 0.310393 10.6082 1.01971 10.377 1.92809H0.642869C0.287816 1.92809 0 2.21591 0 2.57096C0 2.92602 0.287816 3.21383 0.642869 3.21383H10.377C10.7256 4.58357 12.1186 5.41135 13.4884 5.06274C14.3968 4.83153 15.1061 4.12222 15.3373 3.21383H17.3571C17.7122 3.21383 18 2.92602 18 2.57096C18 2.21591 17.7122 1.92809 17.3571 1.92809ZM12.8572 3.85667C12.1471 3.85667 11.5715 3.28103 11.5715 2.57096C11.5715 1.8609 12.1471 1.28526 12.8572 1.28526C13.5672 1.28526 14.1429 1.8609 14.1429 2.57096C14.1429 3.28103 13.5672 3.85667 12.8572 3.85667Z" fill="#212121"></path><path d="M17.3571 14.7855H14.0516C13.7029 13.4158 12.3099 12.588 10.9402 12.9366C10.0318 13.1678 9.32245 13.8771 9.09125 14.7855H0.642869C0.287816 14.7855 0 15.0733 0 15.4283C0 15.7834 0.287816 16.0712 0.642869 16.0712H9.09129C9.4399 17.441 10.8329 18.2687 12.2027 17.9201C13.1111 17.6889 13.8204 16.9796 14.0516 16.0712H17.3571C17.7122 16.0712 18 15.7834 18 15.4283C18 15.0733 17.7122 14.7855 17.3571 14.7855ZM11.5714 16.7141C10.8614 16.7141 10.2857 16.1385 10.2857 15.4284C10.2857 14.7183 10.8614 14.1427 11.5714 14.1427C12.2815 14.1427 12.8571 14.7183 12.8571 15.4284C12.8571 16.1385 12.2815 16.7141 11.5714 16.7141Z" fill="#212121"></path></svg>
            <div class="search-filter-header-title">필터 걸기</div>
            <button class="search-filter-init-btn">초기화</button>
        </div>
    </div>

    <footer class="search-footer">
        <div class="search-filter-text footer"></div>
        <button class="footer-btn">검색</button>
    </footer>

    <div class="search-top-container">
        <a href="/" class="search-top-logo"></a>

        <button type="button" class="search-top-btn">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3.53564" width="25" height="5" transform="rotate(45 3.53564 0)" fill="#000"></rect>
                <rect y="17.6777" width="25" height="5" transform="rotate(-45 0 17.6777)" fill="#000"></rect>
            </svg>
        </button>
    </div>

    <div class="search-header-container">
        <div class="search-header-input-container">
            <input type="text" value="" placeholder="제목, 채널 이름으로 검색하세요." class="search-header-input">
            <button type="button" class="search-header-input-btn"></button>
        </div>
        <div class="search-header-result-text">총 <u>0</u> 개의 검색결과</div>

        <div class="search-header-filter-container">
            <div class="search-filter-category-wrapper">
                <button class="search-filter-category-btn">후원 유형</button>
            </div>
            <div class="search-filter-category-wrapper">
                <button class="search-filter-category-btn">카테고리</button>
            </div>
        </div> 
    </div>

    <div class="top_mobile search">
        <img class="logo-mobile search" src="https://ls2020.cafe24.com/img/ls/logo.png" />
        <div class="dropdown-btn search"></div>
        <div class="header-search-bar-mobile search">
            <div class="header-search-icon-mobile search"></div>
            <input class="header-search-input-mobile search" placeholder="어떤 행사를 찾고 있나요?" readonly />
        </div>
    </div>

    <div class="content-container search">
        <ul class="content-box">
            <li class="content-title">행사</li>
            <li class="content-description">검색어와 가장 유사한 행사입니다.</li>
            <li class="event-container"></li>
        </ul>
        
        <ul class="content-box">
            <li class="content-title">호스트</li>
            <li class="content-description">검색어와 가장 유사한 호스트입니다.</li>
            <li class="event-container"></li>
        </ul>
    </div>

    <!-- dropdown menu -->
	<%@ include file="/WEB-INF/view/index-dropdown.jsp" %>
    
    <script type="text/javascript" src="https://ls2020.cafe24.com/js/support/search_dialog.js"></script>
    <script type="text/javascript" src="https://ls2020.cafe24.com/js/support/search.js"></script>
</body>
</html>