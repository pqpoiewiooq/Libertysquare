(function() {
    class Dropdown {
        static count;
        static styleSheet;
        static defaultOption;
        static selectedOption;
        static tempOption;
        styleNodeList = new Array();
        element;
        config;
        scrollCount = 0;
        dropdownElement;
        elsewhereClickListener;
        createdClassName;
        isOpen = false;
        hideMode = false;

        constructor(element, config) {
            this.element = element;
            this.config = config;
            //외부에서 메소드 호출시, this 변경 방지를 위해 bind
            this.destroy = this.destroy.bind(this);
            this.open = this.open.bind(this);
            this.close = this.close.bind(this);
            this.toggle = this.toggle.bind(this);
            this.addOption = this.addOption.bind(this);
            this.select = this.select.bind(this);
        }
        
        _create() {
            this.dropdownElement = document.createElement("div");

            var config = this.config;
            var style, scroll, _class, option, init;
            if(typeof(config) === "object") {
                style = config["style"];
                var scroll = config["scroll"];
                if(typeof(scroll) == "number") this.scrollCount = scroll;
                _class = config["class"];
                option = config["option"];
                if(!option) option = Dropdown.defaultOption;
                init = config["init"];
                var hideMode = config["hideMode"];
                if(hideMode == "boolean") this.hideMode = hideMode;
            }
            if(typeof(init) != "boolean") init = true;

            this._createStyleSheet(style);
            this._setClass(_class);
            this._setOption(option);
            if(init) this._initFirstOptionSetting();
            
            // created dropdown attach on target element
            document.body.appendChild(this.dropdownElement);

            this.dropdownElement.tabIndex = this.element.tabIndex ? this.element.tabIndex : "-1";// focus이벤트를 위해
            this.setDropdownEventListener();
        }

        destroy() {
            document.body.removeChild(this.dropdownElement);
            document.removeEventListener('click', this.elsewhereClickListener);
            this.styleNodeList.forEach(function(n){Dropdown.styleSheet.removeChild(n);});
        }

        _initFirstOptionSetting() {
            // default option setting
            var optionList = this.dropdownElement.children;
            if(optionList.length > 0) {
                var first = optionList[0];
                first.setAttribute("selected", '');
                this.selectedOption = first;
                this.element.textContent = first.textContent;
                this.element.value = first.value;
            }
        }

        _createStyleSheet(style) {
            var styledElement = document.createElement("div");
            var cssText = "";
            
            // target element style
            var targetStyle = window.getComputedStyle(this.element);
            cssText += "border:" + targetStyle.border + ";"
                     + "color:" + targetStyle.color + ";"
                     + "background-color:" + targetStyle.backgroundColor + ";"
                     + "border-radius:" + targetStyle.borderRadius + ";"
                     + "font:" + targetStyle.font + ";";

            // Custom style
            if(style) {
                var styleType = typeof(style);
                if(styleType === "object") {
                    for(let attr in style){
                        cssText += attr + ":"+style[attr]+";";
                    }
                } else if(styleType === "string") {
                    if(style[style.length - 1] != ';') style += ";";
                    cssText += style;
                }
            }
            
            // Default style
            cssText += "position:absolute;"// outer css
                     + "overflow-y:auto;"// outer css
                     + "box-sizing:border-box;"// outer css
                     + "z-index:99999;"// outer css
                     + "display:none;";

            styledElement.style.cssText = cssText;
            cssText = styledElement.style.cssText;

            // Create style tag
            if(!Dropdown.styleSheet){
                Dropdown.styleSheet = document.createElement("style");
                document.body.appendChild(Dropdown.styleSheet);
            }
            if(Dropdown.count == undefined) Dropdown.count = 0;
            else Dropdown.count++;
            this.createdClassName = "dropdown"+Dropdown.count;
            var clsName = "." + this.createdClassName;

            // Option Style
            this.styleNodeList.push(document.createTextNode(clsName + " .dropdown-option{width:100%;display:flex;align-items:center;cursor:pointer;user-select:none;opacity:0.6;box-sizing:border-box;overflow:hidden;padding:"+targetStyle.padding+";}"));
            this.styleNodeList.push(document.createTextNode(clsName + " .dropdown-option:hover, .dropdown-option[selected] {opacity:1}"));
            
            if(this.hideMode) this.styleNodeList.push(document.createTextNode(clsName + " .dropdown-option[selected] {display: none;}"));
            
            // Dropdown Style
            var sheet = clsName + "{outline: none;" + cssText + "}";
            this.styleNodeList.push(document.createTextNode(sheet));

            // Base Element Style (After)
            var mainClassName = clsName + "-main";
            var paddingRight = (targetStyle.paddingRight == "" ? "8px" : targetStyle.paddingRight);
            this.styleNodeList.push(document.createTextNode(mainClassName + ".open::after {border-color: transparent transparent #999; border-width: 2.5px 5px 5px; top: calc(50% - 5px);}"));
            this.styleNodeList.push(document.createTextNode(mainClassName + "::after {content: ''; display: inline-block; border-color: #999 transparent transparent; border-style: solid; border-width: 5px 5px 2.5px; display: inline-block; height: 0; width: 0; position: absolute; right: "+paddingRight+"; top: 50%; pointer-events: none;}"));
            this.styleNodeList.push(document.createTextNode(mainClassName + " {position: relative;cursor:pointer;padding-right:calc("+ paddingRight + " + 8px)}"));
            this.styleNodeList.forEach(function(n){Dropdown.styleSheet.appendChild(n);});
            this.element.classList.add(this.createdClassName+"-main");            
        }

        setDropdownEventListener() {
			function isDisabled() {
				var disabled = this.element.disabled;
				if(typeof disabled == 'boolean') return disabled;
				else return this.element.getAttribute('disabled') != null;
			}
			isDisabled = isDisabled.bind(this);

            this.element.addEventListener('click', function(event){
                event.stopImmediatePropagation();
				if(!isDisabled()) this.toggle();
            }.bind(this));

            this.element.addEventListener('focusin', function(event) {
                event.stopImmediatePropagation();
                if(!this.mouseenter && !isDisabled()) {
                    this.open();
                }
            }.bind(this));

            this.element.addEventListener('mouseenter', function() {
                this.mouseenter = true;
            }.bind(this));
            this.element.addEventListener('mouseleave', function() {
                this.mouseenter = false;
            }.bind(this));

            this.elsewhereClickListener = function(event) {
                event.stopImmediatePropagation();
                if(!this.mouseenter) {
                    this.close();
                }
            }.bind(this);
            this.dropdownElement.addEventListener('blur', this.elsewhereClickListener);

            // 방향키 누를 때 이벤트
            this.dropdownElement.addEventListener('keydown', function(event) {
                event.preventDefault();

                var key = window.netscape ? event.which : event.keyCode;
                switch(key) {
                case 38: // up
                    var prev = this.tempOption;
                    if(!prev) prev = this.selectedOption;

                    if(prev.previousElementSibling) {
                        if(this.tempOption && this.tempOption !== this.selectedOption) this.tempOption.removeAttribute("selected");
                        this.tempOption = prev.previousElementSibling;
                        this.tempOption.setAttribute("selected", ''); 
                    }
                    break;
                case 40: // down
                    var prev = this.tempOption;
                    if(!prev) prev = this.selectedOption;

                    if(prev.nextElementSibling) {
                        if(this.tempOption && this.tempOption !== this.selectedOption) this.tempOption.removeAttribute("selected");
                        this.tempOption = prev.nextElementSibling;
                        this.tempOption.setAttribute("selected", ''); 
                    }
                    break;
                case 13: // enter
                case 32: // space
                    if(this.tempOption) {
                        for(var i = 0; i < this.dropdownElement.children.length; i ++) {
                            if(this.dropdownElement.children[i] === this.tempOption) {
                                this.dropdownElement.children[i].dispatchEvent(new Event("click"));
                            }
                        }
                    } else {
                        this.close();// selectListener에서도 옵션이 다른것으로 바뀌었을 때만 event 호출하기떄문에, 선택된 option이 없으면 그냥 닫기
                    }
                    break;
                case 27: // ESC
                    this.close();
                    break;
                }
            }.bind(this));
        }

        _setClass(_class) {
            if(_class) {
                if(Array.isArray(_class)){
                    _class.forEach(function(c) {
                        this.dropdownElement.classList.add(c);
                    });
                } else if(typeof(_class) === "string"){
                    this.dropdownElement.className += (this.createdClassName + " " + _class);
                }
            }
            this.dropdownElement.classList.add(this.createdClassName);
        }

        toggle() {
            if(this.isOpen) this.close();
            else this.open();
        }

        open() {
            var target = this.element;
            var dropdown = target._dropdown;
            if(dropdown){
                var dropdownElement = dropdown.dropdownElement;
                var style = dropdownElement.style;
                var height = target.offsetHeight;
                var width = target.offsetWidth;
                var rect = target.getBoundingClientRect();
                var bottom = rect.bottom + window.pageYOffset;
                var left = rect.left + window.pageXOffset;

                var parentCss = "display:block;left:" + left + "px;top:" + bottom + "px;width:" + width + "px;";
                if(this.scrollCount > 0) parentCss += "height:" + (height * this.scrollCount) + "px;";
                style.cssText += parentCss;
                var children = dropdownElement.children;
                var childCount = children.length;
                var childCss = "height:"+height+"px;"
                for(var i = 0; i < childCount; i++) {
                    children[i].style.cssText = childCss;
                }

                target.classList.add("open");
                dropdownElement.focus();
                this.isOpen = true;
            }
        }

        close() {
            this.dropdownElement.style.display = "none";
            this.element.classList.remove("open");
            this.isOpen = false;
            if(this.tempOption && this.tempOption !== this.selectedOption) {
                this.tempOption.removeAttribute("selected");
            }
        }

        addOption(text, value) {
            var newOption = document.createElement("div");
            newOption.className = "dropdown-option";
            newOption.textContent = text;
            newOption.value = value;
            newOption._index = this.dropdownElement.children.length;

            var listener = this.selectListener.bind(this);
            newOption.addEventListener('click', listener);

            this.dropdownElement.appendChild(newOption);
        }

        select(index) {
            if(typeof(index) == "number") {
                this.dropdownElement.children[index].dispatchEvent(new Event("click"));
            }
        }

        selectValue(value) {
            for(var i = 0; i < this.dropdownElement.children.length; i ++) {
                if(this.dropdownElement.children[i].value == value) {
                    this.dropdownElement.children[i].dispatchEvent(new Event("click"));
                    return true;
                }
            }
            return false;
        }

        selectListener(event) {
            var base = this.element;
            var target = event.currentTarget;
            var _prev = {text: undefined, value: undefined};
            var _new = {text: target.textContent, value: target.value};
            var prevOption;

            _prev["value"] = base.value;
            _prev["text"] = base.textContent;

            // Dispatch selected Option Change Event
            let selectEvent = new CustomEvent("optionselect", {
                detail: {
                    target: target,
                    dropdown: this,
                    before: _prev,
                    after: _new
                },
                cancelable: true
            });
            if(base.dispatchEvent(selectEvent)){// selectEvent에서 preventDefault()가 호출되지 않은 경우
                prevOption = this.selectedOption;
                this.selectedOption = target;
                if(prevOption) {
                    prevOption.removeAttribute("selected");
                }
                this.selectedOption.setAttribute("selected", '');    
                base.value = _new["value"];
                base.textContent = _new["text"];
            }
            if(this.selectedOption && !this.selectedOption.isSameNode(prevOption)){
                let selectedOptionChangedEvent = new CustomEvent("optionchange", {
                    detail: {
                        target: target,
                        dropdown: this,
                        before: _prev,
                        after: _new
                    }
                });
                base.dispatchEvent(selectedOptionChangedEvent);
            }

            this.close();
        }

        static setDefaultDropdownOption(option) {
            Dropdown.defaultOption = option;
        }

        _setOption(option) {
            if(Array.isArray(option)) {
                for(var i = 0; i < option.length; i++){
                    var o = option[i];
                    this.addOption(o, o);
                }
            } else if(typeof(option) === "object") {
                for(let text in option) {
                    this.addOption(text, option[text]);
                }
            }
        }
    
        static attchNew(element, config) {
            if(element._dropdown) element._dropdown.destroy();

            var dropdown = new Dropdown(element, config);
            dropdown._create();
            element._dropdown = dropdown;
        }
    }



    HTMLElement.prototype.dropdown = function(config){
        Dropdown.attchNew(this, config);
    };

    setDefaultDropdownOption = function(option) {
        Dropdown.setDefaultDropdownOption(option);
    };

    // Options
    Dropdown.Configs = {
        time_half : {
            option:{
                "오전 00:00": "00:00:00", "오전 00:30": "00:30:00",
                "오전 01:00": "01:00:00", "오전 01:30": "01:30:00",
                "오전 02:00": "02:00:00", "오전 02:30": "02:30:00",
                "오전 03:00": "03:00:00", "오전 03:30": "03:30:00",
                "오전 04:00": "04:00:00", "오전 04:30": "04:30:00",
                "오전 05:00": "05:00:00", "오전 05:30": "05:30:00",
                "오전 06:00": "06:00:00", "오전 06:30": "06:30:00",
                "오전 07:00": "07:00:00", "오전 07:30": "07:30:00",
                "오전 08:00": "08:00:00", "오전 08:30": "08:30:00",
                "오전 09:00": "09:00:00", "오전 09:30": "09:30:00",
                "오전 10:00": "10:00:00", "오전 10:30": "10:30:00",
                "오전 11:00": "11:00:00", "오전 11:30": "11:30:00",

                "오후 00:00": "12:00:00", "오후 00:30": "12:30:00",
                "오후 01:00": "13:00:00", "오후 01:30": "13:30:00",
                "오후 02:00": "14:00:00", "오후 02:30": "14:30:00",
                "오후 03:00": "15:00:00", "오후 03:30": "15:30:00",
                "오후 04:00": "16:00:00", "오후 04:30": "16:30:00",
                "오후 05:00": "17:00:00", "오후 05:30": "17:30:00",
                "오후 06:00": "18:00:00", "오후 06:30": "18:30:00",
                "오후 07:00": "19:00:00", "오후 07:30": "19:30:00",
                "오후 08:00": "20:00:00", "오후 08:30": "20:30:00",
                "오후 09:00": "21:00:00", "오후 09:30": "21:30:00",
                "오후 10:00": "22:00:00", "오후 10:30": "22:30:00",
                "오후 11:00": "23:00:00", "오후 11:30": "23:30:00"
            },
            scroll: 5
        },
        category_event : {
            option: {
                "경제" : "ECONOMY",
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
                "북콘서트" : "BOOK_CONCERT"
            },
            scroll: 5,
            init: false
        },
        genre_event : {
            option: {
                "클래스" : "CLASS",
                "컨퍼런스 · 세미나" : "CONFERENCE_SEMINAR",
                "라이프스타일" : "LIFESTYLE"
            }
        }
    };


    // Default Setting 
    setDefaultDropdownOption(Dropdown.Configs.time_half.option);
})();