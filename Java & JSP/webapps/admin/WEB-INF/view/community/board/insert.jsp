<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="servlet.util.RequestParser"%>
<%@page import="exception.*"%>
<%@page import="community.dao.BoardDAO"%>
<%@page import="community.entity.Board"%>

<%
	String resultMsg = null;

	try (BoardDAO dao = new BoardDAO()) {
		String name = RequestParser.get(request, "name");
		String ko = RequestParser.get(request, "ko");
		int priority = RequestParser.getInt(request, "priority", null, true);

		dao.open();
		dao.insert(name, ko, priority);
		Board.load();

		resultMsg = "추가되었습니다.";
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