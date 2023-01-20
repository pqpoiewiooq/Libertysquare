<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.DAOFactory"%>
<%@ page import="dao.PaymentDAO"%>
<%@ page import="data.Event"%>
<%@ page import="account.User"%>
<%@ page import="util.DateUtil"%>
<%@ page import="java.util.ArrayList"%>
<%
ArrayList<Event> eventList = null;
try (PaymentDAO dao = DAOFactory.create(PaymentDAO.class)) {
	User user = (User) session.getAttribute("user");
	eventList = dao.getPurchasedEventList(user.getUUID());
	if(eventList == null) {
		response.sendError(500);
		return;
	}
} catch(Exception e) {
	response.sendError(404);
	return;
}

if(eventList.size() > 0) {
%>
<h1 class="mypage-header">구매 완료한 티켓</h1>
<section class="event-list-box">
	<%for(Event event : eventList) { %>
	<a class="event-card-wrapper" href="/my/ticket/<%= event.getID() %>">
		<div class="event-card">
			<div class="event-card-header">
				<img class="event-card-image" src="<%= event.getCoverPath() %>">
			</div>
			<div class="event-card-inner">
				<div class="event-card-body">
					<span class="event-card-date"><%= DateUtil.meridiem(event.getDateTimeStart()) %></span>
					<h3 class="event-card-title"><%= event.getTitle() %></h3>
					<span class="event-card-host-link" href = '/host/<%= event.getHost() %>'><%= event.getHostName() %></span>
				</div>
			</div>
		</div>
	</a>
	<% } %>
</section>
<script>
var tickets = document.querySelectorAll(".event-card-wrapper");
for(var ticket of tickets) {
	ticket.addEventListener('click', function(event) {
		event.preventDefault();
		if(event.target.className == "event-card-host-link") {
			location.href = event.target.getAttribute("href");
		} else {
			replaceDocument(event.currentTarget.href, true);
		}
	});
}
</script>
<% } else { %>
<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/error.css">
<div class="error-container">
	<h1 class="mypage-header">행사 티켓을 구매해 보세요.</h1>
	<img class="error-img" src="https://ls2020.cafe24.com/img/error-404.png" alt="보유한 행사 티켓 없음">
</div>
<% } %>