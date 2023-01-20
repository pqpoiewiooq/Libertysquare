<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.UserDAO"%>
<%
	if(!isMember) {
		response.sendRedirect("/host/" + hostID);
		return;
	}

	UserDAO udao = DAOFactory.convert(dao, UserDAO.class);
	String[] members = host.getMembers();
	String[] ids = udao.getUserIDArray(members);
	if(ids == null /*|| ids.length != members.length*/) { %>
		<script>
		alert('호스트 멤버를 불러오는데 실패하였습니다.');
		location.href = "/host/<%= hostID %>";
		</script>
<% return; } %>
<!--
<div class="host-edit-menu-bar">
	<a class="host-edit-menu-item" href="">기본 정보</a>
	<a class="host-edit-menu-item" href="">상세 소개</a>
	<a class="host-edit-menu-item" href="">오거나이저 관리</a>
</div>
-->
<input type="hidden" name="fid" value="<%= user.getID() %>">
<input type="hidden" name="fname" value="<%= host.getName() %>">

<div class="host-edit-container">
	<div class="host-edit-form-field">
		<div class="host-edit-form-title">이름</div>
		<div class="host-edit-form-body">
			<input name="name" type="text" class="input-field" autocomplete="off"  value="<%= name %>">
			<div class="error-text hidden"></div>
		</div>
	</div>

	<div class="host-edit-form-field">
		<div class="host-edit-form-title">간단소개</div>
		<div class="host-edit-form-body">
			<input name="introduceSimple" type="text" class="input-field" autocomplete="off" value="<%= host.getIntroduceSimple() %>">
			<div class="error-text hidden"></div>
		</div>
	</div>

	<div class="host-edit-form-field">
		<div class="host-edit-form-title">시작일</div>
		<div class="host-edit-form-body since">
			<input id="since" name="since" type="text" class="input-field host-edit-form-datepickr" autocomplete="off"  value="<%= host.getSince() %>">
			<div class="host-edit-form-since"><%= since %></div>
		</div>
	</div>

	<div class="host-edit-form-field">
		<div class="host-edit-form-title">프로필 이미지</div>
		<div class="host-edit-form-sub-title">10MB이하의 이미지만 업로드 되며 이미지를 눌러 변경할 수 있습니다.</div>
		<div class="host-edit-form-body">
			<div class="host-edit-form-image-container">
				<div class="host-edit-form-image profile" style="<%="background: url(" + host.getProfilePath() + ") center center / cover no-repeat"%>"></div>
			</div>
		</div>
	</div>

	<div class="host-edit-form-field">
		<div class="host-edit-form-title">커버 이미지</div>
		<div class="host-edit-form-sub-title">이미지를 눌러 변경할 수 있으며 이미지 선택 후에는 선택영역을 지정해주세요.</div>
		<div class="host-edit-form-body">
			<div class="host-edit-form-image-container">
				<div class="host-edit-form-image cover" style="<%="background: url(" + host.getCoverPath() + ") center center / cover no-repeat"%>"></div>
			</div>
		</div>
	</div>
<!--
	<div class="host-edit-form-field">
		<div class="host-edit-form-title">호스트 테마 컬러</div>
		<div class="host-edit-form-body"></div>
	</div>
-->
	<div class="host-edit-form-field">
		<div class="host-edit-form-title">상세 소개</div>
		<div class="host-edit-form-body mce-wrapper"><%= host.getIntroduce() %></div>
	</div>

	<div class="host-edit-form-field">
		<div class="host-edit-form-title">주소</div>
		<div class="host-edit-form-body">
			<input name="venue" type="text" class="input-field" autocomplete="off" placeholder="청와대" value="<%= host.getVenue() %>">
			<div class="error-text hidden"></div>

			<!-- 지도 -->
			<div id="googleMap" style="width: 100%; height: 300px; margin-top: 10px;"></div>
		</div>
	</div>

	<div class="host-edit-form-field">
		<div class="host-edit-form-title">상세 주소</div>
		<div class="host-edit-form-sub-title">쉽게 찾아갈 수 있도록 정확한 주소를 입력해주세요.</div>
		<div class="host-edit-form-body">
			<input name="venue_detail" type="text" tabindex="15" class="input-field" placeholder="상춘관" value="<%= host.getDetailVenue() %>"/>
			<div class="error-text hidden"></div>
		</div>
	</div>


	<div class="host-edit-form-field">
		<div class="host-edit-form-title">멤버 등록</div>
		<div class="host-edit-form-sub-title">전화번호로 회원을 검색해 추가 할 수 있습니다. 삭제 하려면 추가된 전화번호 아이콘을 눌러주세요.</div>
		<div class="host-edit-form-body">
			<div class="preview-input-wrapper">
				<div class="preview-input-box">
					<input name="member" type="text" class="input-field" autocomplete="off">
				</div>
				<button name="add" class="preview-btn edit normal">추가</button>
				<div class="error-text hidden"></div>
			</div>
		</div>
		<style type="text/css">
			@media screen and (min-width: 64em) {
				.preview-wrapper.small {
					padding-left: 0;
					padding-right: 0;
					<% if(members.length <= 0) { %>
					display: none;
					<% } %>
				}
			}
		</style>
		<div id="memberList" class="preview-wrapper small" style=<%= (members.length > 0 ? "" : "display: none;") %>>
			<% for(int i = 0; i < ids.length; i++) { 
				if(members[i].equals(user.getUUID())){ %>
					<button class="preview-list-item"><%= ids[i] %></button>
				<% } else { %>
				<button class="preview-list-item clickable" onclick="removeMember(event)"><%= ids[i] %></button>
			<%  }} %>
		</div>
	</div>

	<div class="preview-btn-field" style="justify-content: flex-end;">
		<button type="button" name="confirm" class="form-button preview-confirm-btn">수정사항 반영하기</button>
	</div>
</div>