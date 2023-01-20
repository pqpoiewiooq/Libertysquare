<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<article class="attendee-tool-box">
    <div class="attendee-counter">출석</div>
    <input class="attendee-tool-box attendee-search-input" placeholder="이름, 전화번호, Ticket ID 중 하나 입력"/>
    <div class="attendee-menu-row">
        <a href="https://ls2020.cafe24.com/libertysquare-qr-manual.pdf" class="attendee-help-link">
            <svg viewBox="0 0 512 512" height="0.875em" width="0.875em" aria-hidden="true" focusable="false" fill="currentColor" class="valign-down"><path fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z"></path></svg>
            참가 처리 매뉴얼
        </a>
        <div class="attendee-button-container">
            <!--
            <a class="attendee-button" href="/events/1583/attendee-list/email">
                <svg viewBox="0 0 24 24" height="1em" width="1em" aria-hidden="true" focusable="false" fill="currentColor" class="valign-down" style="margin-right: 5px;"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></svg>
                전체 이메일 발송
            </a>
            -->
            <a class="attendee-button" href="/manage/download-center/<%= eventID %>">
                <svg viewBox="0 0 24 24" height="1em" width="1em" aria-hidden="true" focusable="false" fill="currentColor" class="valign-down" style="margin-right: 5px;"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></svg>
                다운로드 센터
            </a>
        </div>
    </div>
</article>

<div class="attendee-panel-container">
    <div class="attendee-panel">참가 확정됨</div>
    <div class="attendee-panel">승인 대기자</div>
</div>

<article class="attendee-check-container"></article>

