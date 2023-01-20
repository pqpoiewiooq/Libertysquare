<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="data.Host"%>
<%
	Host host = (Host) session.getAttribute("selectedHost");
    String[] idArray = (String[]) session.getAttribute("selectedHostMemberIDs");
	if(host == null || idArray == null) {
        if(host == null) out.print("host");
        if(idArray == null) out.print("id");
        //response.sendRedirect("/event/new");
        return;
    }
%>

<article>
    <div class="slot-head">
        <div class="slot-title">주최 호스트</div>
        <div class="slot-desc"></div>
    </div>
    <div class="slot-body">
        <div class="preview-wrapper">
            <div class="preview-title"><%= host.getName() %></div>
            <div class="preview-desc"><%= host.getIntroduceSimple() %></div>
            <div class="preview-list-wrapper"><% for(String member : idArray) { %><button type="button" class="preview-list-item"><%= member %></button><% } %></div>
        </div>
    </div>
</article>
<form id="eventForm" class="event-new-form-wrapper" enctype="application/x-www-form-urlencoded" onkeydown="return event.key != 'Enter';">
    <article class="slot-wrapper">
        <div class="slot-head">
            <div class="slot-title">공개 여부</div>
            <div class="slot-desc">후원 공개를 하지 않으면 링크로는 후원 페이지에 접속 할 수 있지만 자유광장의 메인 페이지에는 나타나지 않습니다. 아직 공개 할 준비가 안 되어 있거나, 메인에 공개 하고 싶지 않으면 체크를 해제 하세요.</div>
        </div>
        <div class="slot-body">
            <input name="public_flag" class="event-new-chkbox" type="checkbox" tabindex="1" value="true" checked/>
        </div>
    </article>

    <article class="slot-wrapper">
        <div class="slot-head">
            <div class="slot-title">후원 제목</div>
            <div class="slot-desc">주제를 잘 나타내는 멋진 제목을 입력해 주세요.</div>
        </div>
        <div class="slot-body">
            <input name="title" type="text" tabindex="2" class="input-field" autocomplete="off" placeholder="자유광장 후원"/>
            <div class="error-text"></div>
        </div>
    </article>

    <article class="slot-wrapper">
        <div class="slot-head">
            <div class="slot-title">주최자 연락처</div>
            <div class="slot-desc">후원자들이 후원에 대해 문의할 수 있는 수단이 최소 한 개 필요합니다. 이메일 혹은 전화번호중 최소 한 개는 입력해 주세요. 연락처는 후원 페이지에 노출됩니다.</div>
        </div>
        <div class="slot-body">
            <div class="sub-slot-wrapper">
                <div class="sub-slot-title">이메일</div>
                <input name="email" type="email" tabindex="3" class="input-field" autocomplete="email" placeholder="이메일 주소를 입력해 주세요."/>
            </div>
            <div class="sub-slot-wrapper">
                <div class="sub-slot-title">전화번호</div>
                <input name="tel" type="tel" tabindex="4" class="input-field" autocomplete="tel" placeholder="전화번호를 입력해 주세요."/>
            </div>
            <div name="contact" class="error-text"></div>
        </div>
    </article>

    <article class="slot-wrapper">
        <div class="slot-head">
            <div class="slot-title">후원 방법</div>
            <div class="slot-desc">후원자들이 후원할 수 있는 수단이 최소 한 개 필요합니다. 링크 혹은 계좌번호 중 최소 한 개는 입력해 주세요. 계좌번호는 연락처는 후원 페이지에 노출됩니다.</div>
        </div>
        <div class="slot-body">
			<div class="sub-slot-wrapper">
				<div class="sub-slot-title">링크</div>
                <input name="link" type="url" tabindex="5" class="input-field" autocomplete="off" placeholder="https://libertysquare.co.kr/"/>
			</div>
			<div class="sub-slot-wrapper">
				<div class="sub-slot-title">계좌</div>
				<div name="bank" class="input-field" tabindex="6" style="margin-bottom: 10px;"></div>
				<input name="account" type="text" tabindex="7" class="input-field" autocomplete="account" placeholder="계좌번호(숫자만)를 입력해 주세요." style="margin-bottom: 10px; display: none;"/>
				<input name="holder" type="name" tabindex="8" class="input-field" autocomplete="tel" placeholder="예금주를 입력해 주세요." style="display: none"/>
			</div>
            <div class="error-text hidden"></div>
        </div>
    </article>

    <article class="slot-wrapper">
        <div class="slot-head">
            <div class="slot-title">카테고리</div>
            <div class="slot-desc">후원의 주제에 알맞은 카테고리를 선택해 주세요. 최대 3개 까지 가능 합니다.</div>
        </div>
        <div class="slot-body">
            <div name="category" class="input-field" tabindex="10"></div>
            <div class="error-text">카테고리를 1개 이상 선택해 주세요.</div>
        </div>
    </article>

    <article class="slot-wrapper">
        <div class="slot-head">
            <div class="slot-title">후원단체 종류</div>
            <div class="slot-desc">단체의 종류를 선택해 주세요.</div>
        </div>
        <div class="slot-body">
            <div name="businessType" class="input-field" tabindex="11"></div>
        </div>
    </article>

    <article class="slot-wrapper">
        <div class="slot-head">
            <div class="slot-title">해시태그</div>
            <div class="slot-desc">해시태그는 5개 까지 입력 가능 합니다. 삭제하려면 태그를 클릭하세요.</div>
        </div>
        <div class="slot-body">
            <div class="flex-wrapper">
                <input type="text" tabindex="12" name="hashtag" class="input-field" placeholder="자유광장"/>
                <button type="button" class="preview-btn edit normal hashtag-add-btn">추가</button>
            </div>
            <div class="hashtag-container"></div>
        </div>
    </article>

    <article class="slot-wrapper">
        <div class="slot-head">
            <div class="slot-title">대표 이미지</div>
            <div class="slot-desc">이미지에 글자가 많으면 매력적이지 않습니다.</div>
        </div>
        <div class="slot-body">
            <div class="image-drop-zone" tabindex="19">
                <p>
                    <svg viewBox="0 0 24 24" height="3em" width="3em" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="Upload-sc-169zxg1-0 eLyUFE">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>,<polyline points="17 8 12 3 7 8"></polyline>,<line x1="12" x2="12" y1="3" y2="15"></line>
                    </svg>
                </p>
                <p>10MB 이하의 png, jpg, jpeg, gif 이미지만 업로드 가능합니다.</p>
                <p>16:9 비율의 이미지가 가장 잘 어울립니다.</p>
                <input accept="image/jpeg, image/png, image/jpg, image/gif" type="file" style="display: none;" id="imageSelector"/>
            </div>
            <div class="error-text">메인 이미지를 업로드 해 주세요.</div>
        </div>
    </article>

    <article class="slot-wrapper full">
        <div class="slot-head">
            <div class="slot-title">내용</div>
            <div class="slot-desc">후원 페이지에 표시될 상세한 내용을 작성해 주세요.</div>
        </div>
        <div class="slot-body">
            <div class="mce-wrapper"></div>
        </div>
    </article>

	<article class="event-new-terms-container">
        <input class="event-new-chkbox js-terms" type="checkbox" value="terms" placeholder="terms"/>
        <div class="event-new-terms">
            <a target="_blank" href="/document/help#support-host">후원단체 안내사항</a>을 읽었습니다. 또한 <a target="_blank" href="/document/terms">자유광장 이용약관</a> 및 <a target="_blank" href="/document/code-of-conduct">Libertysquare Code of Conduct</a>를 준수할 것을 동의합니다.
        </div>
    </article>

    <article class="confirm-btn-container right">
        <button type="submit" id="submitButton" class="confirm-btn" disabled>후원 등록하기<button>
    <article>
</form>