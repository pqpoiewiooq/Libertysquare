(function() {
	history.scrollRestoration = "manual";//새로고침시 스크롤 초기화. "auto" - 복원

	const LARGE_POINT = 1024;

	let isLargeScreen = null,
		_top,
		contentList,
		smallTopSearchBarStyle,
		smallTopNavButtonStyle,
		topHeight,
		prevLevel;// 스타일 변경 횟수 조절을 위함


	function initVariable() {
		var width = window.innerWidth;
	
		if (width >= LARGE_POINT) {
			if (isLargeScreen === true) return;
			if (isLargeScreen != null) loadSideAds(); // 첫 페이지 로드시에는, loadRightSide에서 직접 호출하므로 조건 설정
			isLargeScreen = true;
		} else {
			if (isLargeScreen === false) return;
			isLargeScreen = false;
		}

		contentList = document.querySelectorAll(".content-box");
	
		if (isLargeScreen) {
			_top = document.querySelector("#top");
			topHeight = _top.offsetHeight;
			smallTopSearchBarStyle = undefined;
			smallTopNavButtonStyle = undefined;
		} else {
			_top = document.querySelector("#top_mobile");
			topHeight = 120;// 화면을 늘였다 줄였다 할 경우, changeTopViewLevel 연산에 의해 topHeight가 늘어나는 경우가 발생하여 화면이 작은 경우 120 고정
			smallTopSearchBarStyle = _top.querySelector(".header-search-bar-mobile").style;
			smallTopNavButtonStyle = _top.querySelector(".dropdown-btn").style;
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

		// document.querySelector(".header-search-btn").addEventListener('click', loadSearchPage);
		document.querySelector(".header-search-bar-mobile").addEventListener('click', openSearchDialog);

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
		const dropdownSearchButton = document.querySelector("a[href='/search']");
		if(dropdownSearchButton) {
			dropdownSearchButton.addEventListener('click', function(e) {
				e.preventDefault();
				openSearchDialog();
			});
		}
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
	}

	// Top Controll
	function changeTopViewLevel(level) {
		if (prevLevel == level || level < 0) return;

		if (!isLargeScreen && prevLevel <= 250) {// 작은 화면
			let transTop, transHeight, transAlpha, transMarginRight, transButtonTop;
			if (level < 100) {
				transTop = level * 0.64;
				transHeight = topHeight;// + level * 0.31;
				transAlpha = level / 500;
				transMarginRight = level * 0.65;
				transButtonTop = 20 + (level * 0.50);
			} else {
				transTop = 64;
				transHeight = topHeight;
				transAlpha = 0.2;
				transMarginRight = 65;
				transButtonTop = 70;
			}
			_top.style.cssText = "top: -" + transTop + "px; height: " + transHeight + "px; box-shadow: rgba(0, 0, 0, " + transAlpha + ") 0px 4px 12px";
			smallTopSearchBarStyle.marginRight = transMarginRight + "px";
			smallTopNavButtonStyle.top = transButtonTop + "px";

			//document.querySelector(".content-title").innerHTML = level + " : " + "top: -" + transTop + "px; height: " + transHeight + "px; box-shadow: rgba(0, 0, 0, " + transAlpha + ") 0px 4px 12px";
		}

		prevLevel = level;
	}






	const doc = document;
	function createElement(tagName, className, textContent, href) {
		const element = doc.createElement(tagName);
		if(className) element.className = className;
		if(textContent != undefined && textContent != null) element.textContent = textContent;
		if(href) element.href = href;
		return element;
	}

	function createTextElement(tagName, textContent) {
		const element = doc.createElement(tagName);
		if(textContent != undefined && textContent != null) element.textContent = textContent;
		return element;
	}

	const _hr = doc.createElement('hr');
	function hr() {
		return _hr.cloneNode();
	}

	function createRightSideItem(post) {
		const item = createElement('a', 'post pconly', undefined, '/post/' + post.id);
		
		const title = createElement('p', 'title', post.title);
		item.append(title);

		const { pure } = optimizePostContent(post.content);
		const text = createElement('p', 'small');
		text.innerHTML = pure;
		item.append(text);

		const board = createTextElement('h4', post.board);
		item.append(board);

		const status = createElement('ul', 'status');
		item.append(status);

		const like = createElement('li', 'vote', post.likes);
		status.append(like);

		const comment = createElement('li', 'comment', post.comments);
		status.append(comment);

		item.append(hr());

		return item;
	}

	const imgTagRegex = /<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/g;
	const trimRegex = /^(\s|<br\s*\/?>)*/;
	function optimizePostContent(content) {
		if(!content) return;

		let images = 0;
		let firstImageSrc = undefined;
		const nonImgContent = content.replace(imgTagRegex, function(match, $1) {
			if((images++) == 0) {
				firstImageSrc = $1;
			}
			return '';
		});
		
		const pure = nonImgContent.replace(trimRegex, '');

		return { pure, images, firstImageSrc };
	}

	const MINUTE = 1000 * 60;
	function optimizeDate(datetime) {
		const date = Date.parse(datetime);
		const now = Date.current();
		
		if(date.getYear() == now.getYear()) {
			var interval = date.getTime() - now.getTime();
			var intervalMinute = -Math.round(interval/MINUTE);
			if(intervalMinute >= 0 && intervalMinute < 60) {
				return (intervalMinute == 0) ? '방금' : intervalMinute + '분 전';
			} else return Date.format(date, "MM/dd HH:mm");
		} else {
			return Date.format(date, 'yy/MM/dd HH:mm');
		}
	}

	const SEARCH_KEYWORD_LIMIT = 50;
	function addSearchLimitListener(elem) {
		function limitHandler() {
			const value = elem.value;
			if(value.length > SEARCH_KEYWORD_LIMIT) {
				alert('검색어는 50자로 제한되어 있습니다.');
				elem.value = value.substring(0, SEARCH_KEYWORD_LIMIT);
			}
		}

		elem.addEventListener('input', limitHandler);
		elem.addEventListener('change', limitHandler);
		elem.addEventListener('keydown', limitHandler);
	}



	/* main */
	function createMainItem(post) {
		const { pure, images, firstImageSrc } = optimizePostContent(post.content);

		const item = createElement('a', 'post', null, '/post/' + post.id);

		if(images > 0) {
			const thumbnail = createElement('img', 'thumbnail');
			thumbnail.src = firstImageSrc;
			item.append(thumbnail);
		}

		const title = createElement('p', 'title', post.title);
		item.append(title);

		const content = createElement('p');
		content.innerHTML = pure;
		item.append(content);

		const time = createTextElement('time', optimizeDate(post.generatedAt));
		item.append(time);

		const status = createElement('ul', 'status');
		item.append(status);

		if(images > 0) {
			const photo = createElement('li', 'photo', images);
			status.append(photo);
		}

		const vote = createElement('li', 'vote active', post.likes);
		status.append(vote);

		const comment = createElement('li', 'comment active', post.comments);
		status.append(comment);

		item.append(hr());

		return item;
	}

	function createMainCard(data) {
		const card = createElement('div', 'card');

		const board = createElement('div', 'board');
		card.append(board);

		const boardNameWrapper = createElement('h3');
		board.append(boardNameWrapper);

		const boardName = createElement('a', 0, data.board, data.uri ? '/board/' + data.uri : '');
		boardNameWrapper.append(boardName);

		for(let post of data.posts) {
			board.append(createMainItem(post));
		}

		return card;
	}


	/* rightside */
	function createMobileRightSideItem(post) {
		const item = createElement('a', 'list mobileonly', null, '/post/' + post.id);
		
		const time = createTextElement('time', optimizeDate(post.generatedAt));
		item.append(time);
		
		const title = createTextElement('p', post.title);
		item.append(title);

		item.append(hr());

		return item;
	}

	function createRightSideCard(data) {
		const card = createElement('div', 'card');
		
		const board = createElement('div', 'board');
		card.append(board);

		const boardNameWrapper = createElement('h3');
		board.append(boardNameWrapper);

		const boardName = createElement('a', 0, data.board, data.uri ? '/board/' + data.uri : '');
		boardNameWrapper.append(boardName);

		if(data.uri) {
			const 더보기 = createTextElement('span', '더보기');
			boardName.append(더보기);
		}

		if(data.posts) {
			for(var post of data.posts) {
				board.append(createRightSideItem(post));
				board.append(createMobileRightSideItem(post));
			}
		}

		return card;
	}

	const rightsideElement = document.getElementById('rightside');
	function loadRightSide() {
		const rightSideChildNodes = rightsideElement.childNodes;
		for(let i = 0; i < rightSideChildNodes.length; i++) {
			const child = rightSideChildNodes[i];
			if(child.className) {
				if(child.className.includes('search') || child.className.includes('adsbygoogle')) continue;
			}
			child.remove();
			i--;
		}
		majax.load(rightsideElement, '/post/rightside', 'GET')
			.then(function(xhr) {
				const json = JSON.parse(xhr.responseText);
				
				for(var data of json) {
					rightsideElement.append(createRightSideCard(data));
				}
			})
			.catch(function() {
				console.error('rightside load failed');
			})
			.finally(function() {
				if(isLargeScreen) {
					loadSideAds();
				}
			});
	}
	function loadSideAds() {
		// leftside
		const leftsideElement = document.getElementById('leftside');
		addResponsiveAds(['7992376751', '4399065344', '7206365547'], function(adElement) {
			leftsideElement.append(adElement);
		});

		// rightside
		addResponsiveAds(['5024869427', '2511268608', '9731283071', '3077997396', '4224978985', '1215672267'], function(adElement) {
			rightsideElement.append(adElement)
		});

		loadSideAds = function() {};
	}
	const rightsideSearchInput = document.querySelector("input[name='keyword']");
	rightsideSearchInput.addEventListener('keydown', function(event) {
		if(event.keyCode == 13) {//Enter
			event.preventDefault();

			const keyword = rightsideSearchInput.value;
			if(keyword.length < 2) {
				alert('검색어를 두 글자 이상 입력하세요!');
			} else location.href = '/search?q=' + encodeURIComponent(keyword);
		}
	});


	const main = document.getElementById('main');
	function loadMain() {
		const childNodes = main.childNodes;
		for(let i = 0; i < childNodes.length; i++) {
			const child = childNodes[i];
			if(child.id != 'banner') {
				child.remove();
				i--;
			}
		}
		majax.load(main, '/post/list?board=index&dt=' + Date.now(), 'GET')
			.then(function(xhr) {
				const json = JSON.parse(xhr.responseText);
				
				const layoutKey = '-hh-1d+53-1b-7y';
				const codeMap = {
					'1': '5469777894',
					'2': '8608460015',
					'3': '2641817463',
					'4': '8624185156'
				};
				for(var data of json) {
					const card = createMainCard(data);
					main.append(card);
					if(data.uri == 1 || data.uri == 2) {// 정치 시사
						addFluidAd(codeMap[data.uri], layoutKey, function(elem) {
							const target = card.querySelector(".post");
							if(target) {
								elem.style.height = target.offsetHeight + 'px';
								target.insertAdjacentElement('afterend', elem);
							}
						});
					} else if(data.uri == 3 || data.uri == 4) {
						addFluidAd(codeMap[data.uri], layoutKey, function(elem) {
							const target = card.querySelector(".post");
							if(target) {
								const next = target.nextElementSibling;
								if(next) {
									elem.style.height = next.offsetHeight + 'px';
									next.insertAdjacentElement('afterend', elem);
								}
							}
						})
					}
				}
				main.append(hr());
			})
			.catch(function() {
				console.error('main load failed');
			});
	}







	const Search = (function() {
		var searchMap;
		var onChangeListener;
		const hintText = "중복해서 여러개를 선택할 수 있습니다.";
	
		function onChange(){
			if(onChangeListener) onChangeListener(parse());
		}
	
		function parse() {
			var result = {
				type : new Array(),
				board : new Array(),
			};
	
			var typeList = searchMap[typeListName];
			for(var i = 0; i < typeList.length; i++) {
				var item = typeList[i];
				if(item.checked) {
					var obj = {
						text : item.textContent,
						value : item._value
					};
					result.type.push(obj);
				}
			}
			var boardList = searchMap[boardListName];
			for(var i = 0; i < boardList.length; i++) {
				var item = boardList[i];
				if(item.classList.contains("active")) {
					var obj = {
						text : item.textContent,
						value : item._value
					};
					result.board.push(obj);
				}
			}
			
			return result;
		}
	
		function set(data) {
			var typeList = searchMap[typeListName];
			for(var i = 0; i < typeList.length; i++) {
				var item = typeList[i];
				var flag = false;
				var x = 0;
				while(x < data.type.length) {
					if(item._value == data.type[x++].value) {
						flag = true;
						break;
					}
				}
				item.checked = flag;
			}
			
			var boardList = searchMap[boardListName];
			for(var i = 0; i < boardList.length; i++) {
				var item = boardList[i];
				var flag = false;
				var x = 0;
				while(x< data.board.length) {
					if(data.board[x++] == item._value) {
						flag = true;
						break;
					}
				}
				if(flag) item.classList.add("active");
				else item.classList.remove("active");
			}
	
			onChange();
		}
	
		const typeListName = "classChkboxList";
		const type_class = [
			{
				title : "제목",
				desc : "제목으로 글을 검색합니다.",
				value : "TITLE"
			},
			{
				title : "내용",
				desc : "제목으로 글을 검색합니다.",
				value : "CONTENT"
			},
			{
				title : "작성자",
				desc : "작성자의 닉네임으로 글을 검색합니다.",
				value : "WRITER"
			}
		];
	
		const boardListName = "boardList";
		const board = [
			{ text : "자유게시판", value : 0 },
			{ text : "정치·시사", value : 1 },
			{ text : "재테크", value : 2 },
			{ text : "홍보·장터", value : 3 },
		];
	
		function reset() {
			var i = 0;
	
			var type = searchMap[typeListName];
			for(i = 0; i < type.length; i++) {
				type[i].checked = false;
			}
	
			var _board = searchMap[boardListName];
			for(i = 0; i < _board.length; i++) {
				_board[i].classList.remove("active");
			}
	
			onChange();
		}
		
		function createTypeContainer() {
			var typeList = new Array();
			var chkboxList = new Array();
			type_class.forEach(function(t) {
				var con = document.createElement("div");
				con.className = "default-flex-box search-filter-class-container";
	
				var inner = document.createElement("div");
				inner.className = "inner";
	
				var title = document.createElement("div");
				title.className = "search-filter-class-title";
				title.textContent = t.title;
	
				var desc = document.createElement("div");
				desc.className = "search-filter-class-desc";
				desc.textContent = t.desc;
	
				var chkbox = document.createElement("input");
				chkbox.className = "search-filter-class-checkbox";
				chkbox.type = "checkbox";
				chkbox.textContent = t.title;
				chkbox._value = t.value;
				chkbox.checked = true;
				chkbox.addEventListener('click', function(event) {
					var target = event.currentTarget;
					var flag = target.checked;
	
					var list = searchMap[typeListName];
					for(var x = 0; x < list.length; x++) {
						var l = list[x];
						if(l._value == target._value) {
							l.checked = flag;
						}
					}
					onChange();
				});
	
				con.appendChild(inner);
				inner.appendChild(title);
				inner.appendChild(desc);
				con.appendChild(chkbox);
	
				typeList.push(con);
				chkboxList.push(chkbox);
			});
	
			var container = document.createElement("section");
			container.className = "search-filter-container";
	
			var title = document.createElement("div");
			title.className = "search-filter-title";
			title.textContent = "항목";
			title.style.marginBottom = "24px";
	
			container.appendChild(title);
			typeList.forEach(function(e) { container.appendChild(e) } );
	
			container[typeListName] = chkboxList;
	
			return container;
		}
	
		function createboardContainer() {
			var boardList = new Array();
			var box = document.createElement("div");
			box.className = "search-filter-category-box";
	
			board.forEach(function(c) {
				var e = document.createElement("button");
				e.type = "button";
				e.className = "search-filter-category-btn";
				e._value = c.value;
				e.textContent = c.text;
				e.addEventListener('click', function(event) {
					var target = event.currentTarget;
					var flag = target.classList.contains("active");
	
					var list = searchMap[boardListName];
					for(var x = 0; x < list.length; x++) {
						var l = list[x];
						if(l._value == target._value) {
							if(flag) l.classList.remove("active");
							else l.classList.add("active");
						}
					}
	
					onChange();
				});
				boardList.push(e);
				box.appendChild(e);
			});
	
			var container = document.createElement("section");
			container.className = "search-filter-container";
	
			var title = document.createElement("div");
			title.className = "search-filter-title";
			title.textContent = "게시판";
	
			var desc = document.createElement("div");
			desc.className = "search-filter-category-desc";
			desc.textContent = hintText;
	
			container.appendChild(title);
			container.appendChild(desc);
			container.appendChild(box);
	
			container[boardListName] = boardList;
	
			return container;
		}
	
		return {
			append : function(elem) {
				var typeContainer = createTypeContainer();
				var boardContainer = createboardContainer();
	
				elem.appendChild(typeContainer);
				elem.appendChild(boardContainer);
				
				var _new = {};
				_new[typeListName] = typeContainer[typeListName];
				_new[boardListName] = boardContainer[boardListName];
				searchMap = _new;
			},
			reset : reset,
			parse : parse,
			set : set,
			setOnChangeListener : function(listener) {
				if(typeof(listener) == "function") onChangeListener = listener;
			}
		};
	})();

	function createSearchDialog() {
		const dialog = createElement('figure');
		dialog.id = 'search';
	
		// header start
		const header = createElement('div', 'default-flex-box search-container');
		dialog.append(header);
	
		const searchBar = createElement('div', 'default-flex-box search-bar');
		header.append(searchBar);
	
		searchBar.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-top:-5px"><path d="M24 10.5H5.745L14.13 2.115L12 0L0 12L12 24L14.115 21.885L5.745 13.5H24V10.5Z" fill="#000"></path></svg>';
		const closeButton = searchBar.firstElementChild;
		closeButton.addEventListener('click', closeSearchDialog);
	
		const searchBox = createElement('div', 'default-flex-box search-input-box');
		searchBar.append(searchBox);
	
		const inputIcon = createElement('div', 'search-input-icon-wrapper');
		inputIcon.innerHTML = '<svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.4406 14.5269C11.5499 14.5269 14.8812 11.2749 14.8812 7.26344C14.8812 3.25195 11.5499 0 7.4406 0C3.33127 0 0 3.25195 0 7.26344C0 11.2749 3.33127 14.5269 7.4406 14.5269Z" fill="#BDBDBD"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M7.44056 12.0466C9.98443 12.0466 12.0466 9.98443 12.0466 7.44056C12.0466 4.89669 9.98443 2.83447 7.44056 2.83447C4.89669 2.83447 2.83447 4.89669 2.83447 7.44056C2.83447 9.98443 4.89669 12.0466 7.44056 12.0466Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.6577 12.2866L12.6606 10.3059L17 14.5975L14.9972 16.5782L10.6577 12.2866Z" fill="#BDBDBD"></path></svg>';
		searchBox.append(inputIcon);
	
		const inputWrapper = createElement('form');
		inputWrapper.action = "#";
		inputWrapper.autoFocus = true;
		inputWrapper.style.width = '100%';
		searchBox.append(inputWrapper);
	
		const input = createElement('input', 'search-input');
		input.type = 'search';
		input.placeholder = '전체 게시판의 글을 검색하세요.';
		input.autoFocus = true;
		dialog.requestInputFocus = function() {
			input.focus();
		}
		addSearchLimitListener(input);
		inputWrapper.append(input);

		const searchButton = createElement('button', 'search-btn');
		searchButton.innerHTML = '<svg width="18" height="18" viewBox="0 0 19 19" fill="none" style="margin-top: 2px;"><path d="M15.0709 8.08817C15.0709 11.6928 12.0672 14.6763 8.28544 14.6763C4.50366 14.6763 1.5 11.6928 1.5 8.08817C1.5 4.48349 4.50366 1.5 8.28544 1.5C12.0672 1.5 15.0709 4.48349 15.0709 8.08817Z" stroke="#ffffff" stroke-width="3"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M11.8672 13.6816L14.0974 11.476L18.9297 16.2549L16.6994 18.4605L11.8672 13.6816Z" fill="#fff"></path></svg>';
		searchBar.append(searchButton);
		
		const filterText = createElement('div', 'search-filter-text');
		header.append(filterText);
		// header end
	
	
		// filter box start
		const filterBox = createElement('div', 'default-flex-box search-filter-header-container');
		filterBox.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.3571 8.35729H6.98014C6.63153 6.98756 5.23852 6.15978 3.86874 6.50839C2.96036 6.73959 2.25104 7.44891 2.01984 8.35729H0.642869C0.287816 8.35729 0 8.64511 0 9.00016C0 9.35522 0.287816 9.64299 0.642869 9.64299H2.01988C2.36849 11.0127 3.7615 11.8405 5.13128 11.4919C6.03966 11.2607 6.74898 10.5514 6.98018 9.64299H17.3571C17.7122 9.64299 18 9.35518 18 9.00012C18 8.64507 17.7122 8.35729 17.3571 8.35729ZM4.50001 10.2859C3.78994 10.2859 3.21431 9.71023 3.21431 9.00016C3.21431 8.29009 3.78994 7.71446 4.50001 7.71446C5.21008 7.71446 5.78571 8.29009 5.78571 9.00016C5.78571 9.71023 5.21008 10.2859 4.50001 10.2859Z" fill="#212121"></path><path d="M17.3571 1.92809H15.3373C14.9887 0.558358 13.5957 -0.269421 12.2259 0.0791909C11.3175 0.310393 10.6082 1.01971 10.377 1.92809H0.642869C0.287816 1.92809 0 2.21591 0 2.57096C0 2.92602 0.287816 3.21383 0.642869 3.21383H10.377C10.7256 4.58357 12.1186 5.41135 13.4884 5.06274C14.3968 4.83153 15.1061 4.12222 15.3373 3.21383H17.3571C17.7122 3.21383 18 2.92602 18 2.57096C18 2.21591 17.7122 1.92809 17.3571 1.92809ZM12.8572 3.85667C12.1471 3.85667 11.5715 3.28103 11.5715 2.57096C11.5715 1.8609 12.1471 1.28526 12.8572 1.28526C13.5672 1.28526 14.1429 1.8609 14.1429 2.57096C14.1429 3.28103 13.5672 3.85667 12.8572 3.85667Z" fill="#212121"></path><path d="M17.3571 14.7855H14.0516C13.7029 13.4158 12.3099 12.588 10.9402 12.9366C10.0318 13.1678 9.32245 13.8771 9.09125 14.7855H0.642869C0.287816 14.7855 0 15.0733 0 15.4283C0 15.7834 0.287816 16.0712 0.642869 16.0712H9.09129C9.4399 17.441 10.8329 18.2687 12.2027 17.9201C13.1111 17.6889 13.8204 16.9796 14.0516 16.0712H17.3571C17.7122 16.0712 18 15.7834 18 15.4283C18 15.0733 17.7122 14.7855 17.3571 14.7855ZM11.5714 16.7141C10.8614 16.7141 10.2857 16.1385 10.2857 15.4284C10.2857 14.7183 10.8614 14.1427 11.5714 14.1427C12.2815 14.1427 12.8571 14.7183 12.8571 15.4284C12.8571 16.1385 12.2815 16.7141 11.5714 16.7141Z" fill="#212121"></path></svg>'
			+ '<div class="search-filter-header-title">필터 걸기</div>';
		dialog.append(filterBox);
		
		const initButton = createElement('button', 'search-filter-init-btn', '초기화');
		filterBox.append(initButton);
		// filter box end
	
		// etc
		Search.append(dialog);
		window.Search = Search;
	
		// footer start
		const footer = createElement('footer', 'search-footer');
		dialog.append(footer);
	
		const footerFilterText = createElement('div', 'search-filter-text footer');
		footer.append(footerFilterText);
	
		const footerButton = createElement('button', 'footer-btn', '검색');
		footer.append(footerButton);
		// footer end

		//search event listener
		function onChangeSearchDialog(data) {
			var resultArray = new Array();
			for(var type of data.type) resultArray.push(type.text);
			for(var board of data.board) resultArray.push(board.text);

			var resultText = resultArray.length > 0 ? "적용된 필터 - " + resultArray.join(", ") : "";
			footerFilterText.textContent = resultText;
			filterText.textContent = resultText;
		}
		initButton.addEventListener('click', Search.reset);
		Search.setOnChangeListener(onChangeSearchDialog);
		onChangeSearchDialog(Search.parse());
		
		function search() {
			const keyword = input.value;
			if(keyword.length < 2) {
				alert('검색어를 두 글자 이상 입력하세요!');
				return;
			}

			const data = Search.parse();
			const param = new FormData();
			param.append('q', keyword);
			for(let type of data.type) {
				param.append('t', type.value);
			}
			for(let board of data.board) {
				param.append('b', board.value);
			}

			location.href = '/search?' + param.toString();
		}
		input.addEventListener('keydown', function(event) {
			if (event.keyCode === 13) {// enter
				event.preventDefault();
				search();
			}
		});
		searchButton.addEventListener('click', search);
		footerButton.addEventListener('click', search);

		return dialog;
	}

	const searchDialog = createSearchDialog();
	const bodyStyle = doc.body.style;
	let isSearchDialogOpen = false;
	function openSearchDialog() {
		document.body.append(searchDialog);
		bodyStyle.height = '0px';
		bodyStyle.overflow = 'hidden';
		isSearchDialogOpen = true;
		searchDialog.requestInputFocus();
	}
	function closeSearchDialog() {
		searchDialog.remove();
		bodyStyle.height = '';
		bodyStyle.overflow = '';
		isSearchDialogOpen = false;
	}


	function load() {
		initVariable();
		initEvents();

		majax.once = false;
		loadMain();
		loadRightSide();
		majax.once = true;
	}

	function isBackForward() {
		const perform = window.performance;
		if(!perform) {
			console.log("Unsupported Variables: 'window.performance'");
			return false;
		}

		const nav = perform.navigation;
		if(nav && nav.type) {
			return nav.type === (nav.TYPE_BACK_FORWARD || 2);
		} else if(perform.getEntriesByType) {
			const navigationTiming = perform.getEntriesByType("navigation");
			return navigationTiming[0] ? navigationTiming[0].type == "back_forward" : false;
		} else {
			console.log("Unsupported Browser");
			return false;
		}
	}

	window.onpageshow = function(event) {
		if(event.persisted || isBackForward()) {
			requestAnimationFrame(function() {
				load();
			});
		} else {
			load();
		}
	}
})();