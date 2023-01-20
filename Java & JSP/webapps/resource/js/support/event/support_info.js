(function() {
	majax.once = false;

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

	
	var category = document.querySelector("div[name='category']");
	var businessType = document.querySelector("div[name='businessType']");
	loadJs(location.getResource("js/dropdown.js"), function() {
		// dropdown settings
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
		}, scroll: 5});
		applyChecker();

		category.dropdown({option: {"정치" : "POLITICS",
									"교육" : "EDUCATION",
									"언론" : "PRESS",
									"시민운동" : "CIVIC_MOVEMENT",
									"학술" : "ACADEMIC",
									"기타" : "ETC"}, scroll: 5, init: false});
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
	
		businessType.dropdown({option: {"개인" : "INDIVIDUAL",
								"사업자" : "PROPRIETOR",
								"비영리 · 면세사업자" : "NPO_TFE"}});
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
					contactError("정확한 이메일과 전화번호를 입력해 주세요", [inputEmail, inputTel]);
				} else if(emailFlag) {
					contactError("정확한 이메일을 입력해 주세요", inputEmail, inputTel);
				} else if(tellFlag) {
					contactError("정확한 전화번호를 입력해 주세요", inputTel, inputEmail);
				} else result = true;
			} else if(isEmptyEmail && tellFlag) {
				contactError("정확한 전화번호를 입력해 주세요", inputTel, inputEmail);
			} else if(isEmptyTel && emailFlag) {
				contactError("정확한 이메일을 입력해 주세요", inputEmail, inputTel);
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

	/*** Cover Image End ***/
	








	
	// send btn : create & setting
	var submitButton = document.getElementById("submitButton");
	const termsCheckbox = document.querySelector(".js-terms");
	termsCheckbox.addEventListener('change', function() {
		submitButton.disabled = !termsCheckbox.checked;
	});

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
			alertScroll(inputTitle, "제목을 입력해 주세요.");
		} else if(!contactChecker()) {
            var isEmptyEmail = (inputEmail.value == "");
            var isEmptyTel = (inputTel.value == "");
			if(isEmptyEmail && isEmptyTel) {
				alertScroll(inputEmail, "연락처는 최소 한 개 이상 입력해야 합니다.");
			} else if(inputEmail.classList.contains("deny")) {
				alertScroll(inputEmail, "정확한 이메일을 입력해 주세요.");
			} else {
				alertScroll(inputTel, "정확한 전화번호를 입력해 주세요");
			}
		} else if(!applyChecker()) {
			alertScroll(inputLink, "정확한 후원 방법을 입력해 주세요.");
		} else if(category.children.length < 1) {
			alertScroll(category, "카테고리를 1개 이상 선택해 주세요.");
		} else if(!dropZone._imagePath) {
			alertScroll(dropZone, "메인 이미지를 업로드 해주세요.");
		}


		if(passAll) {
			// formdata 가져오기
			var formData = new FormData(document.querySelector("#eventForm"));

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
	
			// category 추가
			var categoryList = category.querySelectorAll(".category-item");
			for(var i = 0; i < categoryList.length; i++) {
				formData.append("category", categoryList[i].value);
			}
	
			// businessType 추가
			formData.append("businessType", businessType.value);
			
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
					alert('내용 중, 업로드 중인 이미지가 존재합니다.\n잠시 후 다시 시도해 주세요.');
					return;
				}
				formData.append("content_img", src);
			}
	
	
			var data = formData.toString();
			
			majax.load(document.body, "/support", "POST", data, undefined, true)
				.then(function() {
					alert("주최되었습니다.");
					location.href = '/';
				}).catch(function(xhr) {
					alert("후원를 주최하지 못하였습니다.\n반복될 경우, 고객센터로 문의 바랍니다.\n" + xhr.responseText);
				});
		}
	});
})();