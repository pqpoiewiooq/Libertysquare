<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="data.Host"%>
<%@ page import="dao.HostDAO"%>
<%@ page import="dao.DAOFactory"%>
<%@ page import="java.util.List"%>
<%
    List<Host> hostList = null;
    try (HostDAO hdao = DAOFactory.create(HostDAO.class)) {
        user.getUUID();
        hostList = hdao.getHosts(user.getUUID());
    } catch(Exception e) {
    }
%>
<article>
    <div class="event-new-sub-title">주최할 호스트 선택</div>
    <div class="event-new-sub-desc">행사를 주최할 호스트를 선택해 주세요. 내가 속한 호스트를 선택할 수 있으며, 호스트 내 멤버들은 모두 행사를 수정하고, 관리할 수 있습니다.</div>
    <div class="selectable-wrapper">
        <button class="selectable-add-container">
            <div class="selectable-add-icon-wrapper">
            <svg viewBox="0 0 448 512" aria-hidden="true" focusable="false" fill="currentColor" class="selectable-add-icon">
                    <path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
                </svg>
            </div>
            <span class="selectable-add-text">새로운 호스트 만들기</span>
        </button>
        
        <!-- 추가되는 부분 -->
        
        <% for(Host h : hostList) { %>
            <div class="selectable-item-container" data-id="<%=h.getID()%>">
                <p class="selectable-item-title"><%= h.getName() %></p>
                <p class="selectable-item-desc"><%= h.getIntroduceSimple() %></p>
            </div>
        <% } %>
    </div>
</article>
<article class="event-new-host-container" style="display: none;">
    <div class="event-new-sub-title">선택된 호스트</div>
    <div class="event-new-sub-desc">함께 행사를 만들어나갈 호스트와 멤버들입니다.</div>
    <div class="event-new-preview-wrapper">
        <div class="preview-wrapper">
            <div class="preview-title"></div>
            <div class="preview-desc"></div>
            <div class="preview-list-wrapper">
            </div>
            <button name="edit" class="preview-btn edit">수정</button>
            <button name="open" class="preview-btn">페이지 열기</button>
        </div>
    </div>
</article>
<article class="confirm-btn-container right">
    <button class="confirm-btn" disabled>행사 만들러 가기</button>
    <button class="confirm-btn support" disabled>후원 만들러 가기</button>
</article>