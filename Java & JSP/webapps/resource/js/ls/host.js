(function() {
	const hostID = document.querySelector("input[name='hid']").value;
	let menuList = document.querySelectorAll(".host-menu");
	const menuClassName = "active";
	const bodySelector = "#content";
	let body = document.querySelector(bodySelector);

	function selectMenu(event) {
		event.preventDefault();

		var target = event.currentTarget;
		var classList = target.classList;

		if(classList.contains(menuClassName)) return;

		majax.replaceInnerHTML(target.href, body, bodySelector, true,
			function() {
				activeMenu(target);
				document.documentElement.scrollTop = 0;
			}, function(xhr) {
				//alert("error");
			});
	}

	function activeMenu(target) {
		for(var menu of menuList) {
			if(target.isSameNode(menu)) {
				menu.classList.add(menuClassName);
			} else menu.classList.remove(menuClassName);
		}

		if(target.href.lastIndexOf("/edit") != -1) {
			body.style.background = "#f8f8fa";
			setEditManager();
		} else body.style.background = "";
	}

	function activeCurrentMenu() {
		for(var menu of menuList) {
			if(menu.href == location.href) {
				activeMenu(menu);
				break;
			}
		}
	}

	for(var menu of menuList) {
		menu.addEventListener('click', selectMenu);
	}
	activeCurrentMenu();

	var likeButton = document.querySelector(".host-like-button");
	var likeNumElement = document.querySelector(".host-like-num");
	var wasLiked = likeButton.classList.contains("like");
	var likeNum = parseInt(likeNumElement.textContent) + (wasLiked ? -1 : 0);
	likeButton.addEventListener('click', function() {
		majax.do("/host/subscribe", "POST", "hostID=" + hostID, function() {
			if(wasLiked) {
				likeButton.classList.remove("like");
				likeNumElement.textContent = likeNum;
				wasLiked = false;
			} else {
				likeButton.classList.add("like");
				likeNumElement.textContent = likeNum + 1;
				wasLiked = true;
			}
		}, function(xhr) {
			if(xhr.status == 401) {
				location.href = "/sign";
			} else {
				alert("구독 요청이 실패하였습니다.\n" + xhr.responseText);
			}
			return false;
		})
	});

	// 함수 내부에 있는 new.js와 중복되는 부분은 추후 별도 js로 만들어서 사용할 예정.
	function setEditManager() {
		/*** host.js = new.js start ***/
		const filterNameElem = document.querySelector("input[name='fname']");
		var filterName = undefined;
		if(filterNameElem) filterName = filterNameElem.value;

		const nameInput = document.querySelector(".input-field[name='name']");
		const nameError = nameInput.nextElementSibling;

		
		var nameChecker = InputEventListener.on(['input', 'focus'], nameInput, nameError, 40, "호스트 이름을 입력해주세요.");
		function nameAjaxCallback(xhr) {
			if(xhr.status == 200) {
				nameError.className = "error-text";
				nameError.textContent = "중복된 이름의 호스트가 이미 존재 합니다.";
			} else {
				nameError.className = "error-text hidden";
				nameInput.className = "input-field confirm";
			}
		}
		nameInput.addEventListener('focusout', function(){
			if(filterName == nameInput.value) {
				nameError.className = "error-text hidden";
				nameInput.className = "input-field confirm";
			} else if(nameChecker()) {
				majax.do("/host?type=name&name="+nameInput.value, "GET", undefined, nameAjaxCallback, nameAjaxCallback);
			}
		});



		const introInputSimple = document.querySelector(".input-field[name='introduceSimple']");
		const introErrorSimple = introInputSimple.nextElementSibling;

		var introduceSimpleChecker = InputEventListener.on(['input', 'focus'], introInputSimple, introErrorSimple, 255);
		introInputSimple.addEventListener('focusout', function() { introduceSimpleChecker("confirm"); });
		/*** host.js = new.js end ***/

		const since = document.querySelector("#since");
		const sinceText = document.querySelector(".host-edit-form-since");

		function sinceFormat(date) {
			var year = date.getFullYear();
			var month = (1 + date.getMonth());
			if(month < 10) month = '0' + month;
			var day = date.getDate();
			if(day < 10) day = '0' + day;
			return "Since " + year + "년 " + month + "월 " + day + "일"; 
		}

		function initFlatPickr() {
			flatpickr.localize(flatpickr.l10ns.ko);
			var defaultDate = new Date(since.value.replace(/-/g, "/"));
			since.flatpickr({
				local: 'ko',
				defaultDate: defaultDate
			});
			since.addEventListener('change', function() {
				sinceText.textContent = sinceFormat(since._flatpickr.selectedDates[0]);
			});
		}

		if(typeof(flatpickr) == "undefined") {
			loadCss(location.getResource("assets/flatpickr/flatpickr.min.css"));
			loadJs(location.getResource("assets/flatpickr/flatpickr-4.6.9.js"), initFlatPickr);
		} else initFlatPickr();


		// image start
		const profile = document.querySelector(".host-edit-form-image.profile");
		const cover = document.querySelector(".host-edit-form-image.cover");


		function initCroppr() {
			function onerror(error) {
				alert("이미지 업로드에 실패하였습니다.\n" + error);
			}

			imageUploader(profile, {
				aspectRatio: 1,
				width: 170,
				height: 170,
				success: function(path) {
					profile.style.cssText = "background:url(" + path + ") no-repeat center center/cover;";
					profile.imagePath = path;
				},
				error : onerror
			});
			imageUploader(cover, {
				aspectRatio: 0.267,
				width: 600,
				success: function(path) {
					cover.style.cssText = "background:url(" + path + ") no-repeat center center/cover;";
					cover.imagePath = path;
				},
				error : onerror
			});
		}
		
		if(typeof(Croppr) == "undefined") {
			loadJsList([location.getResource("assets/croppr/croppr.min.js"), "https://cdn.jsdelivr.net/gh/fengyuanchen/compressorjs/dist/compressor.min.js", location.getResource("assets/croppr/imguploader.js")], initCroppr);
			loadCss(location.getResource("assets/croppr/croppr.min.css"));
		}
		// image end

		

		const venue = document.querySelector("input[name='venue']");
		const venueDetail = document.querySelector("input[name='venue_detail']");
		InputEventListener.on(['input', 'focus'], venue, venue.nextElementSibling, 55);
		InputEventListener.on(['input', 'focus'], venueDetail, venueDetail.nextElementSibling, 512);
		
		loadJs(location.getResource("js/googlemaps.js"), function() {
			loadGoogleMap(document.getElementById("googleMap"), venue);
		});



		/*** host.js = new.js start ***/
		const filterIDElem = document.querySelector("input[name='fid']");
		var filterID = undefined;
		if(filterIDElem) filterID = filterIDElem.value;
		const memberInput = document.querySelector(".input-field[name='member']");
		const memberBtn = document.querySelector(".preview-btn[name='add']");
		const memberError = memberBtn.nextElementSibling;
		const memberListWrapper = document.querySelector("#memberList");
		window.removeMember = function(e) {
			memberListWrapper.removeChild(e.currentTarget);
			if(!memberListWrapper.hasChildNodes()) memberListWrapper.style.display = "none";
		};
		var regMember = /^01(?:0|1|[6-9])\d{4}\d{4}$/;

		function putCurrentMember(){
			var memberValue = memberInput.value;
			if(memberValue == filterID) {
				memberInput.className = "input-field deny"
				memberError.className = "error-text";
				memberError.textContent = "본인은 자동으로 추가됩니다.";
			} else if(!regMember.test(memberValue)) {
				memberInput.className = "input-field deny"
				memberError.className = "error-text";
				memberError.textContent = "올바른 전화번호 형식이 아닙니다.";
			} else {
				majax.do('/account?id='+memberValue, "GET", undefined, function(xhr) {
					var memberList = memberListWrapper.children;
					for(var i = 0; i < memberList.length; i++){
						if(memberList[i].textContent == memberValue) return;
					}

					var newMemberElem = document.createElement("button");
					newMemberElem.className = "preview-list-item clickable";
					newMemberElem.textContent = memberInput.value;
					newMemberElem.addEventListener('click', window.removeMember);
					memberListWrapper.appendChild(newMemberElem);
					memberListWrapper.style.display = "block";
					memberInput.className = "input-field"
					memberError.className = "error-text hidden";
					memberInput.value = "";
				}, function() {
					memberInput.className = "input-field deny"
					memberError.className = "error-text";
					memberError.textContent = "가입되어 있지 않은 번호입니다.";
				});
			}
		}
		memberBtn.addEventListener('click', putCurrentMember);
		/*** host.js = new.js end ***/

		function initTinymce() {
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
				default_link_target: "_blank",
				media_live_embeds: true,
				media_alt_source: false,
				media_poster: false,
				media_dimensions: false,
				style_formats:[{title:"\uc81c\ubaa91",block:"h1"},{title:"\uc81c\ubaa92",block:"h2"},{title:"\uc81c\ubaa93",block:"h3"},{title:"\ubcf8\ubb38",block:"p"}],
			});
		}

		if(typeof(tinymce) == "undefined") {
			loadJs("https://cdn.tiny.cloud/1/x3mzugv485f8ydwz41c9eioaa1q6afipoglhxehonabc52v0/tinymce/5/tinymce.min.js", function(){
				loadJsList([location.getResource("assets/tinymce/plugins/ImageUploader.min.js"), location.getResource("assets/tinymce/plugins/autolink.min.js")], initTinymce); 
			});
		} else {
			initTinymce();
		}

		document.querySelector(".form-button").addEventListener('click', function() {
			function addHostCallback(xhr) {
				if(xhr && xhr.status == 200) {
					alert("반영되었습니다.");
					location.reload(true);
				} else alert('호스트 수정에 실패하였습니다.\n' + xhr.responseText);
			}

			const data = new FormData();
			data.append('hid', hostID);
			data.append('name', nameInput.value);
			data.append('since', since.value);
			data.append('s_intro', introInputSimple.value);
			data.append('introduce', tinymce.activeEditor.getContent());
			if(profile.imagePath) data.append('profile', profile.imagePath);
			if(cover.imagePath) data.append('cover', cover.imagePath);
			if(venue.value) data.append('venue', venue.value);
			if(venueDetail.value) data.append('detail_venue', venueDetail.value);

			var memberList = memberListWrapper.children;
			for(var i = 0; i < memberList.length; i++){
				data.append('member', memberList[i].textContent);
			}

			var introImageList = tinymce.activeEditor.contentDocument.images;
			for(var i = 0; i < introImageList.length; i++) {
				data.append('intro_img', introImageList[i].getAttribute("src"));
			}
			
			majax.load(document.body, '/host', "PATCH", data.toString(), undefined, true)
				.then(addHostCallback)
				.catch(addHostCallback);
		});

		function deleteUploadedImageAll() {
			const param = new FormData();
			if(profile.imagePath) param.append("src", profile.imagePath);
			if(cover.imagePath) param.append("src", cover.imagePath);

			var mceImages = tinymce.activeEditor.contentDocument.images;
			for(var i = 0; i < mceImages.length; i++) {
				param.append("src", mceImages[i].getAttribute("src"));
			}

			majax.do('/image', 'DELETE', param.toString());
			window.removeEventListener('unload', deleteUploadedImageAll);
		}
		window.addEventListener('unload', deleteUploadedImageAll);
	}
})();