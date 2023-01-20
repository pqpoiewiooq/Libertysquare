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
            <div class="slot-desc">행사 공개를 하지 않으면 링크로는 행사를 접속 할 수 있지만 자유광장의 메인 페이지에는 나타나지 않습니다. 아직 공개 할 준비가 안 되어 있거나, 메인에 공개 하고 싶지 않으면 체크를 해제 하세요.</div>
        </div>
        <div class="slot-body">
            <input name="public_flag" class="event-new-chkbox" type="checkbox" tabindex="1" value="true" checked/>
        </div>
    </article>

    <article class="slot-wrapper">
        <div class="slot-head">
            <div class="slot-title">행사 제목</div>
            <div class="slot-desc">주제를 잘 나타내는 멋진 제목을 입력해주세요.</div>
        </div>
        <div class="slot-body">
            <input name="title" type="text" tabindex="2" class="input-field" autocomplete="off" placeholder="자유광장 아카데미"/>
            <div class="error-text"></div>
        </div>
    </article>

    <article class="slot-wrapper">
        <div class="slot-head">
            <div class="slot-title">주최자 연락처</div>
            <div class="slot-desc">참가자들이 행사에 대해 문의할 수 있는 수단이 최소 한 개 필요합니다. 이메일 혹은 전화번호중 최소 한 개는 입력해주세요. 연락처는 행사 페이지에 노출됩니다.</div>
        </div>
        <div class="slot-body">
            <div class="sub-slot-wrapper">
                <div class="sub-slot-title">이메일</div>
                <input name="email" type="email" tabindex="3" class="input-field" autocomplete="email" placeholder="이메일 주소를 입력해주세요."/>
            </div>
            <div class="sub-slot-wrapper">
                <div class="sub-slot-title">전화번호</div>
                <input name="tel" type="tel" tabindex="4" class="input-field" autocomplete="tel" placeholder="전화번호를 입력해주세요."/>
            </div>
            <div name="contact" class="error-text"></div>
        </div>
    </article>

    <article class="slot-wrapper" id="applyLink">
        <div class="slot-head">
            <div class="slot-title">행사 신청 링크</div>
            <div class="slot-desc">행사 신청을 누르면 이동할 링크를 넣어주세요.</div>
        </div>
        <div class="slot-body">
            <input name="apply_link" type="url" tabindex="5" class="input-field" autocomplete="off" placeholder="https://libertysquare.co.kr/"/>
            <div class="error-text hidden"></div>
        </div>
    </article>

    <article class="slot-wrapper">
        <div class="slot-head">
            <div class="slot-title">행사 날짜 및 시간</div>
            <div class="slot-desc">행사가 진행되는 날짜와 시간을 입력해주세요.</div>
        </div>
        <div class="slot-body">
            <div class="sub-slot-wrapper">
                <div class="sub-slot-title">시작</div>
                <div class="flex-wrapper">
                    <input type="flatpickr" tabindex="6" name="date_start" class="input-field datetime-picker-column" readonly/>
                    <div type="time" tabindex="7" name="time_start" class="input-field datetime-picker-column"></div>
                </div>
                <div name="time_error" class="error-text hidden">시작시간은 종료시간보다 이전이어야 합니다</div>
            </div>
            <div class="sub-slot-wrapper">
                <div class="sub-slot-title">종료</div>
                <div class="flex-wrapper">
                    <input type="flatpickr" tabindex="8" name="date_end" class="input-field datetime-picker-column" readonly/>
                    <div type="time" tabindex="9" name="time_end" class="input-field datetime-picker-column"></div>
                </div>
            </div>
        </div>
    </article>

    <article class="slot-wrapper">
        <div class="slot-head">
            <div class="slot-title">카테고리</div>
            <div class="slot-desc">행사의 주제에 알맞은 카테고리를 선택해주세요. 최대 3개 까지 가능 합니다.</div>
        </div>
        <div class="slot-body">
            <div name="category" class="input-field" tabindex="10"></div>
            <div class="error-text">카테고리를 1개 이상 선택해주세요.</div>
        </div>
    </article>

    <article class="slot-wrapper">
        <div class="slot-head">
            <div class="slot-title">행사 유형</div>
            <div class="slot-desc">행사의 방식이나 규모에 따라 행사 유형을 선택해주세요.</div>
        </div>
        <div class="slot-body">
            <div name="genre" class="input-field" tabindex="11"></div>
        </div>
    </article>

    <article class="slot-wrapper">
        <div class="slot-head">
            <div class="slot-title">해시태그</div>
            <div class="slot-desc">해시태그는 5개 까지 입력 가능 합니다. 삭제하려면 태그를 클릭하세요.</div>
        </div>
        <div class="slot-body">
            <div class="flex-wrapper">
                <input type="text" tabindex="12" name="hashtag" class="input-field" placeholder="자유광장_극강"/>
                <button type="button" class="preview-btn edit normal hashtag-add-btn">추가</button>
            </div>
            <div class="hashtag-container"></div>
        </div>
    </article>

    <article class="slot-wrapper">
        <div class="slot-head">
            <div class="slot-title">온라인 여부</div>
            <div class="slot-desc">온라인 행사 진행시 관련 플랫폼을 선택 합니다.</div>
        </div>
        <div class="slot-body">
            <input name="online_flag" class="event-new-chkbox" type="checkbox" tabindex="13" value="true"/>
        </div>
    </article>

    <!-- 온라인 -->
    <div id="online" style="display: none">
        <article class="slot-wrapper">
            <div class="slot-head">
                <div class="slot-title">온라인 플랫폼</div>
                <div class="slot-desc">참가자들이 이용할 플랫폼을 선택해주세요.</div>
            </div>
            <div class="slot-body">
                <div class="event-new-radio-wrapper">
                    <input type="radio" tabindex="14" name="platform" class="event-new-radio" value="zoom" checked>
                    <label for="platform_zoom" class="event-new-radio-label">Zoom</label>
                </div>
                <div class="event-new-radio-wrapper">
                    <input type="radio" tabindex="15" name="platform" class="event-new-radio" value="custom">
                    <label for="platform_custom" class="event-new-radio-label">사용자 지정</label>
                </div>
            </div>
        </article>

        <!-- platform_zoom -->
        <div id="zoom">
            <article class="slot-wrapper">
                <div class="slot-head">
                    <div class="slot-title">링크 또는 회의 ID</div>
                    <div class="slot-desc">참가자들이 행사에 참여할 수 있는 수단이 최소 한 개 필요합니다. 링크 또는 회의 ID 중 최소 한 개는 입력해 주세요. 관련 정보는 티켓을 구매한 회원들에게만 공개됩니다.</div>
                </div>
                <div class="slot-body">
                    <input name="zoom_link" type="url" tabindex="14" class="input-field" autocomplete="off" placeholder="줌 회의에 사용되는 링크 또는 회의 ID 중 하나를 입력해 주세요."/>
                    <div class="error-text hidden"></div>
                </div>
            </article>
        
            <article class="slot-wrapper">
                <div class="slot-head">
                    <div class="slot-title">암호</div>
                    <div class="slot-desc">Zoom 암호가 있다면 입력해 주세요.</div>
                </div>
                <div class="slot-body">
                    <input name="zoom_pwd" type="text" tabindex="15" class="input-field" autocomplete="off" placeholder="입장 페이지에서 암호를 확인할 수 있습니다."/>
                    <div class="error-text hidden"></div>
                </div>
            </article>
        </div>
        <!-- platform_zoom end -->

        <!-- platform_custom -->
        <div id="custom" style="display: none">
            <article class="slot-wrapper">
                <div class="slot-head">
                    <div class="slot-title">온라인 플랫폼</div>
                    <div class="slot-desc">참가자들이 이용할 플랫폼을 입력해주세요.</div>
                </div>
                <div class="slot-body">
                    <input name="platform_name" type="text" tabindex="14" class="input-field" autocomplete="off" placeholder="Google Meet 등"/>
                    <div class="error-text"></div>
                </div>
            </article>
        
            <article class="slot-wrapper">
                <div class="slot-head">
                    <div class="slot-title">참여 방법</div>
                    <div class="slot-desc">참가자들이 온라인 행사로 찾아갈 수 있는 방법을 설명해주세요.</div>
                </div>
                <div class="slot-body">
                    <input name="platform_desc" type="text" tabindex="15" class="input-field" autocomplete="off" placeholder="시작 당일 2시간 전에 이메일로 링크를 발송할 예정입니다."/>
                    <div class="error-text"></div>
                </div>
            </article>
        </div>
        <!-- platform_custom end -->
    </div>
    <!-- 온라인 END-->

    <!-- 오프라인 -->
    <div id="offline">
        <article class="slot-wrapper">
            <div class="slot-head">
                <div class="slot-title">주소</div>
                <div class="slot-desc">행사는 어떤 장소에서 진행되나요?</div>
            </div>
            <div class="slot-body">
                <input name="venue" type="text" tabindex="14" class="input-field" placeholder="대한민국 서울특별시 강남구 삼성동 테헤란로 파르나스타워"/>
                <div class="error-text hidden"></div>
                <!-- 지도 -->
                <div id="googleMap"></div>
            </div>
        </article>
    
        <article class="slot-wrapper">
            <div class="slot-head">
                <div class="slot-title">상세 주소</div>
                <div class="slot-desc">쉽게 찾아갈 수 있도록 정확한 주소를 입력해주세요.</div>
            </div>
            <div class="slot-body">
                <input name="venue_detail" type="text" tabindex="15" class="input-field" placeholder="41층 그랜드볼룸"/>
                <div class="error-text hidden"></div>
            </div>
        </article>
    
        <article class="slot-wrapper">
            <div class="slot-head">
                <div class="slot-title">장소 설명</div>
                <div class="slot-desc">장소에 대해 안내가 필요하다면 적어주세요.</div>
            </div>
            <div class="slot-body">
                <input name="venue_desc" type="text" tabindex="16" class="input-field" placeholder="주차는 인근 주차장에서 가능합니다."/>
                <div class="error-text hidden"></div>
            </div>
        </article>
    </div>
    <!-- 오프라인 END-->

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
            <div class="error-text">메인 이미지를 업로드 해주세요.</div>
        </div>
    </article>

    <article class="slot-wrapper full">
        <div class="slot-head">
            <div class="slot-title">내용</div>
            <div class="slot-desc">행사의 상세한 내용을 알리는 글을 작성해주세요.</div>
        </div>
        <div class="slot-body">
            <div class="mce-wrapper"></div>
        </div>
    </article>

    <article class="slot-wrapper full">
        <div class="slot-head">
            <div class="slot-title">티켓</div>
            <div class="slot-desc">판매할 티켓을 설정해주세요.</div>
        </div>
        <div class="slot-body">
            <button type="button" class="ticket-add-btn">+ 티켓 추가</button>
            <div class="error-text">티켓은 최소 한 개 이상이어야 합니다.</div>
        </div>
    </article>

    <article class="confirm-btn-container right">
        <button type="submit" id="submitButton" class="confirm-btn">행사 주최하기<button>
    <article>
</form>