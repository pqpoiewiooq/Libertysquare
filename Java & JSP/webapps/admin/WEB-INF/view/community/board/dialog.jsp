<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@page import="servlet.util.RequestParser"%>
<%@page import="community.entity.Board"%>
<%@page import="exception.*"%>

<%
	try {
		int ordinal = RequestParser.getInt(request, "ordinal");
		Board board = Board.ordinalOf(ordinal);

		int priority = board.priority();
		pageContext.setAttribute("board", board);
		pageContext.setAttribute("ko", board.ko());
		pageContext.setAttribute("name", board.name());
		if(priority > 0) pageContext.setAttribute("priority", priority);
	} catch(MyServletException se) {
	} catch(Exception e) {
		%><script>alert('잘못된 요청입니다.');</script><%
		return;
	}
%>


<t:dialog title="게시판 관리">
	<form>
		<section>
			<h2 required>이름 (한국어)</h2>
			<input type="text" name="ko" value="${ko}">
			<mark></mark>
		</section>

		<section>
			<h2 required>이름 (영어 대문자)</h2>
			<input type="text" name="name" value="${name}">
			<mark></mark>
		</section>
		
		<section>
			<h2>우선 순위 (낮을수록 상단에 표시)</h2>
			<input type="number" name="priority" placeholder="0 또는 빈 값인 경우, Main에 표시되지 않음." value="${priority}">
			<mark></mark>
		</section>

		<t:ifElse test="${empty board}">
			<jsp:attribute name="then">
				<button type="submit" name="send" disabled>추가</button>
			</jsp:attribute>
			<jsp:attribute name="else">
				<input type="hidden" name="ordinal" value="${board.ordinal()}">

				<button type="button" name="_delete">삭제</button>
				<button type="submit" name="send">변경</button>
			</jsp:attribute>
		</t:ifElse>
	</form>

	<script>
		addEventListener('DOMContentLoaded', () => {
			const form = getForm();
			const { ko, name, priority, send, _delete } = form;

			const REGEX_EN_CAPITAL = /^[A-Z_]+$/;
			const ERROR_EN_CAPITAL = '영어 대문자, Underbar(_)만 입력 가능합니다.';

			const REGEX_NUM = /(^$)|(^\d+$)/;
			const ERROR_NUM = '정수만 입력 가능합니다.';
			function evaluate() {
				let disabled = Validator.isEmpty(ko);
				disabled = Validator.isEmptyAndTest(name, REGEX_EN_CAPITAL, ERROR_EN_CAPITAL) && disabled;
				disabled = Validator.test(priority, REGEX_NUM, ERROR_NUM) && disabled;

				send.disabled = !disabled;
			}

			ko.addEventListener('input', evaluate);
			name.addEventListener('input', evaluate);
			priority.addEventListener('input', evaluate);
			evaluate();

			if(_delete) {
				_delete.addEventListener('click', () => {
					const data = new FormData(form);
					post('delete', data);
				});
			}

			form.addEventListener('submit', (e) => {
				e.preventDefault();

				const data = new FormData(form);
				post(_delete ? 'update' : 'insert', data);
			});
		});
	</script>
</t:dialog>