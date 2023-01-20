(function() {
    const stepList = document.querySelectorAll(".event-new-step-box");

    stepList.active = function (index) {
        var len = stepList.length;
        
        if(index < 0 || index >= len) return false;

        for(var i = 0, a = index > 2 ? 3 : 0; i < len; i++) {
            if((i >= a || i == 0) && i <= index) stepList[i].className = "event-new-step-box accent";
            else stepList[i].className = "event-new-step-box";
        }
        stepList[index].classList.add("current");
    }

    function replaceBody(url, pushState, eventManagerFunc){
        var targetSelector = ".event-new-body";
        majax.replaceInnerHTML(url, document.querySelector(targetSelector), targetSelector, pushState, eventManagerFunc,
        function() {
            alert('잘못된 접근입니다.');
            location.href = "/";
        });
    }

    const hostTitle = document.getElementsByClassName("preview-title");
    const hostDesc = document.getElementsByClassName("preview-desc");
    const hostItemWrapper = document.getElementsByClassName("preview-list-wrapper");

    function setHost(host) {
        try{
            hostTitle[0].textContent = host.name;
            hostDesc[0].textContent = host.introduceSimple;
            clearHostItem();
            for(var i = 0; i < host.members.length; i++){
                addHostItem(host.members[i]);
            }
        } catch(err) {
            location.href = '/event/new';
        }
    }

    function addHostItem(itemText) {
        var newItem = document.createElement("button");
        newItem.className = "preview-list-item";
        newItem.textContent = itemText;
        hostItemWrapper[0].appendChild(newItem);
    };

    function clearHostItem() {
        while(hostItemWrapper[0].hasChildNodes()) {
            hostItemWrapper[0].removeChild(hostItemWrapper[0].firstChild);
        }
    };

    var eventManager = (function() {
        return {
            /***** select-host *****/
            selectHost: function() {
                const nextButton = document.querySelector(".confirm-btn");
                const nextButton2 = document.querySelector(".confirm-btn.support");
                
                document.querySelector(".selectable-add-container").addEventListener('click', function () {
                    replaceBody('/event/new/organization', true, eventManager.host);
                });
                
                nextButton.addEventListener('click', function(){
                    replaceBody('/event/new/select-type', true, eventManager.type);
                });
                nextButton2.addEventListener('click', function() {
                    replaceBody('/event/new/support/info', true, eventManager.info);
                });

                const hostList = document.querySelectorAll(".selectable-item-container");
                const hostContainer = document.querySelector(".event-new-host-container");
                const editButton = hostContainer.querySelector(".preview-btn[name='edit']");
                const openButton = hostContainer.querySelector(".preview-btn[name='open']");
                
                editButton.addEventListener('click', function() {
                    replaceBody('/event/new/organization/'+document.selectedHost.hostID, true, eventManager.host);
                });

                openButton.addEventListener('click', function() {
                    window.open('/host/'+document.selectedHost.hostID, '_blank');
                });

                function hostClickEvent(e) {
                    var target = e.currentTarget;
                    majax.load(document.body, "/host?type=info&id="+target.dataset.id, "GET", undefined, undefined, true).
                        then(function(xhr) {
                            var json = JSON.parse(xhr.responseText);
                        
                            hostContainer.style.display = "block";
                            nextButton.disabled = false;
                            nextButton2.disabled = false;
                            for(var i = 0; i < hostList.length; i++){
                                if(target.isSameNode(hostList[i])) hostList[i].setAttribute("select", '');
                                else hostList[i].removeAttribute("select");
                            }
    
                            setHost(json);
                            document.selectedHost = json;
                        }).catch(function(xhr) {
                            alert("호스트 정보를 가져오는데 실패하였습니다.\n" + xhr ? xhr.responseText : "");
                        });
                }
                
                for(var i = 0; i < hostList.length; i++){
                    hostList[i].addEventListener('click', hostClickEvent);
                }
            },
            /***** select-type *****/
            type: function() {
                stepList.active(1);

                const nextButton = document.querySelector(".confirm-btn");
                nextButton.addEventListener('click', function() {
                    replaceBody('/event/new/info', true, eventManager.info);
                });

                function typeSelectEvent(e) {
                    var target = e.currentTarget;
                    for(var i = 0; i < typeList.length; i++){
                        var elem = typeList[i];
                        if(target.isSameNode(elem)) elem.setAttribute("select", '');
                        else elem.removeAttribute("select");
                    }
                    document.selectedType = target.dataset.type;
                }
                
                const typeList = document.querySelectorAll(".selectable-item-container");
                
                for(var i = 0; i < typeList.length; i++){
                    typeList[i].addEventListener('click', typeSelectEvent);
                }
                typeList[0].dispatchEvent(new Event("click"));

                const checkBox = document.querySelector(".event-new-chkbox");
                checkBox.addEventListener('change', function() {
                    nextButton.disabled = !checkBox.checked;
                });
            },
            /***** info *****/
            info: function() {
                if(location.pathname == '/event/new/support/info') {
                    stepList.active(5);
                    loadJs(location.getResource("js/support/event/support_info.js"));
                } else {
					if(!document.selectedType) {
						replaceBody('/event/new', false, eventManager.selectHost);
						return;
					}
                    stepList.active(2);
                    loadJs(location.getResource("js/ls/event/event_info.js"));
                }
            },
            /***** host *****/
            host: function() {
                // 수정 페이지로 진입시 기본값 초기화
                const filterNameElem = document.querySelector("input[name='fname']");
                var filterName = undefined;
                if(filterNameElem) filterName = filterNameElem.value;
                const filterIDElem = document.querySelector("input[name='fid']");
                var filterID = undefined;
                if(filterIDElem) filterID = filterIDElem.value;
                const formMethodElem = document.querySelector("input[name='method']");
                var formMethod = undefined;
                if(formMethodElem) formMethod = formMethodElem.value;
                const formIDElem = document.querySelector("input[name='id']");
                var formID = undefined;
                if(formIDElem) formID = formIDElem.value;


                /* host 페이지 설정 */
                const nameInput = document.querySelector(".input-field[name='name']");
                const nameError = nameInput.nextElementSibling;

                var nameChecker = InputEventListener.on(['input', 'focus'], nameInput, nameError, 40, "호스트 이름을 입력해주세요.");
                var nameChecking = false;
				function nameAjaxCallback(xhr) {
					nameChecking = false;
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
						nameChecking = true;
                        majax.do("/host?type=name&name="+nameInput.value, "GET", undefined, nameAjaxCallback, nameAjaxCallback);
                    }
                });

                const introInput = document.querySelector(".input-field[name='introduceSimple']");
                const introError = introInput.nextElementSibling;

                var introduceSimpleChecker = InputEventListener.on(['input', 'focus'], introInput, introError, 255);
                introInput.addEventListener('focusout', function() { introduceSimpleChecker("confirm"); });

                /*** host.js = new.js ***/
                const memberInput = document.querySelector(".input-field[name='member']");
                const memberBtn = document.querySelector(".preview-btn[name='add']");
                const memberError = memberBtn.nextElementSibling;
                const memberListWrapper = document.querySelector("#memberList");
                memberListWrapper.removeMember = function(e) {
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
                            newMemberElem.addEventListener('click', memberListWrapper.removeMember);
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
                /*** host.js = new.js ***/
                
                document.querySelector(".preview-btn[name='cancel']").addEventListener('click', function() {
                    replaceBody('/event/new', true, eventManager.selectHost);
                });

                document.querySelector(".form-button").addEventListener('click', function() {
                    function addHostCallback(xhr) {
                        if(xhr && xhr.status == 200) replaceBody('/event/new', true, eventManager.selectHost);
                        else alert('호스트 추가에 실패하였습니다.\n' + xhr ? xhr.responseText : "");
                    }

                    var param = "name="+nameInput.value
                                +"&s_intro="+introInput.value;
                    var memberList = memberListWrapper.children;
                    for(var i = 0; i < memberList.length; i++){
                        param += ("&member=" + memberList[i].textContent);
                    }
                    if(formID) param += "&hid=" + formID;

					function requestPostHost() {
						if(nameError.className == 'error-text') {
							alert('중복된 이름의 호스트가 이미 존재 합니다.');
						} else {
							majax.load(document.body, '/host', formMethod ? formMethod : "POST", param, undefined, true)
								.then(addHostCallback)
								.catch(addHostCallback);
						}
					}

					if(majax.isRunning && nameChecking) {
						doLoading(document.body, true);

						var intervalId = setInterval(function() {
							if(!nameChecking) {
								stopLoading(document.body);
								clearInterval(intervalId);
								requestPostHost();
							}
						}, 100);
					} else requestPostHost();
                });
            },
            current: function() {
                switch(location.pathname){
                case "/event/new":
                    eventManager.selectHost();
                    break;
                case "/event/new/select-type":
                    eventManager.type();
                    break;
                case "/event/new/info":
                    eventManager.info();
                    break;
                case "/event/new/support/select-type":
                    eventManager.type();
                    stepList.active(4);
                    break;
                default:
                    if(location.pathname.indexOf("/event/new/organization") >= 0) {
                        eventManager.host();
                    }
                }
            }
        }
    }());

    window.addEventListener('popstate', function(){
        replaceBody(location.href, false, eventManager.current);
    });

    window.addEventListener('DOMContentLoaded', function(){
        eventManager.current();
    });
})();