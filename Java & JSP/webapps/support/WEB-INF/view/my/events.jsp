<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.DAOFactory"%>
<%@ page import="dao.HostDAO"%>
<%@ page import="data.Host"%>
<%@ page import="data.Event"%>
<%@ page import="data.Support"%>
<%@ page import="account.User"%>
<%@ page import="util.DateUtil"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<% 
User user = (User) session.getAttribute("user");

List<Host> hostList = null;
HashMap<Long, List<Event>> eventMap = new HashMap<>();
HashMap<Long, List<Support>> supportMap = new HashMap<>();
boolean hasEvent = false;
try (HostDAO dao = DAOFactory.create(HostDAO.class)) {
    if(dao == null) {
        response.sendError(500);
        return;
    }

    hostList = dao.getHosts(user.getUUID());
    if(hostList == null) {
        response.sendError(500);
        return;
    }
    
    Iterator<Host> it = hostList.iterator();
    while(it.hasNext()) {
        boolean isRemoved = false;
        Host host = it.next();
        List<Event> eventList = dao.getHostedEventList(host.getID());
        List<Support> supportList = dao.getHostedSupportList(host.getID());
        if(eventList == null || eventList.size() < 1) {
            isRemoved = true;
        } else {
            eventMap.put(host.getID(), eventList);
            hasEvent = true;
        }
        if(!(supportList == null || supportList.size() < 1)) {
            isRemoved = false;
            supportMap.put(host.getID(), supportList);
            hasEvent = true;
        }
		if(isRemoved) it.remove();
    }
} catch(Exception e) {
    response.sendError(404);
    return;
}

if(hasEvent) {
    for(Host host : hostList) {%>
<h1 class="mypage-header"><%= host.getName() %></h1>
<section class="event-list-box">
    <% List<Event> tempEventList = eventMap.get(host.getID()); %>
    <% if(tempEventList != null) { %>
        <% for(Event event : tempEventList) { %>
        <a class="event-card-wrapper" href="/manage/attendee/<%= event.getID() %>">
            <div class="event-card">
                <div class="event-card-header">
                    <img class="event-card-image" src="<%= event.getCoverPath() %>">
                </div>
                <div class="event-card-inner">
                    <div class="event-card-body">
                        <span class="event-card-date"><%= DateUtil.meridiem(event.getDateTimeStart()) %></span>
                        <h3 class="event-card-title"><%= event.getTitle() %></h3>
                        <span class="event-card-host-link" onclick="location.href = '/host/<%= host.getID() %>'; return false;"><%= host.getName() %></span>
                    </div>
                </div>
            </div>
        </a>
        <% } %>
    <% } %>

    <% List<Support> tempSupportList = supportMap.get(host.getID()); %>
    <% if(tempSupportList != null) { %>
        <% for(Support support : tempSupportList) { %>
        <a class="event-card-wrapper" href="/event/<%= support.getID() %>">
            <div class="event-card support">
                <div class="event-card-header">
                    <img class="event-card-image" src="<%= support.getCoverPath() %>">
                </div>
                <div class="event-card-inner">
                    <div class="event-card-body">
                        <span class="event-card-date"><%= support.getBusinessType().toString() %></span>
                        <h3 class="event-card-title"><%= support.getTitle() %></h3>
                        <span class="event-card-host-link" onclick="location.href = '/host/<%= host.getID() %>'; return false;"><%= host.getName() %></span>
                    </div>
                </div>
            </div>
        </a>
        <% } %>
    <% } %>
</section>
<% }} else { %>
<link rel="stylesheet" type="text/css" href="https://rs.libertysquare.co.kr/css/error.css">
<div class="error-container">
    <h2 class="mypage-header">행사를 주최해 보세요.</h2>
    <img class="error-img" src="https://ls2020.cafe24.com/img/error-404.png" alt="주최한 행사 없음">
</div>
<% } %>