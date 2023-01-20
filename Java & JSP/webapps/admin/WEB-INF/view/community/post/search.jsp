<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@page import="java.util.*"%>
<%@page import="java.net.URLEncoder"%>
<%@page import="dao.*"%>
<%@page import="community.dao.*"%>
<%@page import="community.entity.*"%>
<%@page import="servlet.util.*"%>
<%@page import="util.*"%>

<%
	/* parameter parsing */
	String keyword = RequestParser.get(request, "keyword", true);
	int _page = 1;// page 라는 이름으로 기본 내장 객체가 있어서 _ 추가
	try {
		_page = RequestParser.getInt(request, "page", null, true);
		if(_page < 1) _page = 1; 
	} catch(Exception e) {}

	// dao
	List<Post> list;
	try (PostDAO dao = DAOFactory.create(PostDAO.class)) {
		//list = dao.search(null, typeArray, boardArray, keyword, _page)
		list = dao.search(null, null, null, keyword, _page);
	} catch(Exception e) {
		e.printStackTrace(response.getWriter());
		list = new ArrayList<>();
	}

	pageContext.setAttribute("keyword", keyword);
	//pageContext.setAttribute("types", types);
	pageContext.setAttribute("list", list);

	// pagination 용
	String query = "?";
	if(keyword != null) {
		query += "keyword=" + URLEncoder.encode(keyword) + "&";
	}
	/*
	if(types != null) {
		for(SearchType type : types) {
			query += "type=" + type + "&";
		}
	}
	*/
	query += "page=";
	pageContext.setAttribute("paginationQuery", query);
	pageContext.setAttribute("_page", _page);
%>

<t:template title="게시글 검색">
	<jsp:body>
		<article class="tool-box">
			<h2>검색</h2>
			<input id="searchInput" class="tool-box" placeholder="검색어를 입력해 주세요." value="${keyword}"/>
			<div class="menu-row">
				<select class="tool-box" style="width: auto;">
					<option value="all">전체</option>
					<t:forEach var="board" items="${Board.valueList}">
						<option value="${board.ordinal()}">${board.ko()}</option>
					</t:forEach>
				</select>
		
				<input type="checkbox" name="searchType" value="TITLE">제목
				<input type="checkbox" name="searchType" value="CONTENT">내용
				<input type="checkbox" name="searchType" value="WRITER">작성자
				<br>
			</div>
		</article>

		<div class="panel-container">
			<div class="panel active">목록</div>
			<t:pagination
				current="${_page}"
				uri="${requestScope['javax.servlet.forward.request_uri'] += paginationQuery}"/>
		</div>

		<table class="tool-box">
			<thead>
				<tr>
					<td><span>No.</span></td>
					<td><span>게시판</span></td>
					<td><span>닉네임</span></td>
					<td><span>제목</span></td>
					<td><button type="button" style="z-index: -10;background: transparent;color: transparent;">버튼</button></td>
				</tr>
			</thead>

			<tbody>
				<t:forEach var="post" items="${list}">
					<tr>
						<td><span>${post.id}</span></td>
						<td><span>${post.board.ko()}</span></td>
						<td><span>${post.writerInfo.nickname}</span></td>
						<td><span>${post.title}</span></td>
						<%-- <td><span style="-webkit-line-clamp: 1;-webkit-box-orient: vertical;display: -webkit-box;">${post.content.substring(0, 10)}</span></td> --%>
						<td><button type="button" onclick="openDialog('/community/post/dialog?id=${post.id}', '게시글 관리', createFeatures(700, 550))">상세</button></td>
					</tr>
				</t:forEach>
			</tbody>
		</table>

		<script>

			(() => {
				const searchInput = document.getElementById('searchInput');
				const searchTypes = document.querySelectorAll("input[name='searchType']");

				(() => {
					const params = new URLSearchParams(location.search);
					const types = params.getAll('type');
					if(types && types.length > 0) {
						for(const searchType of searchTypes) {
							if(types.includes(searchType.value)) {
								searchType.checked = true;
							}
						}
					}
				})();

				searchInput.addEventListener('keydown', (e) => {
					if (e.keyCode === 13) {// Enter
						const keyword = searchInput.value.trim();
						if(keyword) {
							const param = new FormData();
							param.append('keyword', keyword);
							for(const searchType of searchTypes) {
								if(searchType.checked) {
									param.append('type', searchType.value);
								}
							}
							location.href = location.pathname + '?' + param.toString();
						} else {
							alert('검색어를 입력해 주세요.');
						}
					}
				});
			})();
		</script>
	</jsp:body>
</t:template>