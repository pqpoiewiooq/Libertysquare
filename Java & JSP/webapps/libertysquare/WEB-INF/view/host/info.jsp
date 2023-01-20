<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List"%>
<%
	List<String> members = dao.getMemberList(hostID);

	String venue = host.getVenue();
	String detailVenue = host.getDetailVenue();
	boolean isEmptyVenue = (venue == null || venue.equals(""));
	boolean isEmptyDetailVenue = (detailVenue == null || detailVenue.equals(""));
%>

<h2 class="host-info-title">소개</h2>
<div class="host-info-introduce">
	<% for(String line : host.getIntroduce().split("\n")) { %>
		<p><%= line %></p>
	<% } %>
</div>

<% if(!(isEmptyVenue && isEmptyDetailVenue)) { %>
<h2 class="host-info-title">장소</h2>
	<div class="host-info-introduce">
		<% if(!isEmptyVenue) { %>
			<iframe style="width: 100%; height: 100%; border: 0;" loading="lazy" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBvGKFCLL6khttyoTqy_7haBhgoA2pPR6Q&q=<%= host.getVenue() %>" allowfullscreen></iframe>
		<% } %>
		<p><%= isEmptyVenue ? detailVenue : (isEmptyDetailVenue ? venue : venue + ", " + detailVenue) %></p>
	</div>
<% } %>

<div class="organizer-container">
	<h2 class="host-info-title">오거나이저</h2>
	<div class="organizer-wrapper">
		<%
		if(members != null) {
			for(String member : members) {
				if(member == null) continue; %>
			<div class="organizer-item">
				<div class="organizer-item-profile-image"><%= member.substring(member.length() - 2) %></div>
				<div class="organizer-item-name"><%= member %></div>
			</div><%
			}
		} %>
	</div>
	<div class="host-since-wrapper"><%= since %></div>
</div>