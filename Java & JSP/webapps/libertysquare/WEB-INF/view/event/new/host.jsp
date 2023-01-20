<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="data.Host"%>
<%@ page import="dao.HostDAO"%>
<%@ page import="dao.DAOFactory"%>
<%@ page import="dao.UserDAO"%>
<%
    String hostID = null;
    String method = "POST";
    String name = null;
    String introduceSimple = "";
    String[] members = null;
    String[] ids = new String[]{};
    if(uri.startsWith("/event/new/organization/")) {
		try (HostDAO hdao = DAOFactory.create(HostDAO.class)) {
			hostID = uri.replace("/event/new/organization/", "");
			method = "PATCH";
			Host host = hdao.get(Long.parseLong(hostID));
			name = host.getName();
			introduceSimple = host.getIntroduceSimple();
			members = host.getMembers();
			if(members == null) { %>
				<script>
				alert('호스트 멤버를 불러오는데 실패하였습니다.');
				location.href = "/event/new";
				</script>
			<% return; }

			UserDAO udao = DAOFactory.convert(hdao, UserDAO.class);
			ids = udao.getUserIDArray(members);
			if(ids == null || ids.length != members.length) { %>
				<script>
				alert('호스트 멤버를 불러오는데 실패하였습니다.');
				location.href = "/event/new";
				</script>
			<% return; }
		} catch(Exception e) {
			response.sendError(404);
		}%>
    <input type="hidden" name="fname" value="<%= name %>">
    <input type="hidden" name="fid" value="<%= user.getID() %>">
    <input type="hidden" name="method" value="<%= method %>">
    <input type="hidden" name="id" value="<%= hostID %>">
<% } %>

<div class="preview-wrapper small">
    <div class="preview-title">이름</div>
    <div class="preview-input-wrapper">
        <input name="name" type="text" class="input-field" autocomplete="off"  value="<%= name == null ? "" : name %>">
        <div class="error-text hidden"></div>
    </div>
</div>
<div class="preview-wrapper small">
    <div class="preview-title">간단소개</div>
    <div class="preview-input-wrapper">
        <input name="introduceSimple" type="text" class="input-field" autocomplete="off" value="<%= introduceSimple %>">
        <div class="error-text hidden"></div>
    </div>
</div>
<div class="preview-wrapper small">
    <div class="preview-title">멤버등록</div>
    <div class="preview-sub-title">전화번호로 회원을 추가 할 수 있습니다. 삭제 하려면 추가된 멤버의 아이콘을 눌러주면 됩니다.</div>
    <div class="preview-input-wrapper">
        <div class="preview-input-box">
            <input name="member" type="text" class="input-field" autocomplete="off">
        </div>
        <button name="add" class="preview-btn edit normal">추가</button>
        <div class="error-text hidden"></div>
    </div>
</div>
<div id="memberList" class="preview-wrapper small" style="<%= (ids.length > 0 ? "" : "display: none;") %>">
    <% for(int i = 0; i < ids.length; i++) { 
        if(ids[i].equals(user.getID())){ %>
            <button class="preview-list-item"><%= ids[i] %></button>    
        <% } else { %>
        <button class="preview-list-item clickable" onclick="removeMember(event)"><%= ids[i] %></button>
    <%  }} %>
</div>
<div class="preview-wrapper small">
    <div class="preview-btn-field">
        <button name="cancel" class="preview-btn edit normal">취소</button>
        <button name="confirm" class="form-button preview-confirm-btn">확인</button>
    </div>
</div>