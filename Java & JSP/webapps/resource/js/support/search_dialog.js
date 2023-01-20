(function() {
    var searchList = new Array();
    var onChangeListener;
    const hintText = "중복해서 여러개를 선택할 수 있습니다.";

    function onChange(){
        if(onChangeListener) onChangeListener(parse());
    }

    function parse() {
        var result = {
            genre : new Array(),
            category : new Array(),
        };

        if(searchList.length > 0) {
            var list = searchList[0];

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
        }
        return result;
    }

    function set(data) {
        for(var n = 0; n < searchList.length; n++) {
            var searchObj = searchList[n];

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
        }
        onChange();
    }

    const genreListName = "classChkboxList";
    const type_class = [
        {
            title : "개인",
            desc : "사업자등록증이 없는 개인입니다.",
            value : "INDIVIDUAL"
        },
        {
            title : "사업자",
            desc : "개인사업자, 영리법인 등으로 등록된 단체입니다.",
            value : "PROPRIETOR"
        },
        {
            title : "비영리 · 면세사업자",
            desc : "시민단체, 사단법인, 재단법인 등으로 등록된 단체입니다.",
            value : "NPO_TFE"
        }
    ];

    const categoryListName = "categoryList";
    const category = [
        { text : "정치", value : "POLITICS" },
        { text : "교육", value : "EDUCATION" },
        { text : "언론", value : "PRESS" },
        { text : "시민운동", value : "CIVIC_MOVEMENT" },
        { text : "학술", value : "ACADEMIC" },
        { text : "기타", value : "ETC" },
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

    function reset() {
        for(var x = 0; x < searchList.length; x++) {
            var searchObj = searchList[x];
            var i = 0;

            var genre = searchObj[genreListName];
            for(i = 0; i < genre.length; i++) {
                genre[i].checked = false;
            }

            var _category = searchObj[categoryListName];
            for(i = 0; i < _category.length; i++) {
                _category[i].classList.remove("active");
            }
        }
        onChange();
    }
    
    function createTypeAndGenreContainer(isDialog) {
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

            var divider = document.createElement("div");
            divider.className = "dialog-type-divide-container";
            divider.style.cssText = "border-top: 0; margin-top: 0;"
            genreList.forEach(function(e) { divider.appendChild(e) } );
            appendDialogHint(divider);
            
            appendDialogResetComponent(container, resetType);

            container.appendChild(divider);
        } else {
            container = document.createElement("section");
            container.className = "search-filter-container";

            var title = document.createElement("div");
            title.className = "search-filter-title";
            title.textContent = "후원단체 종류";
            title.style.cssText = "margin-bottom: 24px;";

            container.appendChild(title);
            genreList.forEach(function(e) { container.appendChild(e) } );
        }

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

    window._search = {
        attach : function(elem1, elem2) {
            var typeAndGenreContainer = createTypeAndGenreContainer(true);
            var categoryContainer = createCategoryContainer(true);
            
            elem1.parentElement.insertBefore(typeAndGenreContainer, elem1.nextElementSibling);
            elem2.parentElement.insertBefore(categoryContainer, elem2.nextElementSibling);

            var opened = false;
            elem1.addEventListener('click', function(event) {
                event.stopImmediatePropagation();
                opened = true;
                typeAndGenreContainer.classList.add("open");
                categoryContainer.classList.remove("open");
            });

            elem2.addEventListener('click', function(event) {
                event.stopImmediatePropagation();
                opened = true;
                typeAndGenreContainer.classList.remove("open");
                categoryContainer.classList.add("open");
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
            
            document.body.addEventListener('click', function() {
                if(opened && !entered) {
                    opened = false;
                    typeAndGenreContainer.classList.remove("open");
                    categoryContainer.classList.remove("open");
                }
            });

            var _new = {};
            _new[genreListName] = typeAndGenreContainer[genreListName];
            _new[categoryListName] = categoryContainer[categoryListName];
            searchList.push(_new);
        },
        append : function(elem) {
            var typeAndGenreContainer = createTypeAndGenreContainer(false);
            var categoryContainer = createCategoryContainer(false);

            elem.appendChild(typeAndGenreContainer);
            elem.appendChild(categoryContainer);

            var _new = {};
            _new[genreListName] = typeAndGenreContainer[genreListName];
            _new[categoryListName] = categoryContainer[categoryListName];
            searchList.push(_new);
        },
        reset : reset,
        search : function(keyword, callback) {
            let paramArray = new Array();
            var data = parse();

            if(keyword) paramArray.push("keyword=" + keyword);
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