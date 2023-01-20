<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<link rel="stylesheet" type="text/css" href="https://ls2020.cafe24.com/css/ls/event_new.css">
<div class="attendee-panel-container border-bottom">
	<div class="attendee-panel active" style="cursor: default">후원 수정</div>
</div>

<form id="eventForm" class="event-new-form-wrapper" enctype="application/x-www-form-urlencoded" onkeydown="return event.key != 'Enter';">
	<article class="slot-wrapper">
		<div class="slot-head">
			<div class="slot-title">공개 여부</div>
			<div class="slot-desc">후원 공개를 하지 않으면 링크로는 후원 페이지에 접속 할 수 있지만 자유광장의 메인 페이지에는 나타나지 않습니다. 아직 공개 할 준비가 안 되어 있거나, 메인에 공개 하고 싶지 않으면 체크를 해제 하세요.</div>
		</div>
		<div class="slot-body">
			<input name="public_flag" class="event-new-chkbox" type="checkbox" value="true"/>
		</div>
	</article>

	<article class="slot-wrapper">
		<div class="slot-head">
			<div class="slot-title">후원 제목</div>
			<div class="slot-desc">주제를 잘 나타내는 멋진 제목을 입력해주세요.</div>
		</div>
		<div class="slot-body">
			<input name="title" type="text" class="input-field" autocomplete="off" placeholder="자유광장"/>
			<div class="error-text"></div>
		</div>
	</article>

	<article class="slot-wrapper">
		<div class="slot-head">
			<div class="slot-title">주최자 연락처</div>
			<div class="slot-desc">후원자들이 후원에 대해 문의할 수 있는 수단이 최소 한 개 필요합니다. 이메일 혹은 전화번호중 최소 한 개는 입력해주세요. 연락처는 후원 페이지에 노출됩니다.</div>
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
			<div class="slot-desc">후원 페이지에 표시될 상세한 내용을 작성해주세요.</div>
		</div>
		<div class="slot-body">
			<div class="mce-wrapper"></div>
		</div>
	</article>

	<article class="confirm-btn-container">
		<button type="submit" id="submitButton" class="confirm-btn">수정사항 반영<button>
	<article>
</form>

<!-- 임시 script -->
<script>
window.addEventListener('load', function() {
	majax.once = false;

	majax.do("https://api.libertysquare.co.kr/support/info", "GET", "id=<%= id %>", function(xhr) {
		var data = JSON.parse(xhr.responseText);
		init(data);
	}, function(xhr) {
		alert("행사 정보를 불러오는데 실패하였습니다.");
		location.reload();
	});
});

