<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="servlet.util.RequestParser"%>
<%@page import="exception.*"%>
<%@page import="community.dao.BoardDAO"%>
<%@page import="community.entity.Board"%>

<%
	String resultMsg = null;

	try (BoardDAO dao = new BoardDAO()) {
		int ordinal = RequestParser.getInt(request, "ordinal");

		dao.open();
		dao.delete(ordinal);
		Board.load();

		resultMsg = "삭제되었습니다.";
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