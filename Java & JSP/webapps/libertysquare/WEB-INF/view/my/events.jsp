<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.DAOFactory"%>
<%@ page import="dao.HostDAO"%>
<%@ page import="data.Host"%>
<%@ page import="data.Event"%>
<%@ page import="account.User"%>
<%@ page import="util.DateUtil"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Iterator"%>
<% 
User user = (User) session.getAttribute("user");
List<Host> hostList = null;
HashMap<Long, List<Event>> eventMap = new HashMap<>();
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
        Host host = it.next();
        List<Event> eventList = dao.getHostedEventList(host.getID());
        if(eventList == null || eventList.size() < 1) {
            it.remove();
            continue;
        }
        eventMap.put(host.getID(), eventList);
        hasEvent = true;
    }
} catch(Exception e) {
    response.sendError(404);
    return;
}

if(hasEvent) {
    for(Host host : hostList) {%>
<h1 class="mypage-header"><%= host.getName() %></h1>
<section class="event-list-box">
    <% for(Event event : eventMap.get(host.getID())) { %>
    <a class="event-card-wrapper" href="/manage/attendee/<%= event.getID() %>">
        <div class="event-card">
            <div class="event-card-header">
                <img class="event-card-image" src="<%= event.getCoverPath() %>">
            </div>
            <div class="event-card-inner">
                <div class="event-card-body">
                    <!--<span class="event-card-date"><%= DateUtil.meridiem(event.getDateTimeStart()) %></span>-->
                    <h3 class="event-card-title"><%= event.getTitle() %></h3>
                    <span class="event-card-host-link" onclick="location.href = '/host/<%= host.getID() %>'; return false;"><%= host.getName() %></span>
                </div>
            </div>
        </div>
    </a>
    <% } %>
</section>
<% }} else { %>
<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/error.css">
<div class="error-container">
    <h2 class="mypage-header">행사를 주최해 보세요.</h2>
    <img class="error-img" src="https://ls2020.cafe24.com/img/error-404.png" alt="주최한 행사 없음">
</div>
<% } %>