<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="account.User"%>
<%@ page import="dao.DAOFactory"%>
<%@ page import="dao.EventDAO"%>
<%@ page import="dao.AttendantDAO"%>
<%@ page import="data.Event"%>
<%@ page import="util.DateUtil"%>
<%@ page import="java.util.Map"%>
<%
    String uri = request.getRequestURI();
	User user = (User) session.getAttribute("user");
    if(user == null) {
        response.sendError(404);
        return;
    }

    Event event = null;
    try (EventDAO dao = DAOFactory.create(EventDAO.class)) {
        String eventID = request.getParameter("_");
        try {
            Long.parseLong(eventID);
            response.sendError(404);
            return;
        } catch(Exception ie) {}
        event = dao.get(eventID);
        if(event == null) throw new Exception("DAO Error");
        if(!event.isZoom()) throw new Exception("This Event is Not Zoom Event");

        AttendantDAO adao = DAOFactory.convert(dao, AttendantDAO.class);
        if(!adao.hasApproveOrAttend(event.getTickets(), user.getUUID())) throw new Exception("Forbidden");
    } catch(Exception e) {
        response.sendError(404);
        return;
    }
%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <jsp:include page="/WEB-INF/view/head.jsp" flush="false">
		<jsp:param name="title" value="Zoom 행사 참가 | 자유광장" />
	</jsp:include>

    <link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/layout.css">
    <style>
        body {display: flex; width: 100vw; height: 100vh; flex-direction: column; -webkit-box-pack: center; justify-content: center; -webkit-box-align: center; align-items: center; padding-top: 75px;}
        .logo {display: inline-block; width: 120px; height: 78.6px; background: url(https://ls2020.cafe24.com/img/ls/logo_big.png) center center / 100% no-repeat;}
        h1 {font-size: 2em; margin: 75px 0 0.67em 0;}
        .password {color: #2f80ed;}
        .attend-button {border: none; background: #2f80ed; padding: 15px; color: #fff; border-radius: 12px; font-family: "Noto Sans KR"; font-style: normal; font-weight: 500; font-size: 24px; text-align: center; letter-spacing: -0.03em; margin-top: 0.67em;}
        .attend-container {margin: 0 auto; text-align: center;}
    </style>
</head>
<body>
    <header>
        <a href="/" class="logo"></a>
    </header>
    <section class="attend-container">
        <h1>환영합니다</h1>
        <h2>입장 비밀번호는 <span class="password"><%= event.getVenueDescription() %></span> 입니다.</h2>
        <button type="button" class="attend-button">입장하기</button>
    </section>
</body>
<script>
document.querySelector("button").addEventListener('click', function() {
    var child = window.open("<%= event.getDetailVenue() %>", "_blank");
    child.focus();
});
</script>
</html>