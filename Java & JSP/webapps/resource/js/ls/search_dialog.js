(function() {
    var searchList = new Array();
    var onChangeListener;
    const hintText = "중복해서 여러개를 선택할 수 있습니다.";

    function onChange(){
        if(onChangeListener) onChangeListener(parse());
    }

    function parse() {
        var result = {
            onoff : {},
            genre : new Array(),
            category : new Array(),
            price : {}
        };

        if(searchList.length > 0) {
            var list = searchList[0];

            var onoffList = list[onoffListName];
            for(var i = 0; i < onoffList.length; i++) {
                var item = onoffList[i];
                if(item.classList.contains("active")) {
                    if(item._value !== undefined) {
                        result.onoff.text = item.textContent;
                        result.onoff.value = item._value;
                    }
                    break;
                }
            }
            var genreList = list[genreListName];
            for(var i = 0; i < genreList.length; i++) {
                var item = genreList[i];
                if(item.checked) {
                    var obj = {
                        text : item.textContent,
                        value : item._value
                    };
                    result.genre.push(obj);
                }
            }
            var categoryList = list[categoryListName];
            for(var i = 0; i < categoryList.length; i++) {
                var item = categoryList[i];
                if(item.classList.contains("active")) {
                    result.category.push(item._value);
                }
            }
            var priceList = list[priceListName];
            for(var i = 0; i < priceList.length; i++) {
                var item = priceList[i];
                if(item.classList.contains("active")) {
                    if(item._value !== undefined) {
                        result.price.text = item._text;
                        result.price.value = item._value;
                    }
                    break;
                }
            }
        }
        return result;
    }

    function set(data) {
        for(var n = 0; n < searchList.length; n++) {
            var searchObj = searchList[n];

            var onoffList = searchObj[onoffListName];
            for(var i = 0; i < onoffList.length; i++) {
                var item = onoffList[i];
                if(data.onoff.value == item._value) {
                    item.classList.add("active");
                } else item.classList.remove("active");
            }
            
            var genreList = searchObj[genreListName];
            for(var i = 0; i < genreList.length; i++) {
                var item = genreList[i];
                var flag = false;
                var x = 0;
                while(x < data.genre.length) {
                    if(item._value == data.genre[x++].value) {
                        flag = true;
                        break;
                    }
                }
                item.checked = flag;
            }
            
            var categoryList = searchObj[categoryListName];
            for(var i = 0; i < categoryList.length; i++) {
                var item = categoryList[i];
                var flag = false;
                var x = 0;
                while(x< data.category.length) {
                    if(data.category[x++] == item._value) {
                        flag = true;
                        break;
                    }
                }
                if(flag) item.classList.add("active");
                else item.classList.remove("active");
            }

            var priceList = searchObj[priceListName];
            for(var i = 0; i < priceList.length; i++) {
                var item = priceList[i];
                if(data.price.value == item._value) {
                    item.classList.add("active");
                } else item.classList.remove("active");
            }
        }
        onChange();
    }

    const onoffListName = "onoffList";
    const type_onoff = [
        { text : "전체", value : undefined },
        { text : "온라인", value : true },
        { text : "오프라인", value : false }
    ];
    
    const genreListName = "classChkboxList";
    const type_class = [
        {
            title : "클래스",
            desc : "경제, 정치, 자격증 등 새로운걸 배우고 싶은 분에게 맞는 선택 입니다.",
            value : "CLASS"
        },
        {
            title : "컨퍼런스 · 세미나",
            desc : "다양한 세션과 네트워킹을 여러명과 하는 등 다목적 용도의 행사 입니다.",
            value : "CONFERENCE_SEMINAR"
        },
        {
            title : "라이프스타일",
            desc : "음악감상, 등산, 언어교환 등의 취미 활의 기반 밋업 입니다. 나와 공감대를 형성 할 수 있는 사람들을 만나 보세요!",
            value : "LIFESTYLE"
        }
    ];

    const categoryListName = "categoryList";
    const category = [
        { text : "경제", value : "ECONOMY" },
        { text : "철학", value : "PHILOSOPHY" },
        { text : "자격증", value : "CERTIFICATE" },
        { text : "정치", value : "POLITICS" },
        { text : "공부", value : "STUDY" },
        { text : "취미", value : "HOBBY" },
        { text : "금융", value : "FINANCE" },
        { text : "파티", value : "PARTY" },
        { text : "독서", value : "READING" },
        { text : "자기계발", value : "SELF_IMPROVEMENT" },
        { text : "비즈니스", value : "BUSINESS" },
        { text : "여행", value : "TRAVEL" },
        { text : "홈&라이프스타일", value : "HOME_AND_LIFESTYLE" },
        { text : "토론", value : "DISCUSSION" },
        { text : "북콘서트", value : "BOOK_CONCERT" }
    ];

    const priceListName = "priceList";
    const price = [
        { text : "전체", value : undefined },
        { text : "유료", value : false },
        { text : "무료", value : true }
    ];

    function appendDialogHint(base) {
        var hint = document.createElement("div");
        hint.className = "dialog-hint";
        hint.textContent = hintText;

        base.appendChild(hint);
    }

    function appendDialogResetComponent(base, onclick) {
        var text = document.createElement("button");
        text.className = "dialog-reset-text";
        text.textContent = "초기화";

        var button = document.createElement("button");
        button.className = "dialog-reset-button";
        button.innerHTML = '<svg width="13" height="13" viewBox="0 0 13 13" fill="#000" xmlns="http://www.w3.org/2000/svg"><path d="M11.0562 12.4062L6.5 7.85L1.94375 12.4062L0.59375 11.0562L5.15 6.5L0.59375 1.94375L1.94375 0.59375L6.5 5.15L11.0562 0.59375L12.4062 1.94375L7.85 6.5L12.4062 11.0562L11.0562 12.4062Z" fill="#000"></path></svg>';

        text.addEventListener('click', onclick);
        button.addEventListener('click', function() {base.classList.remove("open");});
        base.appendChild(text);
        base.appendChild(button);
    }

    function singleSelector(listName, selectValue) {
        for(var i = 0; i < searchList.length; i++) {
            var searchObj = searchList[i];
            var list = searchObj[listName];
            for(var l = 0; l < list.length; l++) {
                var elem = list[l];
                if(elem._value === selectValue) {
                    elem.classList.add("active");
                } else elem.classList.remove("active");

            }
        }

        onChange();
    }

    function resetType() {
        for(var i = 0; i < searchList.length; i++) {
            var searchObj = searchList[i];
            var x = 0;

            var onoff = searchObj[onoffListName];
            onoff[x++].classList.add("active");
            for(; x < onoff.length; x++) {
                onoff[x].classList.remove("active");
            }

            var genre = searchObj[genreListName];
            for(x = 0; x < genre.length; x++) {
                genre[x].checked = false;
            }
        }
        onChange();
    }

    function resetCategory() {
        for(var i = 0; i < searchList.length; i++) {
            var searchObj = searchList[i];
            var _category = searchObj[categoryListName];
            for(var l = 0; l < _category.length; l++) {
                _category[l].classList.remove("active");
            }
        }
        onChange();
    }

    function resetPrice() {
        for(var i = 0; i < searchList.length; i++) {
            var searchObj = searchList[i];
            var _price = searchObj[priceListName];
            _price[0].classList.add("active");
            for(var l = 1; l < _price.length; l++) {
                _price[l].classList.remove("active");
            }
        }
        onChange();
    }

    function reset() {
        for(var x = 0; x < searchList.length; x++) {
            var searchObj = searchList[x];
            var i = 0;

            var onoff = searchObj[onoffListName];
            onoff[0].classList.add("active");
            for(i = 1; i < onoff.length; i++) {
                onoff[i].classList.remove("active");
            }

            var genre = searchObj[genreListName];
            for(i = 0; i < genre.length; i++) {
                genre[i].checked = false;
            }

            var _category = searchObj[categoryListName];
            for(i = 0; i < _category.length; i++) {
                _category[i].classList.remove("active");
            }

            var _price = searchObj[priceListName];
            _price[0].classList.add("active");
            for(i = 1; i < _price.length; i++) {
                _price[i].classList.remove("active");
            }
        }
        onChange();
    }
    
    function createTypeAndGenreContainer(isDialog) {
        var onoffBox = document.createElement("ul");
        onoffBox.className = "search-filter-type-selector-box";
        var onoffList = new Array();

        function onClickOnOff(event) {
            singleSelector(onoffListName, event.currentTarget._value);
        }

        type_onoff.forEach(function(t) {
            var e = document.createElement("li");
            e.className = "default-flex-box search-filter-type-selector-btn";
            e.textContent = t.text;
            e._value = t.value;
            e.addEventListener('click', onClickOnOff);
            onoffList.push(e);
            onoffBox.appendChild(e);
        });
        onoffBox.firstElementChild.classList.add("active");


        var genreList = new Array();
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
            //chkbox._value = t.value;
            chkbox._value = t.title;
            chkbox.addEventListener('click', function(event) {
                var target = event.currentTarget;
                var flag = target.checked;

                for(var i = 0; i < searchList.length; i++) {
                    var searchObj = searchList[i];
                    var list = searchObj[genreListName];
                    for(var x = 0; x < list.length; x++) {
                        var l = list[x];
                        if(l._value == target._value) {
                            l.checked = flag;
                        }
                    }
                }
                onChange();
            });

            con.appendChild(inner);
            inner.appendChild(title);
            inner.appendChild(desc);
            if(isDialog) con.insertBefore(chkbox, con.childNodes[0]);
            else con.appendChild(chkbox);

            genreList.push(con);
            chkboxList.push(chkbox);
        });

        var container;
        if(isDialog) {
            container = document.createElement("div");
            container.className = "dialog-container";
            container.style.transform = "translate(-35%, 5%)";

            container.appendChild(onoffBox);

            var divider = document.createElement("div");
            divider.className = "dialog-type-divide-container";
            genreList.forEach(function(e) { divider.appendChild(e) } );
            appendDialogHint(divider);
            
            appendDialogResetComponent(container, resetType);

            container.appendChild(divider);
        } else {
            container = document.createElement("section");
            container.className = "search-filter-container";

            var title = document.createElement("div");
            title.className = "search-filter-title";
            title.textContent = "행사 유형";

            container.appendChild(title);
            container.appendChild(onoffBox);
            genreList.forEach(function(e) { container.appendChild(e) } );
        }

        container[onoffListName] = onoffList;
        container[genreListName] = chkboxList;

        return container;
    }

    function createCategoryContainer(isDialog) {
        var categoryList = new Array();
        var box = document.createElement("div");
        box.className = "search-filter-category-box";

        category.forEach(function(c) {
            var e = document.createElement("button");
            e.type = "button";
            e.className = "search-filter-category-btn";
            e._value = c.value;
            e.textContent = c.text;
            e.addEventListener('click', function(event) {
                var target = event.currentTarget;
                var flag = target.classList.contains("active");

                for(var i = 0; i < searchList.length; i++) {
                    var searchObj = searchList[i];
                    var list = searchObj[categoryListName];
                    for(var x = 0; x < list.length; x++) {
                        var l = list[x];
                        if(l._value == target._value) {
                            if(flag) l.classList.remove("active");
                            else l.classList.add("active");
                        }
                    }
                }
                onChange();
            });
            categoryList.push(e);
            box.appendChild(e);
        });

        var container;
        if(isDialog) {
            container = document.createElement("div");
            container.className = "dialog-container";
            container.style.transform = "translate(0px, 5%)";

            container.appendChild(box);
            appendDialogHint(container);
            appendDialogResetComponent(container, resetCategory);
        } else {
            container = document.createElement("section");
            container.className = "search-filter-container";

            var title = document.createElement("div");
            title.className = "search-filter-title";
            title.textContent = "카테고리";

            var desc = document.createElement("div");
            desc.className = "search-filter-category-desc";
            desc.textContent = hintText;

            container.appendChild(title);
            container.appendChild(desc);
            container.appendChild(box);
        }

        container[categoryListName] = categoryList;

        return container;
    }

    function createPriceContainer(isDialog) {
        var priceList = new Array();
        var container;

        function onClickPrice(event) {
            singleSelector(priceListName, event.currentTarget._value);
        }

        if(isDialog) {
            container = document.createElement("div");
            container.className = "dialog-container small";
            container.style.transform = "translate(0px, 5%)";
            
            price.forEach(function(p) {
                var item = document.createElement("button");
                item.className = "dialog-radio-item";
                item._text = p.text;
                item._value = p.value;

                var radio = document.createElement("div");
                radio.className = "dialog-radio-icon";

                var text = document.createElement("div");
                text.className = "dialog-radio-text";
                text.textContent = p.text;

                item.addEventListener('click', onClickPrice);

                item.appendChild(radio);
                item.appendChild(text);
                priceList.push(item);
                container.appendChild(item);
            });
            priceList[0].classList.add("active");

            appendDialogResetComponent(container, resetPrice);
        } else {
            container = document.createElement("section");
            container.className = "search-filter-container";

            var title = document.createElement("div");
            title.className = "search-filter-title";
            title.textContent = "유/무료 선택";

            var box = document.createElement("div");
            box.className = "serach-filter-price-box";

            price.forEach(function(p) {
                var e = document.createElement("button");
                e.type = "button";
                e.className = "search-filter-price-btn";
                e._text = e.textContent = p.text;
                e._value = p.value;
                e.addEventListener('click', onClickPrice);
                priceList.push(e);
                box.appendChild(e);
            });
            box.firstElementChild.classList.add("active");

            container.appendChild(title);
            container.appendChild(box);
        }

        container[priceListName] = priceList;

        return container;
    }

    window._search = {
        attach : function(elem1, elem2, elem3) {
            var typeAndGenreContainer = createTypeAndGenreContainer(true);
            var categoryContainer = createCategoryContainer(true);
            var priceContainer = createPriceContainer(true);
            
            elem1.parentElement.insertBefore(typeAndGenreContainer, elem1.nextElementSibling);
            elem2.parentElement.insertBefore(categoryContainer, elem2.nextElementSibling);
            elem3.parentElement.insertBefore(priceContainer, elem3.nextElementSibling);

            var opened = false;
            elem1.addEventListener('click', function(event) {
                event.stopImmediatePropagation();
                opened = true;
                typeAndGenreContainer.classList.add("open");
                categoryContainer.classList.remove("open");
                priceContainer.classList.remove("open");
            });

            elem2.addEventListener('click', function(event) {
                event.stopImmediatePropagation();
                opened = true;
                typeAndGenreContainer.classList.remove("open");
                categoryContainer.classList.add("open");
                priceContainer.classList.remove("open");
            });

            elem3.addEventListener('click', function(event) {
                event.stopImmediatePropagation();
                opened = true;
                typeAndGenreContainer.classList.remove("open");
                categoryContainer.classList.remove("open");
                priceContainer.classList.add("open");
            });

            var entered = false;
            function enterListener() {
                entered = true;
            }

            function leaveListener() {
                entered = false;
            }

            typeAndGenreContainer.addEventListener('mouseenter', enterListener);
            typeAndGenreContainer.addEventListener('mouseleave', leaveListener);

            categoryContainer.addEventListener('mouseenter', enterListener);
            categoryContainer.addEventListener('mouseleave', leaveListener);

            priceContainer.addEventListener('mouseenter', enterListener);
            priceContainer.addEventListener('mouseleave', leaveListener);
            
            document.body.addEventListener('click', function() {
                if(opened && !entered) {
                    opened = false;
                    typeAndGenreContainer.classList.remove("open");
                    categoryContainer.classList.remove("open");
                    priceContainer.classList.remove("open");
                }
            });

            var _new = {};
            _new[onoffListName] = typeAndGenreContainer[onoffListName];
            _new[genreListName] = typeAndGenreContainer[genreListName];
            _new[categoryListName] = categoryContainer[categoryListName];
            _new[priceListName] = priceContainer[priceListName];
            searchList.push(_new);
        },
        append : function(elem) {
            var typeAndGenreContainer = createTypeAndGenreContainer(false);
            var categoryContainer = createCategoryContainer(false);
            var priceContainer = createPriceContainer(false);

            elem.appendChild(typeAndGenreContainer);
            elem.appendChild(categoryContainer);
            elem.appendChild(priceContainer);

            var _new = {};
            _new[onoffListName] = typeAndGenreContainer[onoffListName];
            _new[genreListName] = typeAndGenreContainer[genreListName];
            _new[categoryListName] = categoryContainer[categoryListName];
            _new[priceListName] = priceContainer[priceListName];
            searchList.push(_new);
        },
        reset : reset,
        search : function(keyword, callback) {
            let paramArray = new Array();
            var data = parse();

            if(keyword) paramArray.push("keyword=" + keyword);
            if(data.onoff.value !== undefined) paramArray.push("isOnline=" + data.onoff.value);
            if(data.genre.length > 0) {
                data.genre.forEach(function(genre) {
                    paramArray.push("genre=" + genre.value);
                });
            }
            if(data.category.length > 0) {
                data.category.forEach(function(category) {
                    paramArray.push("category=" + encodeURIComponent(category));
                });
            }
            if(data.price.value !== undefined) paramArray.push("isFree=" + data.price.value);

            majax.load(document.querySelector(".content-container"), "https://api.libertysquare.co.kr/event/search", "GET", paramArray.join("&"))
                .then(function(xhr) {
                    var json = JSON.parse(xhr.responseText);
                    callback(json.events, json.hosts, json.findRows);
                })
                .catch(function(xhr) {
                    if(xhr && xhr.status != 404) {
                        alert("검색에 실패하였습니다. 잠시 후 다시 시도해주세요.\n" + xhr.responseText);
                    }
                    callback();
                });
        },
        parse : parse,
        set : set,
        setOnChangeListener : function(listener) {
            if(typeof(listener) == "function") onChangeListener = listener;
        }
    };
})();