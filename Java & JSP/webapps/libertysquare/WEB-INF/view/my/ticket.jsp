<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.DAOFactory"%>
<%@ page import="dao.EventDAO"%>
<%@ page import="dao.DefaultDAO"%>
<%@ page import="dao.AttendantDAO"%>
<%@ page import="data.Event"%>
<%@ page import="data.Ticket"%>
<%@ page import="data.Host"%>
<%@ page import="data.Attendant"%>
<%@ page import="util.DateUtil"%>
<%@ page import="java.util.Map"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.stream.Collectors"%>
<%
    DefaultDAO dao = null;
    Map<String, Object> map = null;
    AttendantDAO adao = null;
    try {
        EventDAO edao = DAOFactory.create(EventDAO.class);
		dao = edao;
        long eventID = Long.parseLong(uri.substring(uri.lastIndexOf("/") + 1));
        map = edao.getEventDetail(eventID);
        if(map == null) throw new Exception("DAO Error");
        adao = DAOFactory.convert(dao, AttendantDAO.class);
    } catch(Exception e) {
        out.print(e.getMessage());

        try{
            if(dao != null) dao.close();
        } catch(Exception e2){
            return;
        }

        return;
    }

    Event event = (Event) map.get("event");
    ArrayList<Ticket> ticketList = (ArrayList<Ticket>) map.get("ticket");
    Host host = (Host) map.get("host");
    
%>
<section class="mypage-event-spread-wrapper">
    <img class="mypage-event-spread-image" src="<%= event.getCoverPath() %>"/>
    <div class="mypage-event-spread-info-box">
        <a class="mypage-event-spread-title" href="https://libertysquare.co.kr/event/<%= event.getStatus() == Event.Status.DELETED ? event.getUUID() : event.getID() %>"><%= event.getTitle() %></a>
        <div class="mypage-event-spread-venue"><%= event.isOnline() ? "zoom".equals(event.getVenue()) ? "" : event.getDetailVenue() : event.getVenue() %></div>
        <div class="mypage-event-spread-metainfo-box">
            <div>
                <div class="meta-title">일시</div>
                <div class="meta-text"><%= DateUtil.convert(event.getDateTimeStart(), event.getDateTimeEnd()) %></div>
            </div>
            <div>
                <div class="meta-title">주최</div>
                <div class="meta-text"><%= host.getName() %></div>
            </div>
        </div>
        <a class="mypage-event-spread-shortcuts" href="/event/<%= event.getID() %>">행사 바로가기</a>
    </div>
</section>
<section class="mypage-ticket-list-container">
    <div class="mypage-ticket-list-header">보유 티켓</div>
    <div class="mypage-ticket-list-desc">티켓을 누르면 QR코드 및 상세한 내용을 볼 수 있습니다.</div>
    <div class="mypage-ticket-list-inner">
    <%
    for(Ticket ticket : ticketList) { 
        try { 
            ArrayList<Attendant> list = adao.getAttendantList(ticket.getID(), user.getUUID());
            if(list.size() < 1) continue; %>
        <div class="mypage-ticket-item" data-id="<%= ticket.getID() %>">
            <div class="mypage-ticket-item-name"><%= ticket.getName() %></div>
            <div class="mypage-ticket-item-price"><%= ticket.getPriceString() %></div>
            <div class="mypage-ticket-item-desc"><%= ticket.getDescription() %></div>
            <div>
                <svg viewBox="0 0 576 512" height="0.75em" width="0.75em" aria-hidden="true" focusable="false" fill="currentColor" style="transform: rotate(135deg)" class="valign-down"><path fill="currentColor" d="M128 160h320v192H128V160zm400 96c0 26.51 21.49 48 48 48v96c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48v-96c26.51 0 48-21.49 48-48s-21.49-48-48-48v-96c0-26.51 21.49-48 48-48h480c26.51 0 48 21.49 48 48v96c-26.51 0-48 21.49-48 48zm-48-104c0-13.255-10.745-24-24-24H120c-13.255 0-24 10.745-24 24v208c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24V152z"></path></svg>
                <span class="mypage-ticket-item-icon-text"><%= list.size() %>장 보유</span>
            </div>
            <% if(ticket.getType() == Ticket.Type.SELECTION) { %>
            <div>
                <svg viewBox="0 0 512 512" height="0.75em" width="0.75em" aria-hidden="true" focusable="false" fill="currentColor" class="valign-down"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>
                <span class="mypage-ticket-item-icon-text"><%= list.stream().filter(attend -> attend.getState() == Attendant.State.APPROVE || attend.getState() == Attendant.State.ATTEND).count() %>장 승인됨</span>
            </div>
            <% } %>
        </div>
    <%
        } catch(Exception e) {
            out.print(e.getMessage());

            try{
                if(dao != null) dao.close();
            } catch(Exception e2){
                return;
            }

            return;
        }
    } %>
    </div>
</section>
<%
try{
    if(dao != null) dao.close();
} catch(Exception e){
    return;
}
%>
<script type="text/javascript" src="https://ls2020.cafe24.com/js/ls/my/ticket_modal.js"></script>
<script type="text/javascript" src="https://ls2020.cafe24.com/assets/qr/qrcode.min.js"></script>
<script>
(function() {
    function setNav() {
        var nav = document.querySelector(".lnb-link[href='/my/tickets']");
        if(nav) nav.setAttribute("active", "");
        window.removeEventListener('load', setNav);
    }
    window.addEventListener('load', setNav);

    function modalAjax() {
        majax.load(document.body, "/attendant", "GET", "w=modal&ticketID=" + this.dataset.id, undefined, true)
            .then(function(xhr) {
                var json = JSON.parse(xhr.responseText);
                showTicketModal(document.body, json);
            }).catch(function(xhr) {
                alert('티켓 정보 수신에 실패하였습니다.\n' + xhr.responseText);
            });
    }
    for(var item of document.querySelectorAll(".mypage-ticket-item")) {
        item.addEventListener('click', modalAjax);
    }
}());
</script>