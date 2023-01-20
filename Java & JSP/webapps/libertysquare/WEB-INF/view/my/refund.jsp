<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.DAOFactory"%>
<%@ page import="dao.AttendantDAO"%>
<%@ page import="dao.TicketDAO"%>
<%@ page import="data.Attendant"%>
<%@ page import="data.Ticket"%>
<%@ page import="util.DateUtil"%>
<%@ page import="dao.PaymentDAO"%>
<%@ page import="data.PaymentData"%>
<%@ page import="java.util.ArrayList"%>
<%!
    public String priceFormat(int price) {
		if(price <= 0) return "무료";
		String str = price + "";
		return "₩ " + str.replaceAll("\\B(?=(\\d{3})+(?!\\d))", ",");
	}
%>
<%
    long paymentID = 0;
    PaymentData data = null;
    ArrayList<Attendant> list = null;
    Ticket ticket = null;
    try (PaymentDAO pdao = DAOFactory.create(PaymentDAO.class)) {
        paymentID = Long.parseLong(uri.substring(uri.lastIndexOf("/") + 1));
        data = pdao.get(paymentID);
        if(data == null) throw new Exception("DAO Error");

        AttendantDAO adao = DAOFactory.convert(pdao, AttendantDAO.class);
        list = adao.getAttendantListFromPaymentID(paymentID);

        if(list == null || list.size() < 1) {
            response.sendError(404);
            return;
        }

        TicketDAO tdao = DAOFactory.convert(adao, TicketDAO.class);
        ticket = tdao.get(list.get(0).getTicket().getID());
        if(ticket == null) {
            response.sendError(404);
            return;
        }
    } catch(Exception e) {
        out.print(e.getMessage());
        return;
    }
%>
<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/document.css">
<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/mypage.css">
<div class="document-container">
    <h1 class="mypage-header">환불</h1>
    <div class="refund-desc">다음 티켓을 환불하시겠습니까?</div>
    <div class="refund-sub-desc">
    주문번호 - <%= data.getID() %><br>
    결제일 - <%= DateUtil.meridiem(data.getApprovedTime()) %><br>
    환불가능 - <%= DateUtil.meridiem(ticket.getRefundDeadline()) %> 까지<br>
    환불금액 - <%= ("₩ " + data.getAmount()).replaceAll("\\B(?=(\\d{3})+(?!\\d))", ",") %>
    </div>
    <section class="refund-ticket-container">
    <% for(Attendant attendant : list) { %>
        <article class="refund-ticket-item">
            <span class="refund-ticket-item-price"><%= priceFormat(ticket.getPrice()) %></span>
            <span class="refund-ticket-item-name"><%= ticket.getName() %></span>
            <p class="refund-ticket-item-desc"><%= ticket.getDescription() %></p>
            <div>
                <svg viewBox="0 0 576 512" height="0.75em" width="0.75em" aria-hidden="true" focusable="false" fill="currentColor" class="valign-down"><path fill="currentColor" d="M128 160h320v192H128V160zm400 96c0 26.51 21.49 48 48 48v96c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48v-96c26.51 0 48-21.49 48-48s-21.49-48-48-48v-96c0-26.51 21.49-48 48-48h480c26.51 0 48 21.49 48 48v96c-26.51 0-48 21.49-48 48zm-48-104c0-13.255-10.745-24-24-24H120c-13.255 0-24 10.745-24 24v208c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24V152z"></path></svg>
                <span class="refund-ticket-item-icon-text">Ticket ID <%= attendant.getID() %></span>
            </div>
        </article>
    <% } %>
    </section>
    <div class="refund-button-wrapper">
        <button type="button" class="preview-btn normal delete">환불</button>
    </div>
</div>
<script>
(function() {
    document.querySelector("button").addEventListener('click', function() {
        if(confirm('정말로 환불하시겠습니까?')) {
            majax.load(document.body, "https://api.libertysquare.co.kr/payment", "DELETE", "paymentID=<%= paymentID %>", undefined, true)
                .then(function() {
                    alert("환불 처리되었습니다.");
                    location.href = "/my/tickets";
                }).catch(function(xhr) {
                    alert("환불에 실패하였습니다.\n" + xhr.responseText);
                });
        }
    });
}());
</script>