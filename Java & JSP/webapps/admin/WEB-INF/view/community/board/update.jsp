<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="servlet.util.RequestParser"%>
<%@page import="exception.*"%>
<%@page import="community.dao.BoardDAO"%>
<%@page import="community.entity.Board"%>
<%@page import="java.lang.reflect.Constructor"%>

<%
	String resultMsg = null;

	Constructor<Board> constructor = null;
	try (BoardDAO dao = new BoardDAO()) {
		int ordinal = RequestParser.getInt(request, "ordinal");
		String name = RequestParser.get(request, "name");
		String ko = RequestParser.get(request, "ko");
		int priority = RequestParser.getInt(request, "priority", null, true);

		constructor = Board.class.getDeclaredConstructor(String.class, int.class, String.class, int.class);
		constructor.setAccessible(true);
		Board updatedBoard = constructor.newInstance(name, ordinal, ko, priority);
		constructor.setAccessible(false);
		constructor = null;

		dao.open();
		dao.update(updatedBoard);
		Board.load();

		resultMsg = "반영되었습니다.";
	} catch(MyServletException se) {
		resultMsg = se.getMessage();
	} catch(Exception e) {
		resultMsg = "알 수 없는 오류가 발생하였습니다.\n" + e.getMessage();
	} finally {
		if(constructor != null) {
			try { constructor.setAccessible(false); } catch(Exception e) {}
		}
	}
%>

<script>
alert("<%= resultMsg %>");
self.close();
</script>