function init(data) {
	document.querySelector("input[name='public_flag']").checked = data.isPublic;

	const inputLink = document.querySelector("input[name='link']");
	const inputBank = document.querySelector("[name='bank']");
	const inputAccount = inputBank.nextElementSibling;
	const inputHolder = inputAccount.nextElementSibling;
	const applyErrorElem = inputBank.parentElement.nextElementSibling;
	const accountElems = [inputBank, inputAccount, inputHolder];

	function applyError(msg, deny, normal) {
		if(Array.isArray(deny)) {
			deny.forEach(function(e) {e.classList.add("deny");});
		} else {
			deny.classList.add("deny");
		}
		if(normal) {
			if(Array.isArray(normal)) normal.forEach(function(e) {e.classList.remove("deny");});
			else normal.classList.remove("deny");
		}
		applyErrorElem.className = "error-text";
		applyErrorElem.textContent = msg;
	}
	const linkFilter = /[^~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}0a-zA-Z0-9]/g;
	const linkRegex = /^((http|https):\/\/)?(www.)?([a-zA-Z0-9]+)\.[a-z]+([a-zA-Z0-9.?#]+)?/;
	function applyChecker() {
		var result = false;
		inputLink.value = inputLink.value.replace(linkFilter, '');
		const link = inputLink.value;
		const bank = inputBank.value;

		const isEmptyLink = (link ? false : true);
		const isEmptyBank = (bank ? false : true);
		if(bank) {
			inputBank.style.color = "";
		} else {
			inputBank.style.color = "#c8c8c8";
			inputAccount.style.display = "none";
			inputHolder.style.display = "none";
		}
	
		if(isEmptyLink && isEmptyBank) {
			applyError("후원할 수 있는 수단이 최소 한 개 필요합니다.", [inputLink, inputBank]);
		} else {
			if(link.length > 512) {
				inputLink.value = link.substring(0, 512);
				applyError("링크는 최대 512자까지 입력 가능합니다.", inputLink, accountElems);
				return result;
			}

			const linkFlag = !linkRegex.test(link);
			let accountFlag = true;// 계좌번호 검증
			if(!isEmptyBank) {
				inputAccount.style.display = "block";
				const account = inputAccount.value;
				if(account) {
					if(account.length > 20) {
						inputAccount.value = account.substring(0, 20);
						applyError("계좌번호는 최대 20자까지 입력 가능합니다.", inputAccount);
						return result;
					}
					inputHolder.style.display = "block";
					const holder = inputHolder.value;
					if(holder) {
						if(holder.length > 50) {
							inputHolder.value = holder.substring(0, 50);
							applyError("예금주는 최대 50자까지 입력 가능합니다.", inputHolder);
							return result;
						}
						//검증 api 필요
						accountFlag = false;
					}
				} else inputHolder.style.display = "none";
			}

			if(!isEmptyLink && !isEmptyBank) {
				if(linkFlag && accountFlag) {
					applyError("정확한 링크와 계좌를 입력해 주세요.", [inputLink, ...accountElems]);
				} else if(linkFlag) {
					applyError("정확한 링크를 입력해 주세요.", inputLink, accountElems);
				} else if(accountFlag) {
					applyError("정확한 계좌를 입력해 주세요.", accountElems, inputLink);
				} else result = true;
			} else if(isEmptyBank && linkFlag) {
				applyError("정확한 링크를 입력해 주세요.", inputLink, accountElems);
			} else if(isEmptyLink && accountFlag) {
				applyError("정확한 계좌를 입력해 주세요.", accountElems, inputLink);
			} else result = true;

			if(result) {
				inputLink.classList.remove("deny");
				inputBank.classList.remove("deny");
				inputAccount.classList.remove("deny");
				inputHolder.classList.remove("deny");
				applyErrorElem.className = "error-text hidden";
				applyErrorElem.textContent = "";
			}
		}

		return result;
	}
	inputLink.addEventListener('input', applyChecker);
	inputLink.addEventListener('focus', applyChecker);
	inputBank.addEventListener('optionchange', applyChecker);
	inputAccount.addEventListener('input', applyChecker);
	inputAccount.addEventListener('focus', applyChecker);
	inputHolder.addEventListener('input', applyChecker);
	inputHolder.addEventListener('focus', applyChecker);
	if(data.link) inputLink.value = data.link;
	
	loadJs(location.getResource("js/dropdown.js"), function() {
		inputBank.dropdown({option: {
			"은행을 선택해 주세요." : 0,
			"하나은행" : 1,
			"산업은행" : 2,
			"기업은행" : 3,
			"국민은행" : 4,
			"수협은행" : 7,
			"농협은행" : 11,
			"우리은행" : 20,
			"제일은행" : 23,
			"시티은행" : 27,
			"대구은행" : 31,
			"부산은행" : 32,
			"경남은행" : 39,
			"새마을금고" : 45,
			"신협" : 48,
			"우체국" : 71,
			"신한은행" : 88,
			"케이뱅크" : 89,
			"카카오뱅크" : 90,
			"토스뱅크" : 92,
		}, scroll: 5 });
		if(data.account) {
			inputBank._dropdown.selectValue(data.account.bank);
			inputAccount.value = data.account.number;
			inputHolder.value = data.account.holder;
		}
		applyChecker();
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


	// 이미지
	/*** Cover Image Start ***/
	if(typeof(Croppr) == "undefined") {
		loadJsList([location.getResource("assets/croppr/croppr.min.js"), "https://cdn.jsdelivr.net/gh/fengyuanchen/compressorjs/dist/compressor.min.js"]);
		loadCss(location.getResource("assets/croppr/croppr.min.css"));
	}

	var dropZone = document.querySelector(".image-drop-zone");
	var imageSelector = document.getElementById("imageSelector");
	var dropZoneError = dropZone.nextElementSibling;
	
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
			let fileReader = new FileReader();
			const fname = f.name;
			fileReader.onload = function(e) {
				const dataURL = e.target.result;

				let parent = dropZone.parentElement;
				let tempImg = document.createElement("img");
				tempImg.src = dataURL;
				let btn = document.createElement("button");
		
				btn.className = "form-button preview-confirm-btn";
				btn.textContent = "선택영역만큼 자르기";
				btn.style.cssText = "margin: 10px auto 0 auto; padding: 5px 20px; width: auto; height: auto; font-size: 13px;";
				
				dropZone.style.display = "none";
				dropZoneError.style.display = "none";
				parent.append(tempImg);
				parent.append(btn);

				const croppr = new Croppr(tempImg, {aspectRatio: 0.5625});

				btn.addEventListener('click', function(event) {
					event.preventDefault();

					if(dataURL.startsWith("data:image/gif")) {
						function uploadCroppedGif() {
							const cropRect = croppr.getValue();
							var rub = new SuperGif({ gif: croppr.imageEl } );
							rub.load(function(){
								const imageDataList = rub.get_crop_data_list(cropRect);
								
								var ge = new GIFEncoder();
								ge.setRepeat(0);
								ge.setFrameRate(60);
								ge.setSize(cropRect.width, cropRect.height);
					
								ge.start();
								for(var i = 0; i < imageDataList.length; i++) {
									var data = imageDataList[i];
									ge.setDelay(data.delay);
									ge.addFrame(data.data, true);
								}
								ge.finish();
					
								const binary_gif = ge.stream().getData();
								
								croppr.destroy();
								tempImg.remove();
								btn.remove();
								dropZone.style.display = "";
								dropZoneError.style.display = "";
								
								var length = binary_gif.length;
								var tempArray = new Uint8Array(length);
								for (var i = 0; i < length; i++){
									tempArray[i] = binary_gif.charCodeAt(i);
								}
					
								const blob = new Blob([tempArray], { type: "image/gif" });
								blob.name = fname;

								majax.uploadImage(blob, undefined, function(path) {
									dropZone.replace(path);
								});
							});
						}
						if(typeof(SuperGif) == "undefined") {
							loadJs(location.getResource("assets/croppr/giflib.min.js"), uploadCroppedGif);
						} else uploadCroppedGif();
					} else {
						const cropRect = croppr.getValue();
						const canvas = document.createElement("canvas");
						const context = canvas.getContext("2d");
						canvas.width = cropRect.width;
						canvas.height = cropRect.height;
						context.drawImage(
							croppr.imageEl,
							cropRect.x,
							cropRect.y,
							cropRect.width,
							cropRect.height,
							0,
							0,
							canvas.width,
							canvas.height,
						);

						canvas.toBlob(function(blob) {
							new Compressor(blob, {
								strict: true,
								width: 850,
								success: function (result) {
									croppr.destroy();

									tempImg.remove();
									btn.remove();
									dropZone.style.display = "";
									dropZoneError.style.display = "";
									result.name = fname;
									majax.uploadImage(result, undefined, function(path) {
										dropZone.replace(path);
									});
								}
							});
						});
					}
				});
			};
			fileReader.readAsDataURL(f);
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
			deleteUploadedImage(dropZone._imagePath);
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
			majax.do('https://api.libertysquare.co.kr/image', 'DELETE', "src=" + src);
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
	
	function deleteUploadedImageAll() {
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
	
		paramObject.append(dropZone._imagePath);
		var mceImages = tinymce.activeEditor.contentDocument.images;
		for(var i = 0; i < mceImages.length; i++) {
			paramObject.append(mceImages[i].getAttribute("src"));
		}
	
		majax.do('https://api.libertysquare.co.kr/image', 'DELETE', paramObject.param);
		window.removeEventListener('unload', deleteUploadedImageAll);
	}
	window.addEventListener('unload', deleteUploadedImageAll);

	dropZone.initListener();
	dropZone.loading();
	dropZone.replace(data.coverPath);

	/*** Cover Image End ***/
	
	// send btn : create & setting
	var submitButton = document.getElementById("submitButton");
	const id = data.id;
	submitButton.addEventListener('click', function(event) {
		event.preventDefault();
		if(titleChecker()
			&& contactChecker()
			&& (applyChecker ? applyChecker() : true)
			&& dropZone._imagePath
		) {// if(true)
			// formdata 가져오기
			var formData = new FormData(document.querySelector("#eventForm"));
			
			formData.append("id", id);

			// 후원 방법 추가
			const account = formData.get("account");
			formData.delete("account");
			const holder = formData.get("holder");
			formData.delete("holder");
			if(inputBank.value && account && holder) {
				formData.append("account", JSON.stringify({
					bank: inputBank.value,
					number: account,
					holder: holder
				}));
			}
			
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
	
	
			var data = "";
			var flag = false;
			for(let item of formData.entries()) {
				if(item[1].length < 1) continue;
				if(flag) data += "&";
				data += (item[0] + "=" + encodeURIComponent(item[1]));
				flag = true;
			}
	
			majax.load(document.body, "https://api.libertysquare.co.kr/support", "PATCH", data, undefined, true)
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