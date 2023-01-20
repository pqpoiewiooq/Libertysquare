history.scrollRestoration = "manual";

// window.origin = ...;
(function(location){
    // const defaultProtocol = "https:";
    // const domain = "libertysquare.co.kr";
    const resourceURL = "https://ls2020.cafe24.com/";

    location.getResource = function(path) {
        return resourceURL + path;
    };
}(location));



// polyfill - promise
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t():"function"==typeof define&&define.amd?define(t):t()}(0,function(){"use strict";function e(e){var t=this.constructor;return this.then(function(n){return t.resolve(e()).then(function(){return n})},function(n){return t.resolve(e()).then(function(){return t.reject(n)})})}function t(e){return new this(function(t,n){function o(e,n){if(n&&("object"==typeof n||"function"==typeof n)){var f=n.then;if("function"==typeof f)return void f.call(n,function(t){o(e,t)},function(n){r[e]={status:"rejected",reason:n},0==--i&&t(r)})}r[e]={status:"fulfilled",value:n},0==--i&&t(r)}if(!e||"undefined"==typeof e.length)return n(new TypeError(typeof e+" "+e+" is not iterable(cannot read property Symbol(Symbol.iterator))"));var r=Array.prototype.slice.call(e);if(0===r.length)return t([]);for(var i=r.length,f=0;r.length>f;f++)o(f,r[f])})}function n(e){return!(!e||"undefined"==typeof e.length)}function o(){}function r(e){if(!(this instanceof r))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=undefined,this._deferreds=[],l(e,this)}function i(e,t){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,r._immediateFn(function(){var n=1===e._state?t.onFulfilled:t.onRejected;if(null!==n){var o;try{o=n(e._value)}catch(r){return void u(t.promise,r)}f(t.promise,o)}else(1===e._state?f:u)(t.promise,e._value)})):e._deferreds.push(t)}function f(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var n=t.then;if(t instanceof r)return e._state=3,e._value=t,void c(e);if("function"==typeof n)return void l(function(e,t){return function(){e.apply(t,arguments)}}(n,t),e)}e._state=1,e._value=t,c(e)}catch(o){u(e,o)}}function u(e,t){e._state=2,e._value=t,c(e)}function c(e){2===e._state&&0===e._deferreds.length&&r._immediateFn(function(){e._handled||r._unhandledRejectionFn(e._value)});for(var t=0,n=e._deferreds.length;n>t;t++)i(e,e._deferreds[t]);e._deferreds=null}function l(e,t){var n=!1;try{e(function(e){n||(n=!0,f(t,e))},function(e){n||(n=!0,u(t,e))})}catch(o){if(n)return;n=!0,u(t,o)}}var a=setTimeout;r.prototype["catch"]=function(e){return this.then(null,e)},r.prototype.then=function(e,t){var n=new this.constructor(o);return i(this,new function(e,t,n){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=n}(e,t,n)),n},r.prototype["finally"]=e,r.all=function(e){return new r(function(t,o){function r(e,n){try{if(n&&("object"==typeof n||"function"==typeof n)){var u=n.then;if("function"==typeof u)return void u.call(n,function(t){r(e,t)},o)}i[e]=n,0==--f&&t(i)}catch(c){o(c)}}if(!n(e))return o(new TypeError("Promise.all accepts an array"));var i=Array.prototype.slice.call(e);if(0===i.length)return t([]);for(var f=i.length,u=0;i.length>u;u++)r(u,i[u])})},r.allSettled=t,r.resolve=function(e){return e&&"object"==typeof e&&e.constructor===r?e:new r(function(t){t(e)})},r.reject=function(e){return new r(function(t,n){n(e)})},r.race=function(e){return new r(function(t,o){if(!n(e))return o(new TypeError("Promise.race accepts an array"));for(var i=0,f=e.length;f>i;i++)r.resolve(e[i]).then(t,o)})},r._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){a(e,0)},r._unhandledRejectionFn=function(e){void 0!==console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)};var s=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw Error("unable to locate global object")}();"function"!=typeof s.Promise?s.Promise=r:s.Promise.prototype["finally"]?s.Promise.allSettled||(s.Promise.allSettled=t):s.Promise.prototype["finally"]=e});

