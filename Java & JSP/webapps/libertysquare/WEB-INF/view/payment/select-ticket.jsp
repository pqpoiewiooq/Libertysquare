<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.DAOFactory"%>
<%@ page import="dao.EventDAO"%>
<%@ page import="dao.AttendantDAO"%>
<%@ page import="account.User"%>
<%@ page import="data.Event"%>
<%@ page import="data.Ticket"%>
<%@ page import="data.Host"%>
<%@ page import="util.DateUtil"%>
<%@ page import="java.util.Map"%>
<%@ page import="java.util.List"%>

<%@ page import="dao.HostDAO"%>
<%
    Map<String, Object> map = null;
    long eventID = -1;
    try (EventDAO dao = DAOFactory.create(EventDAO.class)) {
        eventID = Long.parseLong(uri.substring(uri.lastIndexOf("/") + 1));
        map = dao.getEventDetail(eventID);
        if(map == null) throw new Exception("DAO Error");

        // 티켓 구매 가능 개수를 불러오기 위한 조치
        AttendantDAO adao = DAOFactory.convert(dao, AttendantDAO.class);
        for(Ticket ticket : (List<Ticket>) map.get("ticket")) { 
            int count = adao.count(user.getUUID(), ticket.getID());
            ticket.setPurchaseLimit(ticket.getPurchaseLimit() - count);
        }
        adao = null;
    } catch(Exception e) {
        out.print(e.getMessage());
        //response.sendError(404);
        return;
    }

    Event event = (Event) map.get("event");
    if(event.getStatus() == Event.Status.DELETED || DateUtil.wasExpired(event.getDateTimeEnd())) {
        response.sendRedirect("/event/" + eventID);
        return;
    }
    event.changeWebInfo();
    List<Ticket> ticketList = (List<Ticket>) map.get("ticket");
    Host host = (Host) map.get("host");

    String date = DateUtil.convert(event.getDateTimeStart(), event.getDateTimeEnd());
%>

<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/event.css">
<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/payment.css">

<div class="payment-container">
    <section class="payment-step-wrapper">
        <span class="payment-step-box accent current">
            <span class="payment-step-text">1. 티켓 선택</span>
            <span class="payment-step-divider"></span>
        </span>
        <span class="payment-step-box">
            <span class="payment-step-text">2. 결제</span>
        </span>
    </section>
    
    <section class="payment-ticket-container">
        <h1 class="payment-ticket-header">Tickets</h1>

        <article class="payment-ticket-wrapper">
            <% for(Ticket ticket : ticketList) { 
                boolean wasExpiredTicket = DateUtil.wasExpired(ticket.getEndDate());
                String ticketClass;
                String term;
                if(wasExpiredTicket) {
                    ticketClass = "payment-ticket-item expired";
                    term = "판매 기간이 종료되었습니다.";
                } else {
                    ticketClass = ticket.getPurchaseLimit() < 1 ? "payment-ticket-item expired" : "payment-ticket-item";
                    term = DateUtil.term(ticket.getEndDate()) + "일 후에 판매마감";
                } %>
                <label class="<%= ticketClass %>" data-id=<%= ticket.getID() %>>
                    <div class="payment-ticket-item-inner">
                        <p class="payment-ticket-item-name"><%= ticket.getName() %></p>
                        <div class="payment-ticket-item-price"><%= ticket.getPriceString() %></div>
                        <p class="payment-ticket-item-desc"><%= ticket.getDescription() %></p>
                        <div>
                            <svg viewBox="0 0 576 512" height="0.75em" width="0.75em" aria-hidden="true" focusable="false" fill="currentColor" class="valign-down ticket-icon"><path fill="currentColor" d="M128 160h320v192H128V160zm400 96c0 26.51 21.49 48 48 48v96c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48v-96c26.51 0 48-21.49 48-48s-21.49-48-48-48v-96c0-26.51 21.49-48 48-48h480c26.51 0 48 21.49 48 48v96c-26.51 0-48 21.49-48 48zm-48-104c0-13.255-10.745-24-24-24H120c-13.255 0-24 10.745-24 24v208c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24V152z"></path></svg>
                            <span class="payment-ticket-item-date"><%= term %></span>
                        </div>
                    </div>
                    <input class="payment-ticket-item-chkbox" type="checkbox"/>
                </label>

                <% if(!wasExpiredTicket && ticket.getPurchaseLimit() > 1) { %>
                    <div class="payment-ticket-item option">
                        <div class="payment-ticket-option-label">수량</div>
                        <div class="payment-ticket-option-text">최대 <%= ticket.getPurchaseLimit() %>개 구매 가능</div>
                        <div class="counter-container">
                            <button class="counter-button left" disabled><svg viewBox="0 0 320 512" height="1em" width="1em" aria-hidden="true" focusable="false" fill="currentColor"><path fill="currentColor" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path></svg></button>
                            <input class="counter-input" value="1" readonly>
                            <button class="counter-button right"><svg viewBox="0 0 320 512" height="1em" width="1em" aria-hidden="true" focusable="false" fill="currentColor"><path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path></svg></button>
                        </div>
                    </div>
                <% } %>
            <% } %>
        </article>

        <article class="confirm-btn-container">
            <button type="button" id="submitButton" class="confirm-btn">선택 완료<button>
        <article>
    </section>

    <section class="payment-event-container">
        <img class="payment-event-img" src="<%= event.getCoverPath() %>"/>
        <article class="payment-event-inner">
            <h1 class="primary-title"><%=event.getTitle()%></h1>

            <div class="payment-event-info-wrapper">
                <div class="payment-event-info-box">
                    <div class="meta-title">일시</div>
                    <div class="meta-text"><%=date%></div>
                </div>
                <div class="payment-event-info-box">
                    <div class="meta-title">주최</div>
                    <div class="meta-text"><%=host.getName()%></div>
                </div>
            </div>

            <% if(!event.isOnline()) { %>
                <div class="payment-event-map-wrapper">
                    <iframe style="width: 100%; height: 100%; border: 0;" loading="lazy" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBvGKFCLL6khttyoTqy_7haBhgoA2pPR6Q&q=<%=event.getVenue()%>" allowfullscreen></iframe>
                </div>
            <% } %>

            <div class="payment-event-info-wrapper">
                <div class="payment-event-info-box">
                    <div class="meta-title"><%= event.isOnline() ? "온라인 플랫폼" : "장소" %></div>
                    <% if(!event.isOnline()) { %><div class="meta-title"><%= event.getVenue() %></div><% } %>
                    <div class="meta-title"><%= event.getDetailVenue() %></div>
                    <% if(event.getVenueDescription() != null) { %>
                        <div class="meta-text"><%=event.getVenueDescription()%></div>
                    <% } %>
                </div>
            </div>
        </article>
    </section>
</div>

<script type="text/javascript" src="https://ls2020.cafe24.com/js/ls/payment/select-ticket.js"></script>