<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="net.NiceHelper"%>
<%@ page import="net.NiceData"%>
<script>
<%
NiceData data = NiceHelper.getResultData(request);

if(data.userData == null) { %>
	alert("<%= data.msg %>");
<% } else {
	session.setAttribute("checkplus-data", data.userData);
%>
	window.onload = function() {
		if(opener == null) {
			location.href = '/';
		} else {
			var nPhoneNumber = "<%= data.userData.getID() %>";
			var uPhoneNumberInput = opener.document.querySelector(".input-field[name='id']");
			if(!uPhoneNumberInput) {
				opener.closeChild('입력하신 정보를 찾는데 실패하였습니다.');
				return;
			}
			var uPhoneNumber = opener.document.querySelector(".input-field[name='id']")._value;
		
			if(nPhoneNumber == uPhoneNumber){
				opener.closeChild();
				opener.fowardPasswordPage();
			} else {
				opener.closeChild('입력하신 정보와 인증 정보가 다릅니다');
			}
		}
	}
<% } %>
</script>