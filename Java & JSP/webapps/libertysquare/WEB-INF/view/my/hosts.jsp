<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.DAOFactory"%>
<%@ page import="dao.HostDAO"%>
<%@ page import="data.Host"%>
<%@ page import="account.User"%>
<%@ page import="java.util.List"%>
<% 
User user = (User) session.getAttribute("user");
List<Host> hostList = null;
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
} catch(Exception e) {
    response.sendError(404);
    return;
}

if(hostList.size() > 0) { %>
<section class="mypage-host-list-container">
    <% for(Host host : hostList) { %>
    <a class="mypage-host-item" href="/host/<%= host.getID() %>" maincolor="<%= host.getThemeColor() %>">
        <img class="mypage-host-item-img" src="<%= host.getProfilePath() %>"/>
        <div class="mypage-host-item-body">
            <div class="mypage-host-item-name"><%= host.getName() %></div>
            <div class="mypage-host-item-like">
                <svg viewBox="0 0 512 512" height="1em" width="1em" aria-hidden="true" focusable="false" fill="currentColor" class="valign-down"><path fill="currentColor" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>
                <%= host.getSubscribeCount() %>
            </div>
        </div>
    </a>
    <% } %>
</section>
<script>
    (function() {
        var x = 0;
        var length = document.styleSheets.length;
        for(; x < length; x++) {
            try {
                document.styleSheets[x].insertRule(".color-replace-test-element {display: none;}", 0);
                document.styleSheets[x].deleteRule(0);
                break;
            } catch(exception) {
                continue;
            }
        }
        if(x != length) {
            var list = document.querySelectorAll("a[maincolor]");
            for(var i = 0; i < list.length; i++) {
                var color = list[i].getAttribute("maincolor");
                var className = Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 5);
                document.styleSheets[x].insertRule("." + className + ":hover {transition: all 0.4s ease 0s; box-shadow: #" + color + " 0 0 12px 0;}");
                list[i].classList.add(className);
            }
        }
    }());
</script>
<% } else { %>
<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/error.css">
<div class="error-container">
    <h2 class="mypage-header">호스트가 되어 행사를 주최해 보세요.</h2>
    <img class="error-img" src="https://ls2020.cafe24.com/img/error-404.png" alt="소속된 호스트 없음">
</div>
<% } %>