<script>
(function() {
    function hasAttendedSwitch(table) {
        var attendedSwitch = table.querySelector(".attendee-switch.on");
        return attendedSwitch ? true : false;
    }

    function createAttendBox(dataset, flag) {
        var box = document.createElement("div");
        box.className = "attendee-tool-box";

        for(var map of dataset) {
            var div = document.createElement("div");
            box.append(div);

            div.append(createAttendUserRow(map.user));
            for(var paymentDataList of map.payment) {
                var table = createAttendTicketTable(paymentDataList, map.ticket, flag);
                if(hasAttendedSwitch(table)) {
                    table.refundButton.refundable = false;
                    table.refundButton.textContent = "환불 불가능";
                }
                div.append(table);
            }
        }

        return box;
    }

    function parseNumber(str) {
        const regNumber = /[^0-9]/g;
        return str ? str.replace(regNumber, "") : 0;
    }

    function createAttendUserRow(user) {
        var row = document.createElement("div");
        row.className = "attendee-user-info-row";

        var icon = document.createElement("div");
        icon.className = "attendee-user-info-icon";
        //icon.textContent = user.name.slice(user.name.length - 2);;
        icon.style.background = "url(" + user.profilePath + ") center center / cover no-repeat";
        row.append(icon);

        var name = document.createElement("div");
        name.innerHTML = user.nickname;
        row.append(name);

        var phone = document.createElement("div");
        phone.innerHTML = user.id;
        row.append(phone);

        return row;
    }

    function createAttendTicketTable(list, ticket, flag) {
        var table = document.createElement("div");
        table.className = "attendee-tool-box ticket";

        // label
        var labelRow = document.createElement("div");
        labelRow.className = "attendee-table-row";
        table.append(labelRow);

        var label_id = document.createElement("div");
        label_id.className = "attendee-table-label";
        label_id.textContent = "Ticket ID";
        labelRow.append(label_id);

        var label_name = document.createElement("div");
        label_name.className = "attendee-table-label";
        label_name.textContent = "티켓 종류";
        labelRow.append(label_name);

        var label_price = document.createElement("div");
        label_price.className = "attendee-table-label";
        label_price.textContent = "티켓 가격";
        labelRow.append(label_price);

        if(flag) {
            var label_switch = document.createElement("div");
            label_switch.className = "attendee-table-label attendee-table-right";
            label_switch.textContent = "출석체크";
            labelRow.append(label_switch);
        }

        // ticket info
        // for문으로 createAttendInfoTableRow를 이용해서 추가
        var totalPrice = 0;
        for(var attendant of list) {
            var infoTableRow = createAttendInfoTableRow(attendant, ticket, flag);
            totalPrice += infoTableRow.ticketPrice;
            table.append(infoTableRow);
        }

        // payment row
        var paymentRow = document.createElement("div");
        paymentRow.className = "attendee-payment-row";
        paymentRow.textContent = "티켓금액\u00A0\u00A0";
        table.append(paymentRow);

        var price = document.createElement("span");
        price.className = "attendee-purchased-price";
        price.textContent = currency(totalPrice);
        paymentRow.append(price);

        var refundButton = document.createElement("span");
        refundButton.className = "attendee-refund-button";
        refundButton.refundable = true;
        refundButton.addEventListener('click', function(event) {
            if(refundButton.refundable) {
                if(confirm('환불 처리 하겠습니까?\n함께 구매한 티켓들이 모두 환불됩니다.')) {
                    majax.load(document.body, "/payment", "DELETE", "paymentID=" + list[0].paymentID, undefined, true)
                        .then(function() {
                            alert("환불 처리되었습니다.");

                            var container = table.parentElement;
                            var length = container.children.length;
                            if(length <= 2) {
                                container.parentElement.removeChild(container);
                            } else {
                                container.removeChild(table);
                            }
                        }).catch(function(xhr) {
                            alert("환불에 실패하였습니다.\n" + xhr.responseText);
                        });
                }
            } else {
                event.preventDefault();
            }
        });
        refundButton.textContent = "환불";
        table.refundButton = refundButton;
        paymentRow.append(refundButton);

        return table;
    }

    function createAttendInfoTableRow(data, ticket, flag) {
        var row = document.createElement("div");
        row.className = "attendee-table-row";

        var id = document.createElement("div");
        id.className = "attendee-table-text";
        id.innerHTML = data.id;
        row.append(id);

        var name = document.createElement("div");
        name.className = "attendee-table-text";
        name.textContent = ticket.name;
        row.append(name);

        var price = document.createElement("div");
        price.className = "attendee-table-text";
        price.textContent = currency(ticket.price);
        row.ticketPrice = ticket.price;
        row.append(price);

        if(flag) {
            var switchWrapper = document.createElement("div");
            switchWrapper.className = "attendee-table-right";
            row.append(switchWrapper);

            var switchElem = document.createElement("div");
            switchElem.className = data.state == "ATTEND" ? "attendee-switch on" : "attendee-switch";
            switchElem.attendantID = data.id;
            switchElem.attendantState = data.state;
            switchElem.parentRow = row;
            switchElem.addEventListener('click', function(event) {
                requestStatePatch(event.currentTarget);
            });
            switchWrapper.append(switchElem);

            var switch_bg = document.createElement("div");
            switch_bg.className = "attendee-switch-bg";
            switchElem.append(switch_bg);

            var switch_check = document.createElement("div");
            switch_check.className = "attendee-switch-check";
            switch_check.innerHTML = '<svg viewBox="-2 -5 17 21" height="100%" width="100%"><path d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0" fill="#fff" fill-rule="evenodd"></path></svg>';
            switch_bg.append(switch_check);

            var switch_cross = document.createElement("div");
            switch_cross.className = "attendee-switch-cross";
            switch_cross.innerHTML = '<svg viewBox="-2 -5 14 20" height="100%" width="100%"><path d="M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12" fill="#fff" fill-rule="evenodd"></path></svg>';
            switch_bg.append(switch_cross);

            var switch_handle = document.createElement("div");
            switch_handle.className = "attendee-switch-handle";
            switchElem.append(switch_handle);
        } else {
            var buttonWrapper = document.createElement("div");
            buttonWrapper.className = "attendee-table-text attendee-table-right";
            row.append(buttonWrapper);

            var labelButton = document.createElement("button");
            labelButton.type = "button";
            labelButton.className = "form-button";
            labelButton.attendantID = data.id;
            labelButton.parentRow = row;
            labelButton.textContent = "승인";//승인 및 결제
            labelButton.addEventListener('click', function(event) {
                var target = event.currentTarget;
                event.preventDefault();
                var param = "id=" + target.attendantID + "&state=APPROVE";
                majax.do("/attendant", "PATCH", param, function(xhr) {
                    var parentRow = target.parentRow;
                    var parent = parentRow.parentElement;
                    var length = parent.children.length;
                    parent.removeChild(parentRow);
                    if(length <= 3) {
                        var container = parent.parentElement;
                        length = container.children.length;
                        if(length <= 2) {
                            container.parentElement.removeChild(container);
                        }
                    }
                    
                    plusCounter();
                }, function(xhr) {
                    alert("승인에 실패하였습니다.\n" + xhr.responseText);
                    location.reload();
                });
            });
            buttonWrapper.append(labelButton);
        }

        return row;
    }

    var gnbList = document.querySelectorAll(".manage-gnb-link");
    gnbList[0].setAttribute('active', '');

    var container = document.querySelector(".attendee-check-container");
    function replaceContainer(elem) {
        while(container.hasChildNodes()) {
            container.removeChild(container.firstChild);
        }
        container.append(elem);
    }

    var apiParam = "w=list&eventID=<%= eventID %>";

    var nothinkAttendantElement = document.createElement("div");
    nothinkAttendantElement.className = "attendee-nothink-text";
    nothinkAttendantElement.textContent = "참가 확정된 유저가 표시됩니다.";

    var searchInput = document.querySelector(".attendee-search-input");
    var searchTimer = 0;
    const delay = 250;


    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(createTable, delay);
    });

    var jsonData;
    var isAttendantList;
    function contentLoadCallback(xhr) {
        if(xhr) {
            jsonData = xhr.responseText;

            createTable();
        }
    }

    function loadFailCallback(xhr) {
        if(xhr.status != 404) {
            alert("정보를 불러오는데 실패하였습니다.\n" + (xhr instanceof XMLHttpRequest ? xhr.responseText : xhr));
        }
    }

    function accent(str, keyword) {
        // 정규식 이용하는 방법도 생각해봤으나, 유저가 * 등 특수문자나 정규식 입력시 잘못된 결과가 나올 수 있어서 일단 제외. 물론 각 특수문자 체크해서 앞에 \등 붙여서 체크하는 방법도 생각중
        if(str.includes(keyword)) {
            return str.split(keyword).join("<strong>" + keyword + "</strong>");
        }
    }

    function createTable() {
        if(jsonData) {
            var dataset = JSON.parse(jsonData);
            if(dataset.length > 0) {
                var keyword = searchInput.value;//이름, 전화번호, Ticket ID
                if(keyword) {
                    /*
                    for(var x = 0; x < dataset.length; x++) {
                        var map = dataset[x];
                        for(var y = 0; y < map.length; y++) {
                            var paymentDataList = map[y];
                            for(var z = 0; z < paymentDataList.length; z++) {
                                var attendant = paymentDataList[z];
                            }
                        }
                    }*/

                    for(var x = 0; x < dataset.length; x++) {
                        var map = dataset[x];
                        var aName = accent(map.user.name, keyword);
                        var aId = accent(map.user.id.toString(), keyword);
                        var flag = false;
                        if(aName) {
                            map.user.name = aName;
                            flag = true;
                        }
                        if(aId) {
                            map.user.id = aId;
                            flag = true;
                        }
                        for(var y = 0; y < map.payment.length; y++) {
                            var paymentDataList = map.payment[y];
                            for(var z = 0; z < paymentDataList.length; z++) {
                                var attendant = paymentDataList[z];
                                var aAttendant = accent(attendant.id.toString(), keyword);
                                if(aAttendant) {
                                    attendant.id = aAttendant;
                                } else if(!flag) {
                                    paymentDataList.splice(z, 1);
                                    z--;
                                }
                            }
                            if(paymentDataList.length < 1) {
                                map.payment.splice(y, 1);
                                y--;
                            }
                        }
                        if(map.payment.length < 1) {
                            dataset.splice(x, 1);
                            x--;
                        }
                    }
                }

                var attendBox = createAttendBox(dataset, isAttendantList);
                replaceContainer(attendBox);
                if(isAttendantList) updateCounter();
            }
        }
    }

    function loadAttendant() {
        panelList[0].classList.add("active");
        panelList[1].classList.remove("active");
        replaceContainer(nothinkAttendantElement);
        isAttendantList = true;
        majax.load(container, "/attendant", "GET", apiParam + "&type=APPROVE")
            .then(contentLoadCallback)
            .catch(loadFailCallback);
    }

    var nothinkWaitElement = document.createElement("div");
    nothinkWaitElement.className = "attendee-nothink-text";
    nothinkWaitElement.textContent = "주최자 선별 티켓을 구입한 유저가 표시됩니다.";
    function loadWait() {
        panelList[0].classList.remove("active");
        panelList[1].classList.add("active");
        replaceContainer(nothinkWaitElement);
        isAttendantList = false;
        majax.load(container, "/attendant", "GET", apiParam + "&type=WAIT")
            .then(contentLoadCallback)
            .catch(loadFailCallback);
    }

    var counter = document.querySelector(".attendee-counter");
    counter.numerator = 0;
    counter.denominator = 0;
    var switchCollection = document.getElementsByClassName("attendee-switch");
    function updateCounter(numerator, denominator) {
        if(numerator == undefined && denominator == undefined) {
            numerator = 0;
            denominator = switchCollection.length;
            for(var i = 0; i < denominator; i++) {
                if(switchCollection[i].attendantState == "ATTEND") numerator++;
            }
        }
        counter.numerator = numerator;
        counter.denominator = denominator;
        counter.textContent = "출석 " + numerator + "/" + denominator;
    }

    function plusCounter() {
        updateCounter(counter.numerator, counter.denominator + 1);
    }

    function requestStatePatch(switchElement) {
        var state, flag;
        if(switchElement.attendantState == "APPROVE") {
            state = "ATTEND";
            flag = true;
        } else {
            state = "APPROVE";
            flag = false;
        }
        var param = "id=" + switchElement.attendantID + "&state=" + state;
        majax.do("/attendant", "PATCH", param, function(xhr) {
            switchElement.attendantState = state;
            if(flag) {
                switchElement.classList.add("on");
            } else {
                switchElement.classList.remove("on");
            }

            var parent = switchElement.parentRow.parentElement;
            if(hasAttendedSwitch(parent)) {
                parent.refundButton.refundable = false;
                parent.refundButton.textContent = "환불 불가능";
            } else {
                parent.refundButton.refundable = true;
                parent.refundButton.textContent = "환불";
            }
            updateCounter();
        }, function(xhr) {
            alert("출석 반영에 실패하였습니다.\n" + xhr.responseText);
            //location.reload();
        });
    }

    var panelList = document.querySelectorAll(".attendee-panel");
    panelList[0].addEventListener('click', loadAttendant);
    panelList[1].addEventListener('click', loadWait);

    <% if(event.getType() == Event.Type.OUTSIDE) { %>
    nothinkAttendantElement.textContent = "외부 행사로 등록되었으므로 제공되지 않는 기능입니다.";
    nothinkWaitElement.textContent = "외부 행사로 등록되었으므로 제공되지 않는 기능입니다.";
    <% } %>

    window.addEventListener('load', loadAttendant);
})();
</script>