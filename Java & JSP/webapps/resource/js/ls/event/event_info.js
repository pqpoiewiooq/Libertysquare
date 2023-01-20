(function() {
	majax.once = false;

	var applyLinkWrapper = document.querySelector("#applyLink");
	var applyLink = undefined;
	var applyChecker = undefined;
	var ticketList = new Array();
	if(document.selectedType != "OUTSIDE") {
		applyLinkWrapper.parentElement.removeChild(applyLinkWrapper);
		applyLinkWrapper = undefined;
	} else {
		applyLink = applyLinkWrapper.querySelector("input[name='apply_link']");
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
	
	var dateStart = document.querySelector("input[name='date_start']");
	var dateEnd = document.querySelector("input[name='date_end']");
	var dateChecker, timeChecker;
	var category = document.querySelector("div[name='category']");
	var genre = document.querySelector("div[name='genre']");
	loadJsList([location.getResource("assets/flatpickr/flatpickr-4.6.9.js"), location.getResource("js/dropdown.js"), location.getResource("/js/ls/ticket.js")], function() {
		// flatpickr settings
		flatpickr.localize(flatpickr.l10ns.ko);
		var pickrList = document.querySelectorAll("input[type='flatpickr']")
		pickrList.forEach(function(elem) {
			elem.flatpickr({
				local: 'ko',
				minDate: "today",
				defaultDate: new Date()
			});
		});
	
		dateChecker = flatpickrAutoSetter(dateStart, dateEnd);
	
		// dropdown settings
		var timePickerList = document.querySelectorAll("div[type='time']");
		
		timePickerList.forEach(function(elem) {
			elem.dropdown({scroll: 5});
		});
		
		category.dropdown({option: {"경제" : "ECONOMY",
									"철학" : "PHILOSOPHY",
									"자격증" : "CERTIFICATE",
									"정치" : "POLITICS",
									"공부" : "STUDY",
									"취미" : "HOBBY",
									"금융" : "FINANCE",
									"파티" : "PARTY",
									"독서" : "READING",
									"자기계발" : "SELF_IMPROVEMENT",
									"비즈니스" : "BUSINESS",
									"여행" : "TRAVEL",
									"홈&라이프스타일" : "HOME_AND_LIFESTYLE",
									"토론" : "DISCUSSION",
									"북콘서트" : "BOOK_CONCERT"}, scroll: 5, init: false});
		function addCategory(str, value) {
			var item = document.createElement("span");
			item.className = "category-item";
			var icon = document.createElement("span");
			icon.className = "category-item-icon";
			icon.textContent = "×";
			var text = document.createElement("span");
			text.className = "category-item-text";
			text.textContent = str;
	
			icon.addEventListener('click', function(event) {
				event.stopImmediatePropagation();
				var target = event.currentTarget.parentElement;
				target.parentElement.removeChild(target);
				if(!category.hasChildNodes()) {
					category.classList.add("deny");
					category.nextElementSibling.className = "error-text";
				}
			});
			item.value = value;
	
			item.appendChild(icon);
			item.appendChild(text);
			category.appendChild(item);
	
			category.classList.remove("deny");
			category.nextElementSibling.className = "error-text hidden";
		}
		category.addEventListener('optionselect', function(event) {
			event.preventDefault();
	
			var children = category.children;
			var count = children.length;
			if(count < 3){
				var text = event.detail.after["text"];
				var value = event.detail.after["value"];
				for(var i = 0; i < count; i++) {
					if(children[i].value == value) return;
				}
				addCategory(text, value);
			}
		});
		category.classList.add("deny");
	
		genre.dropdown({option: {"클래스" : "CLASS",
								"컨퍼런스 · 세미나" : "CONFERENCE_SEMINAR",
								"라이프스타일" : "LIFESTYLE"}});
	
		var timeStart = document.querySelector("div[name='time_start']");
		var timeEnd = document.querySelector("div[name='time_end']");
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
	
		function newTicket() {
			var ticket = Ticket.create(ticketAddBtn.parentElement, ticketAddBtn);
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
		ticketAddBtn.addEventListener('click', newTicket);
		newTicket();
	});
	
	loadJs("https://cdn.tiny.cloud/1/x3mzugv485f8ydwz41c9eioaa1q6afipoglhxehonabc52v0/tinymce/5/tinymce.min.js", function(){
		loadJsList([location.getResource("assets/tinymce/plugins/ImageUploader.min.js"), location.getResource("assets/tinymce/plugins/autolink.min.js")], function() {
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
	var regTel = /^01(?:0|1|[6-9])\d{4}\d{4}$/;
	var regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	
	var inputTitle = document.querySelector(".input-field[name='title']");
	var errorTitle = inputTitle.nextElementSibling;
	var titleChecker = InputEventListener.on(['input', 'focus'], inputTitle, errorTitle, 55, "제목을 입력해 주세요");
	var inputEmail = document.querySelector(".input-field[name='email']");
	var inputTel = document.querySelector(".input-field[name='tel']");
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
	
	
	
	var hashtagInput = document.querySelector("input[name='hashtag']");
	var hashtagAddBtn = document.querySelector(".hashtag-add-btn");
	var hashtagContainer = document.querySelector(".hashtag-container");
	hashtagInput.addEventListener('keydown', (event) => {
		var key = window.netscape ? event.which : event.keyCode;
		if(key == 13) {
			event.preventDefault();
			hashtagAddBtn.click();
		}
	});
	hashtagAddBtn.addEventListener('click', function() {
		var children = hashtagContainer.children;
		var count = children.length;
		var value = hashtagInput.value;
		if(value != "" && count < 5){
			value = "#" + value;
			for(var i = 0; i < count; i++) {
				if(value == children[i].textContent) return;
			}
	
			var item = document.createElement("div");
			item.className = "hashtag-item";
			item.textContent = value;
			item.addEventListener('click', function(e) {
				hashtagContainer.removeChild(e.currentTarget);
			});
			hashtagInput.value = "";
			hashtagContainer.appendChild(item);
		}
	});
	
	
	// Online/Offline toggle
	var chkboxOnline = document.querySelector(".event-new-chkbox[name='online_flag']");
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
	InputEventListener.on(['input', 'focus'], venueDesc, venueDesc.nextElementSibling, 256);
	
	loadJs(location.getResource("js/googlemaps.js"), function() {
		loadGoogleMap(document.getElementById("googleMap"), venue);
	});

	
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
	
	const dropListener = createImageListener(function(files) {
		dropZone.style.backgroundColor = "";
		
		var f = files[0];
		if (files.length > 1) {
			alert('메인 이미지는 하나만 등록 가능합니다.');
			return;
		}
		
		dropZone.loading();
		let fileReader = new FileReader();
		const fname = f.name;
		fileReader.onload = function(e) {
			let parent = dropZone.parentElement;
			let tempImg = document.createElement("img");
			tempImg.src = e.target.result;
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
							const _URL = window.URL || window.webkitURL;
							const originEl = croppr.originEl;

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
			});
		};
		fileReader.readAsDataURL(f);
	});
	
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
		majax.do('/image', 'DELETE', "src=" + src);
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
						if(src) {
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
	
		majax.do('/image', 'DELETE', paramObject.param);
		window.removeEventListener('unload', deleteUploadedImageAll);
	}
	window.addEventListener('unload', deleteUploadedImageAll);
	
	
	// send btn : create & setting
	var submitButton = document.getElementById("submitButton");
	submitButton.addEventListener('click', function(event) {
		event.preventDefault();

		HTMLElement.prototype._scrollTop.autoFocus = true;
		HTMLElement.prototype._scrollTop.autoSmooth = false;

		var passAll = true;
		function alertScroll(target, msg) {
			alert(msg);
			target._scrollTop();
			passAll = false;
		}

		if(!titleChecker()) {
			alertScroll(inputTitle, "제목을 입력해주세요.");
		} else if(!contactChecker()) {
			var isEmptyEmail = (inputEmail.value == "");
			var isEmptyTel = (inputTel.value == "");
			if(isEmptyEmail && isEmptyTel) {
				alertScroll(inputEmail, "연락처는 최소 한 개 이상 입력해야 합니다.");
			} else if(inputEmail.classList.contains("deny")) {
				alertScroll(inputEmail, "정확한 이메일을 입력해주세요.");
			} else {
				alertScroll(inputTel, "정확한 전화번호를 입력해주세요");
			}
		} else if(applyChecker ? !applyChecker() : false) {
			alertScroll(applyLink, "올바르지 않은 URL 링크 입니다.");
		} else if(dateChecker()) {
			alertScroll(dateEnd, "올바른 날짜를 선택해주세요.");
		} else if(!timeChecker()) {
			alertScroll(timeEnd, "올바른 시간을 선택해주세요.");
		} else if(category.children.length < 1) {
			alertScroll(category, "카테고리를 1개 이상 선택해주세요.");
		} else {
			if(chkboxOnline.checked) {
				if(platformZoom.checked) {
					if(!zoomChecker()) {
						alertScroll(zoomLink, "줌 링크 또는 회의 ID를 입력해주세요.");
					}
				} else if(!platformNameChecker()) {
					alertScroll(customPlatformName, "온라인 플랫폼을 입력해주세요.");
				} else if(!platformDescChecker()) {
					alertScroll(customPlatformDesc, "참여 방법을 입력해주세요.");
				}
			} else if(!venueChecker()) {
				alertScroll(venue, "장소를 입력해주세요.");
			} else if(!venueDetailChecker()) {
				alertScroll(venueDetail, "상세 주소를 입력해주세요.");
			} else if(!dropZone._imagePath) {
				alertScroll(dropZone, "메인 이미지를 업로드 해주세요.");
			} else if(ticketList) {
				for(var i = 0; i < ticketList.length; i++) {
					var t = ticketList[i];
					if(!t.checkRequired() || !t.eventAndTicketEndDateChecker()) {
						alertScroll(t.container, "올바른 티켓 정보를 입력해주세요.");
						break;
					}
				}
			}
		}

		if(passAll) {
			// formdata 가져오기
			var formData = new FormData(document.querySelector("#eventForm"));

			// type 추가
			formData.append("type", document.selectedType);
	
			// applyLink 추가
			if(applyLink) {
				formData.append("apply_link", applyLink.value);
			}
	
			// 행사 시간 추가
			var timeStart = document.querySelector("div[name='time_start']");
			var timeEnd = document.querySelector("div[name='time_end']");
			formData.append("datetime_start", formData.get("date_start") + " " + timeStart.value);
			formData.append("datetime_end", formData.get("date_end") + " " + timeEnd.value);
			formData.delete("date_start");
			formData.delete("date_end");
	
			// category 추가
			var categoryList = category.querySelectorAll(".category-item");
			for(var i = 0; i < categoryList.length; i++) {
				formData.append("category", categoryList[i].value);
			}
	
			// genre 추가
			formData.append("genre", genre.value);
			
			// hashtag 추가
			var hashtagList = hashtagContainer.children;
			for(var i = 0; i < hashtagList.length; i++) {
				formData.append("hashtag", hashtagList[i].textContent);
			}
	
			//메인 이미지
			formData.append("cover", dropZone._imagePath);
	
			//컨텐트 & 이미지
			var content = tinymce.activeEditor.getContent();
			formData.append("content", content.length < 1 ? " " : content);
	
			var contentImageList = tinymce.activeEditor.contentDocument.images;
			for(var i = 0; i < contentImageList.length; i++) {
				var src = contentImageList[i].getAttribute("src");
				if(src.startsWith("blob")) {
					alert('내용 중, 업로드 중인 이미지가 존재합니다.\n잠시 후 다시 시도해주세요.');
					return;
				}
				formData.append("content_img", src);
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
	
	
			var data = formData.toString();
			
			majax.load(document.body, "/event", "POST", data, undefined, true)
				.then(function() {
					alert("주최되었습니다.");
					location.href = '/';
				}).catch(function(xhr) {
					alert("행사를 주최하지 못하였습니다.\n반복될 경우, 고객센터로 문의 바랍니다.\n" + xhr.responseText);
				});
		}
	});
})();