<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@page import="java.util.*"%>
<%@page import="java.net.URLEncoder"%>
<%@page import="account.User"%>
<%@page import="dao.*"%>
<%@page import="servlet.util.*"%>
<%@page import="database.query.*"%>

<%!
	public enum SearchType {
		NAME, NICKNAME, ID;

		public static final SearchType[] values = values();
		public static final int length = values.length;
	}

	public class UserSearchDAO extends UserDAO {
		protected final ArrayList<User> search(SearchType[] types, String keyword, int offset, int limit) {
			SelectQuery searchQuery = QueryFactory.select(getTable())
					.setResult("name, nickname, id, path_profile, fcmToken, state")
					.pagination(offset, limit);
			
			// isBlank를 쓰고 싶으나, java8 사용중이고, 관련 depenency가 없어서 일단 isEmpty 사용.
			if(keyword != null && !keyword.isEmpty()) {
				if(types == null || types.length < 1) types = SearchType.values;
				
				searchQuery.like(types[0].name().toLowerCase(), keyword);
				
				for(int i = 1; i < types.length ; i++) {
					searchQuery.or().like(types[i].name().toLowerCase(), keyword);	
				}
			}
			
			return executeQuery(searchQuery, sequence -> {
				ArrayList<User> list = new ArrayList<>();
				while(sequence.next()) {
					User user = new User();
					user.setName(sequence.nextString());
					user.setNickname(sequence.nextString());
					user.setID(sequence.nextString());
					user.setProfilePath(sequence.nextString());
					user.setFCMToken(sequence.nextString());
					user.setState(User.State.valueOf(sequence.nextString()));
					list.add(user);
				}
				return list;
			});
		}
	}
%>

<%
	/* parameter parsing */
	String keyword = RequestParser.get(request, "keyword", true);
	SearchType[] types = RequestParser.getArray(request, "type", SearchType::valueOf, SearchType[]::new, SearchType.length, true);
	int _page = 1;// page 라는 이름으로 기본 내장 객체가 있어서 _ 추가
	try {
		_page = RequestParser.getInt(request, "page", null, true);
		if(_page < 1) _page = 1; 
	} catch(Exception e) {}

	// dao
	List<User> list;
	try (UserSearchDAO dao = new UserSearchDAO()) {
		dao.open();
		list = dao.search(types, keyword, _page, 20);
	} catch(Exception e) {
		list = new ArrayList<>();
	}

	pageContext.setAttribute("keyword", keyword);
	pageContext.setAttribute("types", types);
	pageContext.setAttribute("list", list);

	// pagination 용
	String query = "?";
	if(keyword != null) {
		query += "keyword=" + URLEncoder.encode(keyword) + "&";
	}
	if(types != null) {
		for(SearchType type : types) {
			query += "type=" + type + "&";
		}
	}
	query += "page=";
	pageContext.setAttribute("paginationQuery", query);
	pageContext.setAttribute("_page", _page);
	pageContext.setAttribute("STATE_ACTIVATE", User.State.ACTIVATE);
%>

<t:template title="사용자 검색">
	<jsp:body>
		<article class="tool-box">
			<h2>검색</h2>
			<input id="searchInput" class="tool-box" placeholder="검색어를 입력해 주세요." value="${keyword}"/>
			<div class="menu-row">
				<input type="checkbox" name="searchType" value="ID">ID
				<input type="checkbox" name="searchType" value="NAME">이름
				<input type="checkbox" name="searchType" value="NICKNAME">닉네임

				<button style="margin-left: auto;" onclick="openNotificationDialog('all')">
					<svg viewBox="0 0 24 24" height="1em" width="1em" aria-hidden="true" focusable="false" fill="currentColor" style="margin-right: 5px;"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></svg>
					전체 알림 발송
				</button>
			</div>
		</article>

		<div class="panel-container">
			<div class="panel active">목록</div>
			<t:pagination
				current="${_page}"
				uri="${requestScope['javax.servlet.forward.request_uri'] += paginationQuery}"/>
		</div>

		<table class="tool-box">
			<tbody>
				<t:forEach var="user" items="${list}">
					<tr  ${user.state == STATE_ACTIVATE ? null : "class=\"" += user.state.name().toLowerCase() += "\""}>
						<td><div class="icon" style="background: url('${user.profilePath}') center center / cover no-repeat"></div></td>
						<td><span>${user.name}</span></td>
						<td><span>${user.nickname}</span></td>
						<td><span>${user.ID}</span></td>
						<td><button type="button" data-target="${user.FCMToken}" onclick="openNotificationDialog(this)">알림</button></td>
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