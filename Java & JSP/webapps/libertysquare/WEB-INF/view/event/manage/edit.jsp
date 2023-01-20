<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/event_new.css">
<div class="attendee-panel-container border-bottom">
	<div class="attendee-panel active" style="cursor: default">행사 수정</div>
	<!--
	<div class="attendee-panel">행사 정보</div>
	<div class="attendee-panel">티켓</div>
	<div class="attendee-panel">티켓 옵션(미개발)</div>
	-->
</div>

<form id="eventForm" class="event-new-form-wrapper" enctype="application/x-www-form-urlencoded" onkeydown="return event.key != 'Enter';">
	<article class="slot-wrapper">
		<div class="slot-head">
			<div class="slot-title">공개 여부</div>
			<div class="slot-desc">행사 공개를 하지 않으면 링크로는 행사를 접속 할 수 있지만 자유광장의 메인 페이지에는 나타나지 않습니다. 아직 공개 할 준비가 안 되어 있거나, 메인에 공개 하고 싶지 않으면 체크를 해제 하세요.</div>
		</div>
		<div class="slot-body">
			<input name="public_flag" class="event-new-chkbox" type="checkbox" value="true"/>
		</div>
	</article>

	<article class="slot-wrapper">
		<div class="slot-head">
			<div class="slot-title">행사 제목</div>
			<div class="slot-desc">주제를 잘 나타내는 멋진 제목을 입력해주세요.</div>
		</div>
		<div class="slot-body">
			<input name="title" type="text" class="input-field" autocomplete="off" placeholder="자유광장 아카데미"/>
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
				<input name="email" type="email" class="input-field" autocomplete="email" placeholder="이메일 주소를 입력해주세요."/>
			</div>
			<div class="sub-slot-wrapper">
				<div class="sub-slot-title">전화번호</div>
				<input name="tel" type="tel" class="input-field" autocomplete="tel" placeholder="전화번호를 입력해주세요."/>
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
			<input name="apply_link" type="url" class="input-field" autocomplete="off" placeholder="https://libertysquare.co.kr/"/>
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
					<input type="flatpickr" name="date_start" class="input-field datetime-picker-column" readonly/>
					<div type="time" name="time_start" class="input-field datetime-picker-column"></div>
				</div>
				<div name="time_error" class="error-text hidden">시작시간은 종료시간보다 이전이어야 합니다</div>
			</div>
			<div class="sub-slot-wrapper">
				<div class="sub-slot-title">종료</div>
				<div class="flex-wrapper">
					<input type="flatpickr" name="date_end" class="input-field datetime-picker-column" readonly/>
					<div type="time" name="time_end" class="input-field datetime-picker-column"></div>
				</div>
			</div>
		</div>
	</article>

	<article class="slot-wrapper">
		<div class="slot-head">
			<div class="slot-title">온라인 여부</div>
			<div class="slot-desc">온라인 행사 진행시 관련 플랫폼을 선택 합니다.</div>
		</div>
		<div class="slot-body">
			<input name="online_flag" class="event-new-chkbox" type="checkbox" value="true"/>
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
					<input type="radio" name="platform" class="event-new-radio" value="zoom">
					<label for="platform_zoom" class="event-new-radio-label">Zoom</label>
				</div>
				<div class="event-new-radio-wrapper">
					<input type="radio" name="platform" class="event-new-radio" value="custom">
					<label for="platform_custom" class="event-new-radio-label">사용자 지정</label>
				</div>
			</div>
		</article>

		<!-- platform_zoom -->
		<div id="zoom">
			<article class="slot-wrapper">
				<div class="slot-head">
					<div class="slot-title">행사 링크</div>
					<div class="slot-desc">Zoom 링크를 넣어주세요.</div>
				</div>
				<div class="slot-body">
					<input name="zoom_link" type="url" class="input-field" autocomplete="off" placeholder="줌 회의에 사용되는 링크를 입력해 주세요."/>
					<div class="error-text hidden"></div>
				</div>
			</article>
		
			<article class="slot-wrapper">
				<div class="slot-head">
					<div class="slot-title">암호</div>
					<div class="slot-desc">Zoom 암호가 있다면 입력해 주세요.</div>
				</div>
				<div class="slot-body">
					<input name="zoom_pwd" type="text" class="input-field" autocomplete="off" placeholder="입장 페이지에서 암호를 확인할 수 있습니다."/>
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
					<input name="platform_name" type="text" class="input-field" autocomplete="off" placeholder="Google Meet 등"/>
					<div class="error-text"></div>
				</div>
			</article>
		
			<article class="slot-wrapper">
				<div class="slot-head">
					<div class="slot-title">참여 방법</div>
					<div class="slot-desc">참가자들이 온라인 행사로 찾아갈 수 있는 방법을 설명해주세요.</div>
				</div>
				<div class="slot-body">
					<input name="platform_desc" type="text" class="input-field" autocomplete="off" placeholder="시작 당일 2시간 전에 이메일로 링크를 발송할 예정입니다."/>
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
				<input name="venue" type="text" class="input-field" placeholder="대한민국 서울특별시 강남구 삼성동 테헤란로 파르나스타워"/>
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
				<input name="venue_detail" type="text" class="input-field" placeholder="41층 그랜드볼룸"/>
				<div class="error-text hidden"></div>
			</div>
		</article>
	
		<article class="slot-wrapper">
			<div class="slot-head">
				<div class="slot-title">장소 설명</div>
				<div class="slot-desc">장소에 대해 안내가 필요하다면 적어주세요.</div>
			</div>
			<div class="slot-body">
				<input name="venue_desc" type="text" class="input-field" placeholder="주차는 인근 주차장에서 가능합니다."/>
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
			<div class="image-drop-zone">
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

	<article class="confirm-btn-container">
		<button type="submit" id="submitButton" class="confirm-btn">수정사항 반영<button>
	<article>
