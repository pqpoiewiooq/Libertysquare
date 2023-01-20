
(function() {
    // 결과 화면일 떄, desktop 화면이 나오지 않는 부분 수정
    history.scrollRestoration = "manual";

    var isResultPage = false;

    function loadIndexPage(flag) {
        if(typeof(flag) != "boolean") flag = true;
		var data = _search.parse();
		majax.replaceInnerHTML('/index', document.querySelector("body"), "body", flag, function() {
			removeEventListener('scroll', mScrollEventListener);
			_search.set(data);
            window.dispatchEvent(new Event("DOMContentLoaded"));
		});
	}

    window.onpopstate = function(event){
        event.stopImmediatePropagation();        
        window._popStateListener();
    };

	window._popStateListener = function(){loadIndexPage(false);};

    function createHostElement(data) {
        var box = document.createElement("a");
        box.className = "event-box host";
        box.href = "/host/" + data.hostID;

        var imgWrapper = document.createElement("div");
        var bigImg = document.createElement("img");
        var smallImg = document.createElement("img");
        var icon = document.createElement("div");
        var name = document.createElement("div");
        imgWrapper.className = "host-image-wrapper";
        bigImg.className = "host-image"
        bigImg.src = data.coverPath;
        bigImg.alt = "호스트 이미지";
        smallImg.className = "host-image mobile"
        smallImg.src = data.profilePath;
        smallImg.alt = "호스트 이미지";
        icon.className = "host-image-small";
        icon.style.background = "url(" + data.profilePath + ") center center / cover no-repeat";
        name.className = "host-name";
        name.textContent = data.name;

        var body = document.createElement("div");
        var s_name = document.createElement("div");
        var desc = document.createElement("div");
        var etc = document.createElement("div");
        var subscribe = document.createElement("div");
        body.className = "event-body";
        s_name.className = "host-name-small";
        s_name.textContent = data.name;
        desc.className = "event-title";
        etc.className = "event-subject";
        desc.textContent = data.introduceSimple;;
        etc.textContent = "구독자 " + data.subscribeCount + " · 이벤트 수 " + data.eventCount + "개";
        if(data.hasSubscribed) {
            subscribe.className = "host-subscribe subscribed";
            subscribe.textContent = "구독중";
        } else {
            subscribe.className = "host-subscribe";
            subscribe.textContent = "구독하기";
        }

        box.appendChild(imgWrapper);
        imgWrapper.appendChild(bigImg);
        imgWrapper.appendChild(smallImg);
        imgWrapper.appendChild(icon);
        imgWrapper.appendChild(name);
        box.appendChild(body);
        body.appendChild(s_name);
        body.appendChild(desc);
        body.appendChild(etc);
        body.appendChild(subscribe);

        return box;
    }

    function search() {
        input.blur();
        _search.search(input.value, function(events, hosts, findRows) {
            var containers = document.querySelectorAll(".event-container");

            var eventContainer = containers[0];
            var hostContainer = containers[1];

            isResultPage = true;
            document.body.classList.add("result");
            document.documentElement.scrollTop = 0;

            while(eventContainer.hasChildNodes()) {
                eventContainer.removeChild(eventContainer.firstChild);
            }

            while(hostContainer.hasChildNodes()) {
                hostContainer.removeChild(hostContainer.firstChild);
            }

            if(events) {
                events.forEach(function(data) {
                    eventContainer.appendChild(createEventElement(data));
                });
            }

            if(hosts) {
                hosts.forEach(function(data) {
                    hostContainer.append(createHostElement(data));
                });
            }

            var counter = document.querySelector(".search-header-result-text u");
            counter.textContent = findRows ? findRows : 0;
        });
    }

    let inputBox = document.querySelector(".search-input-box");
    let inputIcon = inputBox.querySelector(".search-input-icon-wrapper");
    let input = inputBox.querySelector(".search-input");
    let desktopInput = document.querySelector(".search-header-input");

    function onInputBoxFocusIn() {
        inputBox.style.width = "370px";
        inputIcon.style.transform = "translateX(-100%)";
        inputIcon.style.opacity = "0";
        input.style.transform = "translateX(-20px)";
    }

    function onInputBoxFocusOut() {
        inputBox.style.width = "352px";
        inputIcon.style.transform = "translateX(0%)";
        inputIcon.style.opacity = "1";
        input.style.transform = "translateX(0px)";
    }

    function enterChecker(event) {
        var key = window.netscape ? event.which : event.keyCode;
        if(key == 13) {
            event.preventDefault();
            search();
        }
    }

    function syncInput(event) {
        desktopInput.value = input.value = event.currentTarget.value;
    }

    input.addEventListener('keydown', enterChecker);
    desktopInput.addEventListener('keydown', enterChecker);
    input.addEventListener('input', syncInput);
    desktopInput.addEventListener('input', syncInput);
    input.addEventListener('focusin', onInputBoxFocusIn);
    input.addEventListener('focusout', onInputBoxFocusOut);
    document.querySelector(".footer-btn").addEventListener('click', search);
    document.querySelector(".search-btn").addEventListener('click', search);
    document.querySelector(".search-header-input-btn").addEventListener('click', search);

    _search.append(document.querySelector(".mobileView"));
    var dialogAttachedList = document.querySelectorAll(".search-filter-category-wrapper");
    _search.attach(dialogAttachedList[0], dialogAttachedList[1], dialogAttachedList[2]);
    for(var elem of dialogAttachedList) elem.addEventListener('click', function(event) {
        if(window.innerWidth < 700) {
            event.stopImmediatePropagation();
            document.body.classList.remove("result");
        }
    }, true);

    var filterList = document.querySelectorAll(".search-filter-text");
    _search.setOnChangeListener(function(obj) {
        var resultArray = new Array();
        if(obj.onoff.text) resultArray.push(obj.onoff.text);
        for(var genre of obj.genre) resultArray.push(genre.text);
        for(var category of obj.category) resultArray.push(category);
        if(obj.price.text) resultArray.push(obj.price.text);

        var resultText = resultArray.length > 0 ? "적용된 필터 - " + resultArray.join(", ") : "";
        for(var elem of filterList) elem.textContent = resultText;
    });
    document.querySelector(".search-filter-init-btn").addEventListener('click', _search.reset);





    /*****  scroll *****/
    let _top = document.querySelector(".top_mobile");
    let smallTopSearchBarStyle = _top.querySelector(".header-search-bar-mobile").style;
    let smallTopNavButtonStyle = _top.querySelector(".dropdown-btn").style;
    let footer = document.querySelector("footer");
    let prevLevel;

    function mScrollEventListener(){// 5당 0.04 / 최대 0.2     =   0.4 -> 2
        let scrollLocation = document.documentElement.scrollTop;
        let alpha = (scrollLocation < 200) ? Math.floor(scrollLocation/5)*0.04 : 0.2; 
        let bottomValue = scrollLocation > 250 ? 0 : (scrollLocation > 150 ? (-120 + ((scrollLocation - 150) * 1.2)) : -120);
        //bottom: -120px; box-shadow: rgba(0, 0, 0, 0.047) 0px 4px 12px;
        footer.style.cssText = "bottom: " + bottomValue + "px; box-shadow: rgba(0, 0, 0, " + alpha + ") 0px 4px 12px";
        changeTopViewLevel(scrollLocation);
    }

    function changeTopViewLevel(level) {
        if (prevLevel == level || level < 0) return;

        let transTop, transAlpha, transMarginRight, transButtonTop;
        /* 100스크롤시 120 고정 + top은 -58까지만 조절 */
        if (level < 100) {
            transTop = level * 0.64;
            transAlpha = level / 500;
            transMarginRight = level * 0.65;
            transButtonTop = 20 + (level * 0.50);
        } else {
            transTop = 64;
            transAlpha = 0.2;
            transMarginRight = 65;
            transButtonTop = 70;
        }
        _top.style.cssText = "top: -" + transTop + "px; box-shadow: rgba(0, 0, 0, " + transAlpha + ") 0px 4px 12px";
        smallTopSearchBarStyle.marginRight = transMarginRight + "px";
        smallTopNavButtonStyle.top = transButtonTop + "px";

        prevLevel = level;
    }

    mScrollEventListener();
    addEventListener('scroll', mScrollEventListener);




    /*****  dropdown *****/
    let dropdownMenu = document.querySelector(".dropdown-menu-container");
    let dropdownClose = dropdownMenu.querySelector(".dropdown-menu-close");
    let dropdownOpen = document.querySelector(".dropdown-btn");
    dropdownClose.addEventListener('click', function() {
        dropdownMenu.style.animation = "none";
        void dropdownMenu.offsetWidth;
        dropdownMenu.style.cssText = "display:block; animation: dropdownFadeIn 0.2s linear backwards reverse;";
        const dropdownAnimListener = function() {
            dropdownMenu.style.cssText = "display: none;";
            dropdownMenu.removeEventListener('animationend', dropdownAnimListener);
        };
        dropdownMenu.addEventListener('animationend', dropdownAnimListener);
    });
    dropdownOpen.addEventListener('click', function() {
        dropdownMenu.style.display = "block";
    });

    document.querySelector(".logo-mobile").addEventListener('click', function() {location.href = '/';});
    document.querySelector(".search-top-btn").addEventListener('click', loadIndexPage);
    document.querySelector(".js-return-btn").addEventListener('click', loadIndexPage);
    document.querySelector(".header-search-bar-mobile").addEventListener('click', function() {
            document.body.classList.remove("result");
    });
})();