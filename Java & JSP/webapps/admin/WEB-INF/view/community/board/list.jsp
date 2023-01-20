<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@page import="dao.*"%>
<%@page import="community.entity.Board"%>
<%@page import="servlet.util.*"%>
<%@page import="java.util.Arrays"%>

<% pageContext.setAttribute("boards", Arrays.asList(Board.values)); %>

<t:template title="게시판">
	<jsp:body>
		<div class="panel-container">
			<div class="panel active">게시판</div>
		</div>

		<table class="tool-box">
			<thead>
				<tr>
					<td><span>No.</span></td>
					<td><span>이름 (KO)</span></td>
					<td><span>이름 (EN/UpperCase)</span></td>
					<td><span>우선 순위(Main 게시용)</span></td>
					<td><button type="button" class="edit" onclick="openDialog('/community/board/dialog', '게시판 추가')">추가</button></td>
				</tr>
			</thead>

			<tbody>
				<t:forEach var="board" items="${boards}">
					<tr>
						<td><span>${board.ordinal()}</span></td>
						<td><span>${board.ko()}</span></td>
						<td><span>${board.name()}</span></td>
						<td><span>${board.priority() == 0 ? null : board.priority() += "번째"}</span></td>
						<td><button type="button" onclick="openDialog('/community/board/dialog?ordinal=${board.ordinal()}', '게시판 관리')">변경</button></td>
					</tr>
				</t:forEach>
			</tbody>
		</table>

	</jsp:body>
</t:template>