</form>

<!-- 임시 script -->
<script>
var gnbList = document.querySelectorAll(".manage-gnb-link");
gnbList[1].setAttribute('active', '');

window.addEventListener('load', function() {
	majax.once = false;

	majax.do("/event/info", "GET", "eventID=<%= eventID %>", function(xhr) {
		var data = JSON.parse(xhr.responseText);
		init(data);
	}, function(xhr) {
		alert("행사 정보를 불러오는데 실패하였습니다.");
		location.reload();
	});
});

function init(dataset) {
	var data = dataset.event;
	document.selectedType = data.type;
	document.querySelector("input[name='public_flag']").checked = data.status == 'PUBLIC';

	var applyLinkWrapper = document.querySelector("#applyLink");
	var applyLink = undefined;
	var applyChecker = undefined;
	var ticketList = new Array();
	if(document.selectedType != "OUTSIDE") {
		applyLinkWrapper.parentElement.removeChild(applyLinkWrapper);
		applyLinkWrapper = undefined;
	} else {
		applyLink = applyLinkWrapper.querySelector("input[name='apply_link']");
		applyLink.value = data.applyLink;
		applyChecker = InputEventListener.on(['input', 'focus'], applyLink, applyLink.nextElementSibling, 512, "행사 신청 링크를 입력해주세요.", function() {
			var regex = /^((http|https):\/\/)?(www.)?([a-zA-Z0-9]+)\.[a-z]+([a-zA-Z0-9.?#]+)?/;
			var replaceChar = /[^~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}0a-zA-Z0-9]/g;
			applyLink.value = applyLink.value.replace(replaceChar, "");
			if(!regex.test(applyLink.value)) {
				return "올바르지 않은 URL 링크 입니다.";
			}
		});
		ticketList = undefined;
	}
	
	loadCss(location.getResource("assets/flatpickr/flatpickr.min.css"));

	function parseDate(str) {
		var date = Date.parse(str);

		var current = Date.current();
		var isExpiredDay = date.getFullYear() < current.getFullYear() || date.getMonth() < current.getMonth() || date.getDate() < current.getDate();
		var isExpiredTime = date < current;

		return {
			date : date,
			dateString : Date.format(date, 'yyyy-MM-dd'),
			isExpiredDay : isExpiredDay,
			time : Date.format(date, 'HH:mm:00'),
			isExpiredTime : isExpiredTime
		};
	}
	var dtso = parseDate(data.dtStart);
	var dteo = parseDate(data.dtEnd);
	
	var dateChecker, timeChecker;
	loadJsList([location.getResource("assets/flatpickr/flatpickr-4.6.9.js"), location.getResource("js/dropdown.js"), location.getResource("js/ls/ticket.js")], function() {
		// flatpickr settings
		flatpickr.localize(flatpickr.l10ns.ko);

		// flatpickr settings
		var dateStart = document.querySelector("input[name='date_start']");
		dateStart.flatpickr({
				local: 'ko',
				minDate: dtso.date,
				defaultDate: dtso.date
			});
		if(dtso.isExpiredDay) {
			//dateStart._flatpickr.destroy();
			dateStart.disabled = true;
		}
		var dateEnd = document.querySelector("input[name='date_end']");
		dateEnd.flatpickr({
				local: 'ko',
				minDate: dteo.isExpiredDay ? dteo.date : "today",
				defaultDate: dteo.date
			});
		if(dteo.isExpiredDay) {
			//dateEnd._flatpickr.destroy();
			dateEnd.disabled = true;
		}
		dateChecker = flatpickrAutoSetter(dateStart, dateEnd);
	

		// dropdown settings
		var timePickerList = document.querySelectorAll("div[type='time']");
		
		timePickerList.forEach(function(elem) {
			elem.dropdown({scroll: 5});
		});
	
		var timeStart = document.querySelector("div[name='time_start']");
		timeStart._dropdown.selectValue(dtso.time);
		if(dtso.isExpiredTime) timeStart.setAttribute('disabled', '');
		var timeEnd = document.querySelector("div[name='time_end']");
		timeEnd._dropdown.selectValue(dteo.time);
		if(dteo.isExpiredTime) timeEnd.setAttribute('disabled', '');
		var timeError = document.querySelector("div[name='time_error']");
		timeChecker = dropdownAutoSetter(timeStart, timeEnd, timeError);
	
		// ticket settings
		var ticketAddBtn = document.querySelector(".ticket-add-btn");
		if(document.selectedType == "OUTSIDE") {
			var parent = ticketAddBtn.parentElement.parentElement;
			parent.parentElement.removeChild(parent);
			return;
		}
		
		var ticketError = ticketAddBtn.nextElementSibling;
		function checkTicketAmount() {
			if(ticketList.length > 0) {
				ticketError.classList.add("hidden");
			} else {
				ticketError.classList.remove("hidden");
			}
		}
	
		function newTicket(ticketData) {
			var ticket = Ticket.create(ticketAddBtn.parentElement, ticketAddBtn, ticketData);
			ticket.destroyListener = function() {
				var splice = ticketList.splice(ticketList.indexOf(ticket), 1);
				checkTicketAmount();
				return splice && splice.length;
			};
			ticketList.push(ticket);
	
	
			var temp = ticket.period.end;
			
			ticket.eventAndTicketEndDateChecker = function() {
				var eventDateObj = dateEnd._flatpickr.selectedDateElem.dateObj;
				var ticketDateObj = this._date._flatpickr.selectedDateElem.dateObj;
				if((eventDateObj < ticketDateObj) || (eventDateObj.getTime() == ticketDateObj.getTime() && timeEnd.value < this._time.value)) {
					this.error.classList.remove("hidden");
					return false;
				}
				this.error.classList.add("hidden");
				return true;
			}.bind(temp);
			dateEnd.addEventListener('change', ticket.eventAndTicketEndDateChecker);
			timeEnd.addEventListener('optionchange', ticket.eventAndTicketEndDateChecker);
			temp._date.addEventListener('change', ticket.eventAndTicketEndDateChecker);
			temp._time.addEventListener('optionchange', ticket.eventAndTicketEndDateChecker);
			
			checkTicketAmount();
		}
		ticketAddBtn.addEventListener('click', function(event) {
			event.preventDefault();
			newTicket();
		});
		for(var i = 0; i < dataset.ticket.length; i++) {
			newTicket(dataset.ticket[i]);
		}
	});
	
	loadJs("https://cdn.tiny.cloud/1/x3mzugv485f8ydwz41c9eioaa1q6afipoglhxehonabc52v0/tinymce/5/tinymce.min.js", function(){
		loadJsList([location.getResource("assets/tinymce/plugins/ImageUploader.min.js"), location.getResource("assets/tinymce/plugins/autolink.min.js")], function() {
			document.querySelector(".mce-wrapper").innerHTML = data.content;
			tinymce.init({
				selector: '.mce-wrapper',
				plugins: "link charmap autolink imageUploader paste media",
				toolbar: ["undo redo styleselect bold italic underline strikethrough", "charmap link imageUploader media"],
				menubar: false,
				statusbar: false,
				language: "ko_KR",
				height: "550px",
				width: "100%",
				body_class: "content-editor",
				content_style: ".content-editor{max-width:700px;margin:auto;padding:10px;color:#4a4a4a;font-family:Spoqa Han Sans,sans-serif}img{width:100%}.mce-object-iframe{width:calc(100% - 4px)}.mce-object-iframe>iframe{width:100%;border:0}p{font-size:14px;line-height:1.8}h3+p{margin-top:10px}h1{font-size:20px;line-height:2}*+h1{margin-top:40px}h2{font-size:18px;line-height:1.2}p+h2{margin-top:40px}h3{font-size:16px;margin-bottom:10px}p+h3{margin-top:25px}a{color:#ff4500;text-decoration:none;word-break:break-all}*{word-break:keep-all}@media screen and (min-width:800px){p{font-size:15px}h1{font-size:27px}h2{font-size:21px}h3{font-size:17px}.content-editor{margin-top:30px}}",
				object_resizing: false,
				forced_root_block: "p",
				paste_as_text: true,
				/* 사진 drag & drop - start */
				paste_data_images: true,
				automatic_uploads: true,
				images_upload_credentials: true,
				convert_urls : false,
				images_upload_handler: function (blob, success, failure, progress) {
					progress(0);
					majax.uploadImage(blob.blob(), undefined, function(ph) {
						success(ph);
					}, function(xhr) {
						failure('Image upload failed' + xhr ? '\n' + xhr.responseText : '', {remove: true});
					}, function(e) {
						progress(Math.floor(e.loaded / e.total * 100));
					});
				},
				/* 사진 drag & drop - end */
				default_link_target: "_blank",
				media_live_embeds: true,
				media_alt_source: false,
				media_poster: false,
				media_dimensions: false,
				style_formats:[{title:"\uc81c\ubaa91",block:"h1"},{title:"\uc81c\ubaa92",block:"h2"},{title:"\uc81c\ubaa93",block:"h3"},{title:"\ubcf8\ubb38",block:"p"}]
			});
		}); 
	});
	
	//var chkboxPublic = document.querySelector(".event-new-chkbox[name='public_flag']");
	var inputTitle = document.querySelector(".input-field[name='title']");
	inputTitle.value = data.title;
	var errorTitle = inputTitle.nextElementSibling;
	var titleChecker = InputEventListener.on(['input', 'focus'], inputTitle, errorTitle, 55, "제목을 입력해 주세요");
	
	var inputEmail = document.querySelector(".input-field[name='email']");
	if(data.contactEmail) inputEmail.value = data.contactEmail;
	var inputTel = document.querySelector(".input-field[name='tel']");
	if(data.contactTel) inputTel.value = data.contactTel;
	var errorContatct = document.querySelector(".error-text[name='contact']");
	var regTel = /^0([2-6][1-5]?[2-9]\d{2,3}|10\d{4})\d{4}$/;
	var regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	function contactError(msg, deny, normal) {
		if(Array.isArray(deny)) {
			deny.forEach(function(e) {e.className = "input-field deny"});
		} else {
			deny.className = "input-field deny";
		}
		if(normal) normal.className = "input-field";
		errorContatct.className = "error-text";
		errorContatct.textContent = msg;
	}
	
	function contactChecker() {
		var result = false;
		var email = inputEmail.value;
		var tel = inputTel.value;
	
		var isEmptyEmail = (email == "");
		var isEmptyTel = (tel == "");
		if(isEmptyEmail && isEmptyTel) {
			contactError("연락처는 최소 한 개 이상 입력해야 합니다.", [inputEmail, inputTel]);
		} else {
			if(email.length > 320) {
				inputEmail.value = email.substring(0, 320);
				contactError("이메일은 최대 320자까지 입력 가능합니다.", inputEmail, inputTel);
				return result;
			} else if(tel.length > 11) {
				inputTel.value = tel.substring(0, 11);
				contactError("전화번호는 최대 11자까지 입력 가능합니다.", inputTel, inputEmail);
				return result;
			}
	
			var emailFlag = !regEmail.test(email);
			var tellFlag = !regTel.test(tel);
			if(!isEmptyEmail && !isEmptyTel) {
				if(emailFlag && tellFlag) {
					contactError("정확한 이메일과 전화번호를 입력해주세요", [inputEmail, inputTel]);
				} else if(emailFlag) {
					contactError("정확한 이메일을 입력해주세요", inputEmail, inputTel);
				} else if(tellFlag) {
					contactError("정확한 전화번호를 입력해주세요", inputTel, inputEmail);
				} else result = true;
			} else if(isEmptyEmail && tellFlag) {
				contactError("정확한 전화번호를 입력해주세요", inputTel, inputEmail);
			} else if(isEmptyTel && emailFlag) {
				contactError("정확한 이메일을 입력해주세요", inputEmail, inputTel);
			} else result = true;
	
			if(result) {
				inputEmail.className = "input-field";
				inputTel.className = "input-field";
				errorContatct.className = "error-text hidden";
				errorContatct.textContent = "";
			}
		}
		return result;
	}
	inputEmail.addEventListener('input', contactChecker);
	inputEmail.addEventListener('focus', contactChecker);
	inputTel.addEventListener('input', contactChecker);
	inputTel.addEventListener('focus', contactChecker);
	var numberFilterRegex = /[^0-9]/g;
	inputTel.addEventListener('input', function() {
		inputTel.value = inputTel.value.replace(numberFilterRegex, '');
	}, true);
	contactChecker();
	
	
	
	// Online/Offline toggle
	var chkboxOnline = document.querySelector(".event-new-chkbox[name='online_flag']");
	chkboxOnline.checked = data.isOnline;
	var onlineContainer = document.querySelector("#online");
	var offlineContainer = document.querySelector("#offline");
	var platformZoomContainer = document.querySelector("#zoom");
	chkboxOnline.addEventListener('change', function() {
		if(chkboxOnline.checked) {
			onlineContainer.style.display = "block";
			offlineContainer.style.display = "none";
		} else {
			onlineContainer.style.display = "none";
			offlineContainer.style.display = "block";
		}
	});
	chkboxOnline.dispatchEvent(new Event("change"));
	
	// Online
	var platformZoom = document.querySelector(".event-new-radio[value='zoom']");
	var platformCustom = document.querySelector(".event-new-radio[value='custom']");
	var platformCustomContainer = document.querySelector("#custom");
	function platformChangeEventListener() {
		if(platformZoom.checked) {
			platformZoomContainer.style.display = "block";
			platformCustomContainer.style.display = "none";
		} else {
			platformZoomContainer.style.display = "none";
			platformCustomContainer.style.display = "block";
		}
	}
	platformZoom.addEventListener('change', platformChangeEventListener);
	platformCustom.addEventListener('change', platformChangeEventListener);
	
	// Online - Zoom
	var zoomLink = document.querySelector("input[name='zoom_link']");
	var zoomPwd = document.querySelector("input[name='zoom_pwd']");
	var zoomChecker = InputEventListener.on(['input', 'focus'], zoomLink, zoomLink.nextElementSibling, 512, "줌 링크 또는 회의 ID를 입력해주세요.", function() {
		var regex = /^((http|https):\/\/)?(www.)?([a-zA-Z0-9]+)\.[a-z]+([a-zA-Z0-9.?#]+)?/;
		var replaceChar = /[^~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}0a-zA-Z0-9]/g;
		zoomLink.value = zoomLink.value.replace(replaceChar, "");
		if(!isNaN(zoomLink.value)) {
			if(zoomLink.value.length != 10) {
				return "올바르지 않은 회의 ID 입니다.";
			}
		} else if(!regex.test(zoomLink.value)) {
			return "올바르지 않은 URL 링크 입니다.";
		}
	});
	InputEventListener.on(['input', 'focus'], zoomPwd, zoomPwd.nextElementSibling, 256);
	
	// Online - Custom
	var customPlatformName = document.querySelector("input[name='platform_name']");
	var customPlatformDesc = document.querySelector("input[name='platform_desc']");
	var platformNameChecker = InputEventListener.on(['input', 'focus'], customPlatformName, customPlatformName.nextElementSibling, 55, "온라인 플랫폼을 입력해주세요.");
	var platformDescChecker = InputEventListener.on(['input', 'focus'], customPlatformDesc, customPlatformDesc.nextElementSibling, 512, "참여 방법을 입력해주세요.");
	
	// Offline
	var venue = document.querySelector("input[name='venue']");
	var venueDetail = document.querySelector("input[name='venue_detail']");
	var venueDesc = document.querySelector("input[name='venue_desc']");
	var venueChecker = InputEventListener.on(['input', 'focus'], venue, venue.nextElementSibling, 55, "장소를 입력해주세요.");
	var venueDetailChecker = InputEventListener.on(['input', 'focus'], venueDetail, venueDetail.nextElementSibling, 512, "상세 주소를 입력해주세요.");
	var venueDescChecker = InputEventListener.on(['input', 'focus'], venueDesc, venueDesc.nextElementSibling, 256);
	
	loadJs(location.getResource("js/googlemaps.js"), function() {
		loadGoogleMap(document.getElementById("googleMap"), venue);
	});
	
	
	if(data.isOnline) {
		if(data.venue == "zoom") {
			platformZoom.checked = true;
			zoomLink.value = data.venueDetail;
			if(data.venueDesc) zoomPwd.value = data.venueDesc;
			zoomChecker();
		} else {
			platformCustom.checked = true;
			customPlatformName.value = data.venueDetail;
			if(data.venueDesc) customPlatformDesc.value = data.venueDesc;
			platformNameChecker();
			platformDescChecker();
		}
	} else {
		venue.value = data.venue;
		venueDetail.value = data.venueDetail;
		if(data.venueDesc) venueDesc.value = data.venueDesc;
		venueChecker();
		venue.dispatchEvent(new Event("change"));// 구글 맵 변경을 위함
		venueDetailChecker();
		venueDescChecker();
	}
	platformChangeEventListener();



	// 이미지
	var dropZone = document.querySelector(".image-drop-zone");
	var imageSelector = document.getElementById("imageSelector");
	
	function dragListener(event) {
		event.stopPropagation();
		event.preventDefault();
		dropZone.style.backgroundColor = (event.type == "dragover" ? "#d8d8d8" : "");
	};
	
	function dropListener(event) {
		event.stopPropagation();
		event.preventDefault();
		dropZone.style.backgroundColor = "";
		
		if(!event.dataTransfer && event.originalEvent) {
			event.dataTransfer = event.originalEvent.dataTransfer;
		}
		var files = event.currentTarget.files || event.dataTransfer.files;
		var f = files[0];
	
		if (files.length > 1) {
			alert('메인 이미지는 하나만 등록 가능합니다.');
		}else if (f.type.match(/image.*/)) {
			dropZone.loading();
			majax.uploadImage(f, undefined, function(path) {
				dropZone.replace(path);
			});
		}else{
			alert('사진 파일만 업로드 가능합니다.');
		}	   
	};
	
	dropZone.loading = function () {
		dropZone.clearChilds();
		dropZone.removeListener();
	
		var elem = document.createElement("div");
		elem.style.cssText = "width:30px; padding-top: 24px;";
		elem.className = "loading";
		dropZone.appendChild(elem);
	};
	
	dropZone.replace = function(path) {
		if(path) {
			dropZone.removeChild(dropZone.firstChild);// remove loading element
			dropZone.className = "image-drop-zone preview";
			dropZone.style.cssText = "background:url(" + path + ") no-repeat center center/cover;";
			dropZone._imagePath = path;

			var btn = document.createElement("button");
			btn.type = "button";
			btn.className = "delete-btn";
			btn.textContent = "삭제";
			btn.addEventListener('click', function() {
				dropZone.replace();
			});
			dropZone.bottom = dropZone.nextElementSibling;
			dropZone.parentElement.replaceChild(btn, dropZone.bottom);
		} else {
			if(dropZone._imagePath.startsWith("/image/temp")) deleteUploadedImage(dropZone._imagePath);
			dropZone.className = "image-drop-zone";
			dropZone.style.cssText = "";
			dropZone.reloadChilds();
			dropZone.parentElement.replaceChild(dropZone.bottom, dropZone.nextElementSibling);
			dropZone.initListener();
		}
	};
	
	dropZone.clearChilds = function() {
		dropZone.dropZoneChildren = document.querySelectorAll(".image-drop-zone > *");
		while(dropZone.hasChildNodes()) {
			dropZone.removeChild(dropZone.firstChild);
		}
	};
	
	dropZone.reloadChilds = function() {
		while(dropZone.hasChildNodes()) {
			dropZone.removeChild(dropZone.firstChild);
		}
		dropZone.dropZoneChildren.forEach(function(e) {
			dropZone.append(e);
		});
	};
	
	dropZone.initListener = function() {
		dropZone.addEventListener('dragover', dragListener);
		dropZone.addEventListener('dragleave', dragListener);
		dropZone.addEventListener('drop', dropListener);
		dropZone.addEventListener('click', imageSelector.openFileSelectorDialog);
	};
	
	dropZone.removeListener = function() {
		dropZone.removeEventListener('dragover', dragListener);
		dropZone.removeEventListener('dragleave', dragListener);
		dropZone.removeEventListener('drop', dropListener);
		dropZone.removeEventListener('click', imageSelector.openFileSelectorDialog);
	};

	dropZone.addEventListener('keydown', function(event) {
		var key = window.netscape ? event.which : event.keyCode;
		if(key == 9) {// tab키 누르면 tinymce로 focus 옮기기
			tinymce.activeEditor.focus();
			event.preventDefault();
		} else if(key == 13 || key == 32) { // enter || space 누르면 선택창 나오게
			dropZone.dispatchEvent(new Event("click"));
			event.preventDefault();
		}
	});
	
	function deleteUploadedImage(src) {
		if(src && src.startsWith("/image/temp")) {
			majax.do('/image', 'DELETE', "src=" + src);
		}
	}
	
	imageSelector.addEventListener('change', function(event) {
		dropListener(event);
		imageSelector.value = "";
	});
	imageSelector.openFileSelectorDialog = function() {
	   imageSelector.click();
	};
	
	dropZone.initListener();
	dropZone.loading();
	dropZone.replace(data.coverPath);
	
	function deleteUploadedImageAll() {
		if(!majax.uploadedImages) return;

		const paramObject = {
			param : undefined,
			append : function(src) {
				if(src) {
					this.param = "src=" + src;
					this.append = function(src) {
						if(src && src.startsWith("/image/temp")) {
							this.param += "&src=" + src;
						}
					};
				}
			}
		};
	
		for(var i = 0; i < majax.uploadedImages.length; i++) {
			paramObject.append(majax.uploadedImages[i]);
		}
	
		majax.do('/image', 'DELETE', paramObject.param);
		window.removeEventListener('unload', deleteUploadedImageAll);
	}
	window.addEventListener('unload', deleteUploadedImageAll);
	
	
	// send btn : create & setting
	var submitButton = document.getElementById("submitButton");
	var eventID = data.eventID;
	submitButton.addEventListener('click', function(event) {
		event.preventDefault();
		if(titleChecker()
			&& contactChecker()
			&& (applyChecker ? applyChecker() : true)
			&& !dateChecker()
			&& timeChecker()
			&& chkboxOnline.checked
				? (platformZoom.checked ? zoomChecker() : platformNameChecker() && platformDescChecker())
				: (venueChecker() && venueDetailChecker())
			&& dropZone._imagePath
			// Ticket List Check
			&& ticketList ? ticketList.some(function(t){return t.checkRequired() && t.eventAndTicketEndDateChecker();}) : true
		) {// if(true)
			// formdata 가져오기
			var formData = new FormData(document.querySelector("#eventForm"));
	
			formData.append("eventID", eventID);

			// applyLink 추가
			if(applyLink) {
				formData.append("apply_link", applyLink.value);
			}
	
			// 행사 시간 추가
			var timeStart = document.querySelector("div[name='time_start']");
			var timeEnd = document.querySelector("div[name='time_end']");
			formData.append("datetime_start", (dtso.isExpiredDay ? dtso.dateString : formData.get("date_start")) + " " + (dtso.isExpiredTime ? dtso.time : timeStart.value));
			formData.append("datetime_end", (dteo.isExpiredDay ? dteo.dateString : formData.get("date_end")) + " " + (dteo.isExpiredTime ? dteo.time : timeEnd.value));
			formData.delete("date_start");
			formData.delete("date_end");
			
			//메인 이미지
			if(!dropZone._imagePath.startsWith(location.getResource(''))) {
				formData.append("cover", dropZone._imagePath);
			}
	
			//컨텐트 & 이미지
			var content = tinymce.activeEditor.getContent();
			formData.append("content", content.length < 1 ? " " : content);
	
			var contentImageList = tinymce.activeEditor.contentDocument.images;
			for(var i = 0; i < contentImageList.length; i++) {
				var src = contentImageList[i].getAttribute("src");
				if(src.startsWith("blob")) {
					alert('내용 중, 업로드 중인 이미지가 존재합니다.\n잠시 후 다시 시도해주세요.');
					return;
				} else if(src.startsWith("/image/temp")) {
					formData.append("content_img", src);
				}
			}

			// venue, venue_detail, venue_desc 설정
			if(formData.has("online_flag")) {
				formData.delete("venue");
				formData.delete("venue_detail");
				formData.delete("venue_desc");

				var platform = formData.get("platform");
				formData.append("venue", platform);
				if(platform == "zoom") {
					formData.append("venue_detail", formData.get("zoom_link"));
					formData.append("venue_desc", formData.get("zoom_pwd"));
				} else if(platform == "custom") {
					formData.append("venue_detail", formData.get("platform_name"));
					formData.append("venue_desc", formData.get("platform_desc"));
				} else {
					alert("온라인 플랫폼 설정에 문제가 발견되었습니다.\n지속될 경우, 관리자에게 문의 바랍니다.");
					return;
				}
				
				formData.delete("platform");
				formData.delete("zoom_link");
				formData.delete("zoom_pwd");
				formData.delete("platform_name");
				formData.delete("platform_desc");
			}
	
			//티켓(json)
			if(ticketList) {
				ticketList.forEach(function(t) {
					formData.append("ticket", t.toJson());
				});
			}
	
	
			var data = "";
			var flag = false;
			for(let item of formData.entries()) {
				if(item[1].length < 1) continue;
				if(flag) data += "&";
				data += (item[0] + "=" + encodeURIComponent(item[1]));
				flag = true;
			}
	
			majax.load(document.body, "/event", "PATCH", data, undefined, true)
				.then(function(xhr) {
					alert("수정되었습니다.");
					location.href = '/';
				}).catch(function(xhr) {
					alert("행사를 수정하지 못하였습니다.\n반복될 경우, 고객센터로 문의 바랍니다.");
				});
		} else {
			alert("필수 항목을 전부 작성해 주세요.");
		}
	});
}
</script>