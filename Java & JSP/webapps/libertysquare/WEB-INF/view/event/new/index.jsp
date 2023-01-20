<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/event_new.css">
<div class="event-new-container">
    <section class="event-new-header">
        <article>
            <h1 class="event-new-title">행사 주최하기</h1>
            <p class="event-new-desc">
                새로운 행사를 주최하기 위해선 다음 단계들이 필요해요!
                <br>
                행사를 만들면 바로 게시됩니다.
            </p>
            <div class="event-new-step-wrapper">
                <span class="event-new-step-box accent current">
                    <span class="event-new-step-text">1. 주최할 호스트 선택</span>
                    <span class="event-new-step-divider"></span>
                </span>
                <span class="event-new-step-box">
                    <span class="event-new-step-text">2. 행사 종류 선택</span>
                    <span class="event-new-step-divider"></span>
                </span>
                <span class="event-new-step-box">
                    <span class="event-new-step-text">3. 행사 정보 및 티켓 설정</span>
                </span>
            </div>
        </article>
        <img class="event-new-img" src="https://ls2020.cafe24.com/img/new-background.png"/>
    </section>
    <section class="event-new-body">
        <% if("/event/new".equals(uri)) { %>
            <%@ include file="/WEB-INF/view/event/new/select-host.jsp" %>
        <% } else if("/event/new/organization".equals(uri) || uri.startsWith("/event/new/organization/")) { %>
            <%@ include file="/WEB-INF/view/event/new/host.jsp" %>
        <% } else if("/event/new/select-type".equals(uri)) { %>
            <%@ include file="/WEB-INF/view/event/new/select-type.jsp" %>
        <% } else if("/event/new/info".equals(uri)){%>
            <%@ include file="/WEB-INF/view/event/new/info.jsp" %>
        <% } else { response.sendError(HttpServletResponse.SC_NOT_FOUND); }%>
    </section>
</div>
<script type="text/javascript" src="https://ls2020.cafe24.com/js/ls/event/new.js"></script>