// polyfill - customevent
(function () {if ( typeof window.CustomEvent === "function" ) return false;function CustomEvent ( event, params ) {params = params || { bubbles: false, cancelable: false, detail: undefined };var evt = document.createEvent( 'CustomEvent' );evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );return evt;}CustomEvent.prototype = window.Event.prototype;window.CustomEvent = CustomEvent;})();



/* Date 관련 */
(function() {
	const isKST = (new Date().getTimezoneOffset() == -540);

	const parse = Date.parse;
	function _parse(s) {
		const d = parse(s);
		return d ? new Date(d) : new Date(s.replace(/\.[0-9]/g, '').replace(/-/g, '/'));
	}

	if(isKST) {
		Date.toKST = function(date) {
			return date;
		}
		Date.current = function() {
			return new Date();
		}
		Date.parse = _parse;
	} else {
		const KR_TIME_DIFF = 9 * 60 * 60 * 1000;

		function toKST(date) {
			if(!date) return NaN;

			const utc = date.getTime() + (date.getTimezoneOffset() * 60 * 1000);
			return new Date(utc + (KR_TIME_DIFF));
		}
		Date.toKST = toKST;
		
		Date.current = function() {
			return toKST(new Date());
		}

		Date.now = function() {
			return Date.current().getTime();
		}

		Date.parse = function(s) {
			return toKST(_parse(s));
		}
	}

	const week_ko = ["일", "월", "화", "수", "목", "금", "토"];
	function twoDigit(num) {
		return (num >= 10) ? num : '0' + num;
	}
	Date.format = function(date, f) {
		if (!date) return "";
		
		return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a)/gi, function($1) {
			switch ($1) {
				case "yyyy": return date.getFullYear();
				case "yy": return twoDigit(date.getFullYear() % 1000);
				case "MM": return twoDigit(date.getMonth() + 1);
				case "dd": return twoDigit(date.getDate());
				case "E": return week_ko[date.getDay()];
				case "HH": return twoDigit(date.getHours());
				case "hh":
					var h = date.getHours() % 12;
					return h ? twoDigit(h) : 12;
				case "mm": return twoDigit(date.getMinutes());
				case "ss": return twoDigit(date.getSeconds());
				case "a": return date.getHours() < 12 ? "오전" : "오후";
				default: return $1;
			}
		});
	};
})();
function dateFormat(str, isOnline) {
	return Date.format(Date.parse(str), 'yyyy-MM-dd (E) · ') + (isOnline ? "온라인" : "오프라인");
}








function loadJs(src, onLoad) {
    var js = document.createElement("script");
    js.type = "text/javascript";
    js.src = src + "?rt=" + Date.now();
    if(typeof(onLoad) === "function") {
        js.addEventListener('load', onLoad, { once: true });
    }
    document.body.appendChild(js);
}

function loadJsList(list, callback) {
    var jsList = new Array();
    var cb = callback;
    for(var i = 0; i < list.length; i++) {
        var js = document.createElement("script");
        js.type = "text/javascript";
        js.src = list[i] + "?rt=" + Date.now();
        js.addEventListener('load', function(e){
            e.currentTarget.done = true;
            for(var i = 0; i < jsList.length; i++) {
                if(!jsList[i].done) return;
            }
            if(cb) cb();
        }, { once: true });
        jsList[i] = js;
    }

    for(var i = 0; i < jsList.length; i++) {
        document.body.appendChild(jsList[i]);
    }
}

function loadCss(href) {
    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.type = "text/css";
    css.href = href + "?rt=" + Date.now();
    document.body.appendChild(css);
}

