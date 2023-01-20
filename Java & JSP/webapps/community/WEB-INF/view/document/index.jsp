<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<% String innerPage = "/WEB-INF/view"+uri+".html"; %>
<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/flattop/document.css">
<div class="document-formatter">
	<jsp:include page="<%=innerPage%>" flush="false"/>
</div>