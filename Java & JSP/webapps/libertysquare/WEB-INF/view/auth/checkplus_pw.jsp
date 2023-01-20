<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="net.NiceHelper"%>
<%@ page import="net.NiceData"%>
<script>
<%
NiceData data = NiceHelper.getResultData(request);

if(data.userData == null) { %>
	alert("<%= data.msg %>");
<% } else {
	session.setAttribute("checkplus-data2", data.userData);
%>
	window.onload = function() {
		if(opener == null) {
			location.href = '/';
		} else {
			opener.closeChild();
			opener.fowardPasswordPage();
		}
	}
<% } %>
</script>