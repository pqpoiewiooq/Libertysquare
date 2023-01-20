<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<% String innerPage = "/WEB-INF/view"+uri+".html"; %>
<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/document.css">
<div class="document-container">
    <nav class="lnb">
        <a class="lnb-link" href="/document/help">헬프 데스크</a>
        <a class="lnb-link" href="/document/code-of-conduct">LCOC</a>
        <a class="lnb-link" href="/document/terms">이용약관</a>
        <a class="lnb-link" href="/document/privacy">개인정보처리방침</a>
        <a class="lnb-link" href="/document/payment-agreement">결제정보제공동의</a>
    </nav>
    <!---->
    <div class="document-fomatter">
        <jsp:include page="<%=innerPage%>" flush="false"/>
    </div>
    <script type="text/javascript" src="https://ls2020.cafe24.com/js/document.js"></script>
    <!---->
</div>