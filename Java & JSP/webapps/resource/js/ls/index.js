(function() {
	history.scrollRestoration = "manual";//새로고침시 스크롤 초기화. "auto" - 복원

	let isLargeScreen,//true : 700 이상, false : 700 미만
		_top,
		navStyle,
		navList,
		contentList,
		largeTopLinkList,
		smallTopSearchBarStyle,
		smallTopNavButtonStyle,
		topHeight,
		headerBottom,
		prevLevel;// 스타일 변경 횟수 조절을 위함


	function initVariable() {
		var width = window.innerWidth;
	
		if (width >= 700) {
			if (isLargeScreen === true) return;// 이미 700px 이상인 경우, 변수 초기화 불필요함으로 함수 return
			isLargeScreen = true;
		} else {
			if (isLargeScreen === false) return;// 이미 700px 미만인 경우, 변수 초기화 불필요함으로 함수 return
			isLargeScreen = false;
		}

		contentList = document.querySelectorAll(".content-box");
	
		if (isLargeScreen) {
			_top = document.querySelector("#top");
			topHeight = _top.offsetHeight;
			largeTopLinkList = _top.querySelectorAll(".top-link-box li a");
			smallTopSearchBarStyle = undefined;
			smallTopNavButtonStyle = undefined;
			navList = _top.querySelectorAll(".lnb button");
			navStyle = _top.querySelector(".lnb").style;
			headerBottom = absY(document.querySelector("header").getBoundingClientRect().bottom) - topHeight;
		} else {
			_top = document.querySelector("#top_mobile");
			topHeight = 120;// 화면을 늘였다 줄였다 할 경우, changeTopViewLevel 연산에 의해 topHeight가 늘어나는 경우가 발생하여 화면이 작은 경우 120 고정
			largeTopLinkList = undefined;
			navList = _top.querySelectorAll(".lnb-mobile li");
			smallTopSearchBarStyle = _top.querySelector(".header-search-bar-mobile").style;
			smallTopNavButtonStyle = _top.querySelector(".dropdown-btn").style;
			navStyle = _top.querySelector(".lnb-mobile").style;
		}
	
		prevLevel = -1;
	}

	function initEvents() {
		addEventListener('scroll', mScrollEventListener);
		mScrollEventListener();
		addEventListener('pagehide', onPageHide);
		addEventListener('resize', initVariable);
		document.querySelector("#top .logo").addEventListener('click', function() { location.href = '/'; });
		document.querySelector(".logo-mobile").addEventListener('click', function() { location.href = "/"; });

		document.querySelector(".header-search-btn").addEventListener('click', loadSearchPage);
		document.querySelector(".header-search-bar-mobile").addEventListener('click', loadSearchPage);

		let dropdownMenu = document.querySelector(".dropdown-menu-container");
		let dropdownClose = dropdownMenu.querySelector(".dropdown-menu-close");
		let dropdownOpen = document.querySelector(".dropdown-btn");
		dropdownClose.addEventListener('click', function() {
			dropdownMenu.style.animation = "none";
			void dropdownMenu.offsetWidth;
			dropdownMenu.style.cssText = "display:block; animation: dropdownFadeIn 0.2s linear backwards reverse;";
			const dropdownAnimListener = function() {
				document.body.style.overflow = "";
				dropdownMenu.style.cssText = "display: none;";
				dropdownMenu.removeEventListener('animationend', dropdownAnimListener);
			};
			dropdownMenu.addEventListener('animationend', dropdownAnimListener);
		});
		dropdownOpen.addEventListener('click', function() {
			document.body.style.overflow = "hidden";
			dropdownMenu.style.display = "block";
		});
	}

	function onPageHide(event) {
		if(event.persisted === true) { // BFCache에 들어갈 수도 있을 경우에만 실행
			prevLevel = -1; 
			if(supportPageOffset);// window.pageYOffset = 0;
			else if(isCSS1Compat) document.documentElement.scrollTop = 0;
			else document.body.scrollTop = 0;
		}
	}

	var supportPageOffset = window.pageXOffset !== undefined;
	var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
	function mScrollEventListener() {
		let scrollLocation = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
	
		// top bar 조절
		requestAnimationFrame(function(){changeTopViewLevel(scrollLocation);});
		//changeTopViewLevel(scrollLocation);

		// nav button style 조정
		let len = contentList.length;
		for (let i = 0; i < len; i++) {
			let content = contentList.item(i);
			let rect = content.getBoundingClientRect();
			let abTop = absY(rect.top) - 30;
			let abBottom = absY(rect.bottom);
	
			if (scrollLocation > abTop && scrollLocation < abBottom) {
				selectNav(i);
				break;
			}
		}
	}

	// Top Controll
	function changeTopViewLevel(level) {
		if (prevLevel == level || level < 0) return;

		if (isLargeScreen) {// 큰 화면
			level -= headerBottom;

			if (level <= 0) {
				if (prevLevel <= 0) return;
				changeLargeTopViewLevelStyle("rgba(0, 0, 0, 0)", "#ffffff", "0", "#02a0fb");
			} else if (level < 256) {
				const op = level / 255;
				changeLargeTopViewLevelStyle("rgba(" + level + "," + level + "," + level + "," + op + ")", "#000000", "" + op, "#02a0fb");
			} else {
				if (prevLevel >= 256) return;
				changeLargeTopViewLevelStyle("rgba(255, 255, 255, 1)", "#000000", "1", "#ebeff4");
			}
		} else if (prevLevel <= 250) {// 작은 화면
			let transTop, transHeight, transAlpha, transMarginRight, transButtonTop;
			if (level < 100) {
				transTop = level * 0.64;
				transHeight = topHeight + level * 0.31;
				transAlpha = level / 500;
				transMarginRight = level * 0.65;
				transButtonTop = 20 + (level * 0.50);
			} else {
				transTop = (level > 150) ? (level > 250) ? 112 : 64 + ((level - 150) * 0.54) : 64;//기존 58이었으나 logo가 커져서 64로 증가
				transHeight = topHeight + 31;
				transAlpha = 0.2;
				transMarginRight = 65;
				transButtonTop = 70;
			}
			_top.style.cssText = "top: -" + transTop + "px; height: " + transHeight + "px; box-shadow: rgba(0, 0, 0, " + transAlpha + ") 0px 4px 12px";
			smallTopSearchBarStyle.marginRight = transMarginRight + "px";
			smallTopNavButtonStyle.top = transButtonTop + "px";
			navStyle.display = level < 50 ? "none" : "flex";

			//document.querySelector(".content-title").innerHTML = level + " : " + "top: -" + transTop + "px; height: " + transHeight + "px; box-shadow: rgba(0, 0, 0, " + transAlpha + ") 0px 4px 12px";
		}

		prevLevel = level;
	}

	function changeLargeTopViewLevelStyle(bgcolor, color, op, last_background) {
		let len = largeTopLinkList.length - 1;
		for (let i = 0; i <= len; i++) {
			largeTopLinkList[i].style.color = color;
			if (len > 1 && i == len) {
				largeTopLinkList[i].style.background = last_background;
			}
		}
		_top.style.background = bgcolor;
		navStyle.opacity = op;
	}

	




	// nav control
	let selectedNav = 0;
	function selectNav(select) {
		if (selectedNav == select) return;

		let len = navList.length;
		for (let i = 0; i < len; i++) {
			let elem = navList[i];
			if (select == i) {
				elem.setAttribute("selected", '');
				selectedNav = select;
			} else elem.removeAttribute("selected");
		}
	}

	function absY(y) {
		return y + window.pageYOffset - (isLargeScreen ? topHeight : 29);
	}
	
	window._scroll = function(targetNum) {
		if (contentList.length > targetNum && targetNum >= 0) {
			let abTop = absY(contentList[targetNum].getBoundingClientRect().top) - 29;
			if(abTop < 150) abTop = 0;
			if (checkIE()) window.scrollTo(0, abTop);
			else window.scrollTo({ behavior: 'smooth', left: 0, top: abTop });
			mScrollEventListener();
		}
	}

	function loadSearchPage(flag) {
		if(typeof(flag) != "boolean") flag = true;
		var data = _search.parse();
		var text = document.querySelector(".header-search-bar-input").value;
		majax.replaceInnerHTML('/search', document.querySelector("body"), "body", flag, function() {
			removeEventListener('scroll', mScrollEventListener);
			removeEventListener('pagehide', onPageHide);
			removeEventListener('resize', initVariable);
			
			var input = document.querySelector(".search-input");
			input.value = text;
			input.dispatchEvent(new Event("input"));
			const parent = input.parentElement;
			input.remove();
			parent.append(input);
			input.focus();
			input.select();
			input.setSelectionRange(0, 0);

			_search.set(data);
			if(isLargeScreen) document.querySelector(".footer-btn").dispatchEvent(new Event("click"));
		});
	}

	window.onpopstate = function(event){
		event.stopImmediatePropagation();		
		window._popStateListener();
	};

	window._popStateListener = function(){loadSearchPage(false);};

	var temp = document.querySelectorAll(".header-search-bar-inner.select");
	_search.attach(temp[0], temp[1], temp[2]);

	// load Event List
	function domContentLoadedListener() {
		majax.load(document.querySelector(".content-container"), 'https://api.libertysquare.co.kr/event/main', "GET")
			.then(function(xhr) {
				var json = JSON.parse(xhr.responseText);

				var containers = document.querySelectorAll(".event-container");
				var lnbList = document.querySelectorAll(".lnb button");
				var lnbMobileList = document.querySelectorAll(".lnb-mobile li");
				var dataset = [json.recommendation, json.recency, json.online, json.imminent, json.free];
				
				var i = 0;
				var added = false;
				for(var item in dataset) {
					if(dataset[item].length < 1) {
						containers[i].parentElement.remove();
						lnbList[i].remove();
						lnbMobileList[i].remove();
					} else {
						dataset[item].forEach(function(data) {
							containers[i].appendChild(createEventElement(data));
						});
						added = true;
					}
					i++;
				}
				
				if(!added) {
					alert('현재 게시된 행사가 없습니다.');
				}

			}).catch(function() {
				alert("행사를 불러오지 못했습니다.\n잠시 후 다시 시도해주세요.");
			});

		initVariable();
		initEvents();
		
		window.removeEventListener('DOMContentLoaded', domContentLoadedListener);
	}

	window.addEventListener('DOMContentLoaded', domContentLoadedListener);
})();