function currency(price) {
    if(!price || price == "0" || price == 0) return "무료";
    if(typeof(price) == "number") price += "";
    return "₩ " + price.replace(/[^0-9]/g,'').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function deepCopy(target, origin, loadedCallback) {
    var scriptList = new Array();
    var callbackTrigger = true;

    (function _deepCopy(_target, _origin) {
        var childNodes = _origin.childNodes;
        for(var i = 0; i < childNodes.length; i++) {
            var node = childNodes[i];
            if(node.nodeName == "SCRIPT") {
                var script = document.createElement('script');
                script.setAttribute('type', 'text/javascript');
                if(node.src) {
                    scriptList.push({
                        container: _target,
                        script: script
                    });
                    script.addEventListener('load', function(e){
                        e.currentTarget.done = true;
                        for(var i = 0; i < scriptList.length; i++) {
                            if(!scriptList[i].script.done) return;
                        }
                        if(callbackTrigger) {
                            callbackTrigger = false;
                            loadedCallback();// callback 및 list 관리 등을 위해 deepCopy를 하나의 function으로 감싸고, 그 안에 실제 작업을 하는 function을 생성하여 실행
                            window.dispatchEvent(new Event("load"));
                        }
                    }, { once: true });
                    script.src = node.src;
                } else {
                    script.innerHTML = node.innerHTML;
                    _target.appendChild(script);
                    _target.removeChild(script);
                }
            } else {
                var clone = node.cloneNode();
                _target.appendChild(clone);
                if(node.hasChildNodes()) _deepCopy(clone, node);
            }
        }
    })(target, origin);

    if(scriptList.length > 0) {
        for(var i = 0; i < scriptList.length; i++) {
            var obj = scriptList[i];
            obj.container.appendChild(obj.script);
        }
    } else {
        loadedCallback();
        window.dispatchEvent(new Event("load"));
    }
}

const checkIE = (function() {
	const agent = navigator.userAgent.toLowerCase();
    const isIE = (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1);
	return function() {
		return isIE;
	}
})();

(function(proto) {
	function getAbsoluteTop(elem) {
		return elem.getBoundingClientRect().top + window.pageYOffset + (proto._scrollTop.distance || 0);
	}

	function bool(lhs, rhs) {
		return (typeof(lhs) == "boolean") ? lhs : rhs;
	}

	proto._scrollTop = checkIE() ?
			function(focus) {
				const abTop = getAbsoluteTop(this);
				window.scrollTo(0, abTop);
				if(bool(focus, proto._scrollTop.autoFocus)) {
					this.focus();
				}
				return abTop;
			}
			:
			function(focus, smooth) {
				const abTop = getAbsoluteTop(this);
				if(bool(smooth, proto._scrollTop.autoSmooth)) {
					window.scrollTo({ behavior: 'smooth', left: 0, top: abTop });
				} else {
					window.scrollTo({ left: 0, top: abTop });
				}
				if(bool(focus, proto._scrollTop.autoFocus)) {
					this.focus();
				}
				return abTop;
			};
	proto._scrollTop.distance = -29;
	proto._scrollTop.autoFocus = false;
	proto._scrollTop.autoSmooth = true;
})(HTMLElement.prototype);

function doLoading(parent, isFullScreen) {
    if(!parent) return;

    var loadingBox = document.createElement("div");
    loadingBox.className = isFullScreen ? "loading-container full" : "loading-container";
    loadingBox.innerHTML = '<svg viewBox="0 0 512 512" height="60" width="60" aria-hidden="true" focusable="false" fill="currentColor" class="loading-inner"><path fill="currentColor" d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"></path></svg>';
    parent.appendChild(loadingBox);
	parent.__isLoading = true;
    parent.addEventListener('mload', function() {
		loadingBox.remove();
		parent.__isLoading = false;
	}, { once: true });
}
function stopLoading(parent) {
	if(!parent) return;

	parent.dispatchEvent(new CustomEvent("mload"));
}

const majax = (function() {
	/**
	 * If url starts with '/', it is converted to baseURL + url and returned.
	 * @param {string} url
	 * @returns {string}
	 */
	function baseURL(url) {
		if(majax.baseURL && url.startsWith('/')) {
			return majax.baseURL + url;
		}
		return url;
	}

	/**
	 * @see {@link baseURL}
	 * 
	 * @param {'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH'} method 
	 * @param {string} url 
	 * @param {(string | FormData)=} payload 
	 * @returns {{xhr: XMLHttpRequest, payload?: (string | FormData)}}
	 * - method
	 * -- 'GET' | 'DELETE' : undefined. 
	 * 		(Change URL : url + "?" + payload)
	 * -- 'POST' | 'PUT' | 'PATCH' : presented payload.
	 * 		(if payload is not FormData, Add : H - "Content-Type: application/x-www-form-urlencoded")
	 */
	function open(method, url, payload) {
		var xhr = new XMLHttpRequest();

		url = baseURL(url);

		if(payload && (method == "GET" || method == "DELETE")){
			url += "?" + payload;
			payload = undefined;
		}
		
		xhr.open(method, url);
		xhr.withCredentials = true;
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

		if(method == "POST" || method == "PUT" || method == "PATCH") {
			if(!(payload instanceof FormData)) {
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			}
		}

		return { xhr, payload };
	}

	return {
		baseURL: 'https://api.libertysquare.co.kr',
		once: true,
		onceAlert: "진행중인 작업이 있습니다. 잠시 후 다시 시도해주세요.",
        load : function(parent, url, method, param, onprogress, isFullScreen) {
            doLoading(parent, isFullScreen);

            return new Promise(function(resolve, reject) {
                if(majax.once) {
                    if(majax.isRunning) {
                        if(majax.onceAlert) {
                            alert(majax.onceAlert);
                        }
                        if(parent) stopLoading(parent);
                        reject();
                        return;
                    }
                }
                majax.isRunning = true;
    
                method = method.toLocaleUpperCase();
                
				var { xhr, payload } = open(method, url, param);
                if(onprogress) xhr.upload.onprogress = onprogress;
                xhr.onreadystatechange = function () {
                    if(xhr.readyState == 4){
                        majax.isRunning = false;

                        if(parent) stopLoading(parent);

                        if(xhr.status == 200) {
                            resolve(xhr);
                        } else {
                            var reloadFlag = reject(xhr);
                            if(reloadFlag !== false && xhr.status == 401) location.reload();
                        }
                    }
                };
    
                try{
                    xhr.send(payload);
                    return true;
                } catch(error) {
                    if(parent) stopLoading(parent);
                    majax.isRunning = false;
                }
            });
        },
        do : function(url, method, param, successCallback, failCallback){
            if(majax.once) {
                if(majax.isRunning) {
                    if(majax.onceAlert) {
                        alert(majax.onceAlert);
                    }
                    return false;
                }
            }
            majax.isRunning = true;

            method = method.toLocaleUpperCase();
            var doSuccess = successCallback;
            var doFail = failCallback;
            
			var { xhr, payload } = open(method, url, param);
            xhr.onreadystatechange = function () {
                if(xhr.readyState == 4){
                    majax.isRunning = false;
                    if(xhr.status == 200) {
                        if(doSuccess) doSuccess(xhr);
                    } else {
                        var reloadFlag = true;
                        if(doFail) reloadFlag = doFail(xhr);
                        if(reloadFlag !== false && xhr.status == 401) location.reload();
                    }
                }
            };

            try{
                xhr.send(payload);
                return true;
            } catch(error) {
                majax.isRunning = false;
            }
        },
        uploadImage : function(file, parent, success, fail, progress, isFullScreen) {
            var scb = success;
            var fcb = fail;
            var formdata = new FormData();    
            formdata.append('file', file, file.name);
            return majax.load(parent, "/image", "POST", formdata, progress, isFullScreen).
                then(function(xhr) {
                    if(!majax.uploadedImages) {
                        majax.uploadedImages = new Array();
                    }
                    majax.uploadedImages.push(xhr.responseText);
                    if(scb) scb(xhr.responseText);
                }).catch(function(xhr) {
					if(parent) stopLoading(parent);
                    if(fcb) {
                        if(!fcb(xhr)) return false;
                    }
                    alert("서버 통신 오류입니다.\n잠시 후 다시 시도해주세요." + xhr ? '\n' + xhr.responseText : '');
                });
        },
        checkID : function(id, callback) {
            var doCallback = callback;
            return majax.do('https://api.libertysquare.co.kr/account?id='+id, "GET", undefined,
                function(xhr) { // success
                    if(doCallback) doCallback(true);
                },
                function(){
                    if(doCallback) doCallback();
                });
        },
        replaceInnerHTML : function(url, replaceElement, targetSelector, pushState, successCallback, failCallback) {
            var eurl = url;
            var relem = replaceElement;
            var selector = targetSelector;
            var flag = pushState;
            var doSuccess = successCallback;
            var doFail = failCallback;
            while(relem.hasChildNodes()) relem.removeChild(relem.firstChild);
			var _baseURL = majax.baseURL;
			majax.baseURL = '';
            majax.load(replaceElement, url, "GET")
                .then(function(xhr){
                    try {
                        var responseDocument = document.createElement("document");
                        var responseHtml = document.createElement("html");
                        responseHtml.innerHTML = xhr.responseText;
                        responseDocument.appendChild(responseHtml);
            
                        // replace title
                        let title = document.querySelector("title");
                        title.textContent = responseDocument.querySelector("title").textContent;
            
                        // replace html
                        //relem.innerHTML = extractAndExecuteScript(responseDocument.querySelector(selector).innerHTML);
                    
                        var target = responseDocument.querySelector(selector);

                        if(flag === true) history.pushState(null, null, eurl);

                        deepCopy(relem, target, doSuccess ? function(){doSuccess(xhr);} : undefined);
                    } catch(exception) {
                        console.log(exception);
                        if(doFail) doFail(xhr, exception);
                        return;
                    }
                })
                .catch(function(xhr){
                    if(doFail) doFail(xhr);
                });
			majax.baseURL = _baseURL;
        }
    }
}());

function flatpickrAutoSetter(startElement, endElement) {
    function checker() {
        var sfp = startElement._flatpickr;
        var efp = endElement._flatpickr;
        var sd = sfp.selectedDates[0];
        var ed = efp.selectedDates[0];
        efp.config.minDate = sd;
        if(sd > ed) {
            return sd;
        }
    }

    function setter() {
        var d = checker();
        if(d) {
            endElement._flatpickr.setDate(d);
            endElement.dispatchEvent(new Event("change"));
        }
    }

    startElement.addEventListener('change', setter);

    return checker;
}

function dropdownAutoSetter(startElement, endElement, errorElement, errorText) {
    function check() {
        var flag = startElement.value > endElement.value;
        if(errorElement) {
            if(flag) {
                errorElement.style.display = "block";
                if(errorText) errorElement.textContent = errorText;
            } errorElement.style.display = "none";
        }
        return !flag;
    }

    function change(event) {
        if(startElement.value > endElement.value) {
            endElement._dropdown.select(event.detail.target._index);
        }
    }

    startElement.addEventListener('optionchange', check);
    startElement.addEventListener('optionchange', change);
    endElement.addEventListener('optionchange', check);

    return check;
}

function convertCssStyles(href, selectorText, regex, convertValue) {
    try {
        var documentStyleSheet = document.styleSheets;
        for(var x = 0; x < documentStyleSheet.length; x++) {
            var styleSheet = documentStyleSheet[x];
            if(styleSheet.href && styleSheet.href.indexOf(href) >= 0) {
                /* styleSheet.rules is deprecated*/
                for(var y = 0; y < styleSheet.cssRules.length; y++) {
                    var rule = styleSheet.cssRules[y];
                    if(!selectorText || (rule.selectorText && rule.selectorText.indexOf(selectorText) >= 0)) {
                        var cssText = rule.cssText;
                        styleSheet.deleteRule(y);
                        styleSheet.insertRule(cssText.replace(regex, convertValue), y);
                        return true;
                    }
                }
            }
        }
    } catch(exception) {
        console.log(exception);
        return false;
    }
    return false;
}

const MB = 1024 * 1024;
const MAX_FILE_SIZE = 10 * MB;
function createImageListener(callback) {
	return async function(event) {
		event.stopPropagation();
		event.preventDefault();

		if(!event.dataTransfer && event.originalEvent) {
			event.dataTransfer = event.originalEvent.dataTransfer;
		}
		
		const files = event.currentTarget.files || event.dataTransfer.files;

		for(let i = 0; i < files.length; i++) {
			const file = files[i];
			if(!file.type.match(/image.*/)) {
				alert("이미지가 아닌 파일이 포함되어있습니다.");
				return;
			} else if(file.size > MAX_FILE_SIZE) {
				alert((MAX_FILE_SIZE / MB) + "MB 이하의 이미지만 업로드 가능합니다."
					+ "\n" + file.name + " : " + ((file.size / MB).toFixed(2)) + "MB");
				return;
			} else if(!file.size) {
				alert('파일 정보를 불러오지 못하였습니다.\n잠시 후 다시 시도해 주세요.');
				return;
			}
		}

		await callback(files);
		event.target.value = '';
	}
}


const InputEventListener = (function() {
    return {
        on : function(eventTypes, inputElement, errorElement, limit, emptyText, confirmListener) {
            function error(text) {
                inputElement.classList.add("deny");
                errorElement.classList.remove("hidden");
                errorElement.textContent = text;
            }
        
            function removeStateClass() {
                inputElement.classList.remove("deny");
                inputElement.classList.remove("confirm");
            }

            function check(confirmClass) {
                var event = undefined;
                if(confirmClass instanceof Event) {
                    event = confirmClass;
                    confirmClass = undefined;
                } else if(typeof(confirmClass) != "string") confirmClass = undefined;
        
                var value = inputElement.value;
                var len = value.length;
        
                removeStateClass(inputElement);
                if(emptyText != undefined && len == 0) {
                    error(emptyText);
                } else if(limit && len > limit) {
                    inputElement.value = value.substring(0, limit-1);
                    error(limit+"자 이하여야 합니다.");
                } else {
                    var flag = (confirmListener ? confirmListener(event instanceof CustomEvent ? event : new Event("input")) : undefined);
                    if(!flag) {
                        errorElement.classList.add("hidden");
                        if(confirmClass) {
                            inputElement.classList.add(confirmClass);
                        }
                        return true;
                    } else error(flag);
                }
                return false;
            }

            if(!Array.isArray(eventTypes)) return false;
    
            var _inputElement = inputElement;
            //var newChecker = newListener.check.bind(newListener);
    
            eventTypes.forEach(function(type) {
                _inputElement.addEventListener(type, check);
            });
    
            check();
    
            return check;
        }
    }
}());





(function() {
    const dropdown = {
        element : undefined,
        visibility : false,
        toggle : function(){
            let remove, add;
    
            dropdown.visibility = !(dropdown.visibility === true);
            if(dropdown.visibility){
                remove = "fadeOut";
                add = "fadeIn";
            } else {
                remove = "fadeIn";
                add = "fadeOut";
            }
            
            let cList = dropdown.element.classList;
            cList.remove(remove);
            void dropdown.element.offsetWidth;
            cList.add(add);
        }
    };
    
    function toggleFeedback(open){
        var fbClassList = document.querySelector(".feedback-wrapper").classList;
        toggleFeedback.state = (typeof open === "boolean" ? !open : fbClassList.contains("open"));
        if(toggleFeedback.state) fbClassList.remove("open");
        else fbClassList.add("open");
    }
    
    var version_IE = "0"; 
    var ieLower = navigator.userAgent.match( /MSIE [0-9]{1,}/ ); 
    if ( ieLower != null ){  version_IE = ieLower.toString().replace( "MSIE " , "" );  } 
    
    const starLate = {
        starLateWrapper : undefined,
        overlapList : undefined,
        score : 0,
        set : function(score, keep){
            if(typeof score != "number") score = starLate.score;
    
            for(let i=0;i<5;i++){
                let check = (i + 1) * 2;
                starLate.overlapList[i].style.width = (score >= check) ? "100%" : ((score >= check - 1) ? "50%" : "0%");
            }
            
            if(keep === true) starLate.score = score;
        },
        find : function(x){
            let clientRect = starLate.starLateWrapper.getBoundingClientRect();
            let left = clientRect.left;
            let divider = clientRect.width / 10;
            let mlist = new Array();
            for(let i=0;i<10;i++) mlist.push(left + ( divider * i));
            
            for(let i = 9 ; i >= 0 ; i--){
                if(x >= mlist[i])
                    return i + 1;
            }
            return 0;
        },
        mouseEvent : function(event, keep){
            var x = 0;
            if (0 < version_IE && version_IE < 7) {// IE 6 이하 
                x = event.offsetX;
            } else if (event.pageX) {// pageX & pageY를 사용할 수 있는 브라우저일 경우 
                x = event.pageX;
            } else {
                x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            }
    
            starLate.set(starLate.find(x), keep);
        }
    }
    
    
    
    
    
    /* 초기화 함수 */
    function initCommon(){
        let dom = document;
    
        let gnbIcon = document.querySelector(".gnb-icon");
        if(gnbIcon) {
            dropdown.element = document.querySelector("#gnbDropdown");
            gnbIcon.addEventListener('click', dropdown.toggle);
        }
    
        let fbHead = dom.querySelector(".feedback-head");
        if(fbHead) {
            fbHead.addEventListener('click', toggleFeedback);
    
            let starLateWrapper = starLate.starLateWrapper = dom.querySelector(".feedback-star-late-wrapper");
            let fbtn = dom.querySelector(".feedback-send-btn");
            let ftextarea = dom.querySelector(".feedback-textarea");
            if(starLateWrapper && fbtn && ftextarea){
                // 별점 설정 event 등록
                starLateWrapper.addEventListener('mousemove', starLate.mouseEvent);
                starLateWrapper.addEventListener('mouseleave', starLate.set);
                starLateWrapper.addEventListener('click', function(event){starLate.mouseEvent(event, true)}, false);
                // feedback 별점 설정 및 내용 입력된 경우, 버튼 활성화
                function checkFeedback(){
                    // ftextarea.textLength = IE 미지원
                    if(starLate.score > 0 && ftextarea.value.length > 0){
                        fbtn.removeAttribute("disabled");
                    } else fbtn.setAttribute("disabled", '');
                };
                starLateWrapper.addEventListener('click', checkFeedback);
                ftextarea.addEventListener('input', checkFeedback);
                // feedback 전송 ajax
                fbtn.addEventListener('click', function(){
                    var param = "starlate="+starLate.score+"&content="+ftextarea.value;
                    majax.load(document.body, '/feedback', 'POST', param, 0, true)
						.then(function() {
							alert('전송되었습니다.');
							toggleFeedback(false);
							starLate.set(0, true);
							ftextarea.value = '';
						})
						.catch(function(xhr) {
							alert('전송에 실패하였습니다.' + (xhr ? '\n' + xhr.responseText : ''));
						});
                });
                starLate.overlapList = starLateWrapper.querySelectorAll(".feedback-star-late-overlap");
            }
            // starlate와 내부 내용이 있는지 확인 후, btn의 disabled 속성에 false 주고, 내용 전달 ajax 만들것
        }
    
        // IE 인 경우, confirm 및 sticker 추가
        if (checkIE()) {
            const chromeLink = "https://www.google.co.kr/chrome/?brand=FKPE&gclid=Cj0KCQjw9YWDBhDyARIsADt6sGbk4jbKwDp-f8jomb1TPPx0DWuPacxkew46ruCwhiD9MEVmGsa4MVcaAvudEALw_wcB&gclsrc=aw.ds";
    
            var informContainer = document.createElement("article");
            informContainer.className = "inform-container";
    
            var informTitle = document.createElement("h1");
            informTitle.className = "inform-title";
            informTitle.textContent = "브라우저를 업데이트 해주세요!";
            informContainer.appendChild(informTitle);
    
            var informDesc = document.createElement("h5");
            informDesc.className = "inform-desc";
            informDesc.innerHTML = '원활한 자유광장 사용을 위해 <a href=' + chromeLink + ' target="_blank">크롬 브라우저</a>를 이용해주세요.';
            informContainer.appendChild(informDesc);
    
            var informBody = document.createElement("div");
            informBody.className = "inform-body";
            informContainer.appendChild(informBody);
    
            var informImg = document.createElement("img");
            informImg.className = "inform-img";
            informImg.src = location.getResource("img/chrome-logo.png");
            informImg.addEventListener('click', function() {
                var child = window.open(chromeLink, "_blank");
                child.focus();
            });
            informBody.appendChild(informImg);
    
            var informBtn = document.createElement("button");
            informBtn.className = "inform-btn";
            informBtn.type = "button";
            informBtn.textContent = "그냥 볼래요";
            informBtn.addEventListener('click', function() {
                informContainer.parentElement.removeChild(informContainer);
            });
            informContainer.appendChild(informBtn);
    
            document.body.appendChild(informContainer);
            if(confirm("자유광장은 Internet Explorer 이용시\n원활하게 작동하지 않을 수 있습니다.\nMicrosoft Edge로 보시겠습니까?")) {
                window.location = "microsoft-edge:" + window.location.href;
            }
        }
    }
    window.addEventListener('DOMContentLoaded', initCommon);
}());


FormData.prototype.toString = function() {
	var data = "";
	var flag = false;
	for(let item of this.entries()) {
		if(item[1].length < 1) continue;
		if(flag) data += "&";
		data += (item[0] + "=" + encodeURIComponent(item[1]));
		flag = true;
	}
	return data;
}