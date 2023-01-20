<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="servlet.util.RequestParser"%>
<%@page import="net.*"%>
<%@page import="net.FirebaseMessage.*"%>
<%@page import="exception.*"%>
<%@page import="java.util.HashSet"%>
<%
	String resultMsg = null;

	try {
		String[] toArray = RequestParser.getValues(request, "to");
		String title = RequestParser.get(request, "title");
		String body = RequestParser.get(request, "body");
		String redirect = RequestParser.get(request, "redirect", true);

		FirebaseMessageBuilder builder = FirebaseMessage.template(title, body, redirect);

		if(toArray.length == 1) {
			String to = toArray[0];
			if(to.equalsIgnoreCase("all")) { // 전체 대상
				resultMsg = "전체 대상은 아직 개발중입니다.(각 앱 업데이트 필요)";
			} else {// 단일 대상
				builder.to(to);
			}
		} else {// 복수 대상
			HashSet<String> registration_ids = new HashSet<>();
			for(String to : toArray) {
				registration_ids.add(to);
			}
			builder.registration_ids(registration_ids);
		}

		FirebaseSender.send(builder.build());
		resultMsg = "발송되었습니다.";
	} catch(MyServletException se) {
		resultMsg = se.getMessage();
	} catch(Exception e) {
		resultMsg = "알 수 없는 오류가 발생하였습니다.\n" + e.getMessage();
	}
%>

<script>
alert("<%= resultMsg %>");
self.close();
</script>