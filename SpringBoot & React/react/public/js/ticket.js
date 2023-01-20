(function() {
    "use strict";

    // prototype element
    var _error = document.createElement("div");
    _error.className = "error-text";

    function parseNumber(str) {
        const regNumber = /[^0-9]/g;
        return str ? parseInt(str.replace(regNumber, "")) : 0;
    }

    function newItem(itemTitle, itemDesc) {
        var wrapper = document.createElement("div");
        wrapper.className = "slot-wrapper";
        
        var head = document.createElement("div");
        head.className = "slot-head";
        var title = document.createElement("div");
        title.className = "slot-title ticket";
        title.textContent = itemTitle;

        var body = document.createElement("div");
        body.className = "slot-body";

        wrapper.appendChild(head);
        wrapper._head = head;
        wrapper.appendChild(body);
        wrapper._body = body;

        head.appendChild(title);
        head._title = title;
        wrapper._title = title;

        if(itemDesc) {
            var desc = document.createElement("div");
            desc.className = "slot-desc ticket";
            desc.textContent = itemDesc;

            head._desc = desc;
            wrapper._desc = desc;
            head.appendChild(desc);
        }

        return wrapper;
    }

    function numberFilter(event) {
        if(!(event.key >= 0 && event.key <= 9)) {
            event.preventDefault();
        }
    }

    function numberSlider(value, limit) {
        value = value.replace(/[^0-9]/g,'');
        if(value.length > limit) value = value.substring(0, limit);
        //value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function currency(number) {
        return "₩ " + number;
    }

    function currencyEventListener(event) {
        var target = event.currentTarget;
        target.value = currency(target.value);
    }

    function newInputItem(config) {
        var item = newItem(config["title"], config["desc"]);

        var input = document.createElement("input");
        input.className = "input-field";

        var type = config["type"];
        input.type = type ? type : "text";
        var value = config["value"];
        if(value) input.value = value;
        var disabled = config["disabled"];
        var limit = config["limit"];

        item._body.appendChild(input);
        item._input = input;
        if(disabled === true) {
            input.disabled = disabled;
            item._checker = function() { return true; };
        } else {
            var min = config["min"];
            if(min) input.min = min;
            var max = config["max"];
            if(max) input.max = max;
            var placeholder = config["placeholder"];
            if(placeholder) input.placeholder = placeholder;

            if(min || max) {
                const numberLimit = limit;
                limit = undefined;
                input.addEventListener('keypress', numberFilter);
                input.addEventListener('input', function() {
                    input.value = numberSlider(input.value, numberLimit);
                }, true);
            }

            var error = _error.cloneNode();
            item._body.appendChild(error);
            item._error = error;

            item._checker = InputEventListener.on(['input', 'focus'], input, error, limit, config["emptyText"], config["onConfirm"]);
        }

        return item;
    }

    function newDateTimeItem(itemTitle) {
        var wrapper = document.createElement("div");
        var title = document.createElement("div");
        var inner = document.createElement("div");
        var date = document.createElement("input");
        var time = document.createElement("div");

        wrapper.className = "sub-slot-wrapper";
        title.textContent = itemTitle;
        title.className = "sub-slot-title";
        inner.className = "flex-wrapper";
        date.setAttribute('readonly', '');
        date.className = time.className = "input-field datetime-picker-column";

        wrapper.appendChild(title);
        wrapper.appendChild(inner);
        inner.appendChild(date);
        inner.appendChild(time);

        wrapper._title = title;
        wrapper._inner = inner;
        wrapper._date = inner._date = date;
        wrapper._time = inner._time = time;

        wrapper.getDateValue = function() {
            return date.value + " " + time.value;
        }

        return wrapper;
    }

    function Ticket() {
    }

    Ticket.create = function(element, child, data) {
        const editable = data == undefined;

        // container
        var container = document.createElement("div");
        container.className = "preview-wrapper ticket";
        var ticket = container._ticket = {};
        ticket.container = container;
        ticket.destroyListener = undefined;
        if(!editable) ticket.ticketID = data.id;

        // type
        var type = newItem("티켓 유형", editable ? undefined : "티켓 유형은 수정할 수 없습니다.");
        type._body.classList.add("flex-wrapper");
        type.classList.add("full");
        
        var fcfs = document.createElement("div");
        var fcfsHead = document.createElement("div");
        var fcfsIcon = document.createElement("img");
        var fcfsBody = document.createElement("div");
        var fcfsTitle = document.createElement("div");
        var fcfsDesc = document.createElement("div");

        fcfs.className = "selectable-item-container ticket";
        fcfsHead.className = "selectable-item-icon";
        fcfsTitle.className = "selectable-item-ticket-text";
        fcfsDesc.className = "selectable-item-ticket-text small";

        var selection = fcfs.cloneNode();
        var selectionHead = fcfsHead.cloneNode();
        var selectionIcon = fcfsIcon.cloneNode();
        var selectionBody = fcfsBody.cloneNode();
        var selectionTitle = fcfsTitle.cloneNode();
        var selectionDesc = fcfsDesc.cloneNode();

        fcfs.appendChild(fcfsHead);
        fcfs.appendChild(fcfsBody);
        fcfsHead.appendChild(fcfsIcon);
        fcfsBody.appendChild(fcfsTitle);
        fcfsBody.appendChild(fcfsDesc);
        
        selection.appendChild(selectionHead);
        selection.appendChild(selectionBody);
        selectionHead.appendChild(selectionIcon);
        selectionBody.appendChild(selectionTitle);
        selectionBody.appendChild(selectionDesc);

        fcfsIcon.src = "/icon/ic_ticket_fcfs.svg";
        fcfsIcon.alt = "선착순 아이콘";
        fcfsTitle.textContent = "선착순 방식";
        fcfsDesc.textContent = "신청한 순서대로 결제됩니다.";

        selectionIcon.src = "/icon/ic_ticket_selection.svg";
        selectionIcon.alt = "선별 아이콘";
        selectionTitle.textContent = "주최자 선별 방식";
        selectionDesc.textContent = "신청을 받은 후 주최자가 선택한 신청자만 결제가 진행되고 참가자격이 주어집니다.";

        type._body.appendChild(fcfs);
        type._body.appendChild(selection);

        fcfs.typeValue = "FCFS";
        selection.typeValue = "SELECTION";
        if(editable) {
            function selectType(event) {
                var target = event.currentTarget;
                if(target.isSameNode(fcfs)) {
                    fcfs.setAttribute('select', '');
                    selection.removeAttribute('select');
                } else {
                    selection.setAttribute('select', '');
                    fcfs.removeAttribute('select');
                }
                ticket.selectedType = target;
            }
            fcfs.addEventListener('click', selectType);
            selection.addEventListener('click', selectType);
            fcfs.dispatchEvent(new Event('click'));
        } else {
            if(data.type == "FCFS") {
                ticket.selectType = fcfs;
                fcfs.setAttribute('select', '');
            } else {
                ticket.selectType = selection;
                selection.setAttribute('select', '');
            }
        }

        ticket.type = type;
        container.appendChild(type);

        // Name
        var nameOption = {
            title: "티켓 이름",
            desc: "한 번 설정한 이름은 수정할 수 없습니다.",
            placeholder: "일반 입장권",
            limit: 32,
            emptyText: "티켓 이름을 입력해 주세요."
        };
        if(!editable) {
            nameOption.desc ="티켓 이름은 수정할 수 없습니다.";
            nameOption.value = data.name;
            nameOption.disabled = true;
        }
        var name = newInputItem(nameOption);

        ticket.name = name;
        container.appendChild(name);

        // Description
        var desc = newInputItem({
            title: "티켓 설명",
            desc: "이 티켓에 대해 상세한 설명이 필요하다면 작성해주세요.",
            type: "text",
            placeholder: "무료 음료를 제공합니다",
            limit: 256,
            value: editable ? undefined : data.desc
        });

        ticket.desc = desc;
        container.appendChild(desc);

        // Price
        var priceOption = {
            title: "가격",
            desc: "구매자가 있는 경우 티켓 가격은 수정할 수 없습니다.",
            min: 0,
            max: 99999999,
            limit: 8,
            emptyText: "티켓 가격을 입력해 주세요. 무료 티켓은 0을 입력해 주세요."
        };
        var hasBuyer = false;
        if(!editable) {
            priceOption.value = currency(data.price);
            if(data.maxAmount == data.curAmount) {
                priceOption.desc = "아직 구매자가 없어 가격을 수정 할 수 있어요.";
            } else {
                priceOption.desc = "구매자가 있어 가격을 수정할 수 없어요.";
                priceOption.disabled = true;
                hasBuyer = true;
            }
        }
        var price = newInputItem(priceOption);

        price._input.addEventListener('input', function() {
            price._input.value = currency(price._input.value);
        });

        ticket.price = price;
        container.appendChild(price);

        // Amount
        var amountOption = {
            title: "티켓 수량",
            max: 999999,
            limit: 6,
            emptyText: "티켓 수량을 입력해 주세요."
        };
        if(editable) {
            amountOption.desc = "판매하고 싶은 최대 수량을 정해주세요.";
            amountOption.min = 0;
            amountOption.onConfirm = function(event) {
                if(!ticket.limit) return;
                if(!(event instanceof CustomEvent)) ticket.limit._input.dispatchEvent(new CustomEvent("input"));
                var a = parseNumber(ticket.amount._input.value);
                if(a < 1) {
                    return "티켓 수량은 1보다 작을 수 없습니다.";
                } else if(a < parseNumber(ticket.limit._input.value)) {
                    return "티켓 수량이 1인당 구매 가능 개수보다 적을 수 없습니다.";
                }
            };
        } else {
            var purchasedAmount = data.maxAmount - data.curAmount;
            amountOption.desc = "티켓 수량은 팔린 개수보다 적게 줄일 수 없습니다.\n(현재 판매 수량: " + purchasedAmount + "개)\n(남은 수량: " + data.curAmount + "개)";
            amountOption.min = purchasedAmount;
            amountOption.value = data.maxAmount;
            amountOption.onConfirm = function(event) {
                if(!ticket.limit) return;
                if(!(event instanceof CustomEvent)) ticket.limit._input.dispatchEvent(new CustomEvent("input"));
                var a = parseNumber(ticket.amount._input.value);
                if(a < 1) {
                    return "티켓 수량은 1보다 작을 수 없습니다.";
                } else if(a < purchasedAmount) {
                    return "티켓 수량은 팔린 개수보다 적게 줄일 수 없습니다.";
                } else if(a < parseNumber(ticket.limit._input.value)) {
                    return "티켓 수량이 1인당 구매 가능 개수보다 적을 수 없습니다.";
                }
            }
        }
        var amount = newInputItem(amountOption);

        ticket.amount = amount;
        container.appendChild(amount);

        // isHideRemaining
        var remaining = newItem("티켓 수량 숨김");
        var remainingCheckbox = document.createElement("input");
        remainingCheckbox.classList.add("event-new-chkbox");
        remainingCheckbox.type = "checkbox";
        if(!editable) {
            remainingCheckbox.checked = data.isHide;
        }
        remaining._body.appendChild(remainingCheckbox);

        ticket.remaining = remaining;
        container.appendChild(remaining);

        // Ticket Limit
        var limitOption = {
            title: "1인당 구매 가능 개수",
            desc: "유저 1명이 구입할 수 있는 최대 개수입니다. 온라인 행사의 경우, 1명의 유저는 한 장의 티켓만 구매 가능합니다.",
            min: 1,
            max: 999999,
            limit: 6,
            emptyText: "1인당 구매 가능 개수를 입력해 주세요.",
            onConfirm: function(event) {
                if(!ticket.limit) return;
                if(!(event instanceof CustomEvent)) ticket.amount._input.dispatchEvent(new CustomEvent("input"));
                var a = parseNumber(ticket.limit._input.value);
                if(a < 1) {
                    return "1인당 구매 가능 개수는 1보다 작을 수 없습니다.";
                } else if(parseNumber(ticket.amount._input.value) < a) {
                    return "1인당 구매 가능 개수가 티켓 수량보다 많을 수 없습니다.";
                }
            }
        };
        if(!editable) {
            limitOption.value = data.purchaseLimit;
        }
        var limit = newInputItem(limitOption);

        ticket.limit = limit;
        container.appendChild(limit);

        // Period
        var period = newItem("판매 기간", "티켓별로 판매기간을 조정할 수 있습니다.");

        var stpItem = newDateTimeItem("시작");
        var edpItem = newDateTimeItem("종료");

        var stpError = document.createElement("div");
        stpError.className = "error-text hidden";
        stpError.textContent = "시작 시간은 종료 시간보다 이전이어야 합니다.";
        stpItem.appendChild(stpError);
        
        var edpError = document.createElement("div");
        edpError.className = "error-text hidden";
        edpError.textContent = "행사 종료 후에는 티켓을 판매 할 수 없습니다.";
        edpItem.appendChild(edpError);

        period._body.appendChild(stpItem);
        period.start = period._body._start = stpItem;
        period._body.appendChild(edpItem);
        period.end = period._body._end = edpItem;
        edpItem.error = edpError;

        ticket.period = period;
        container.appendChild(period);

        // Refund Deadline
        var refund = newItem("환불 마감 날짜", "판매 종료일을 설정하면 환불 마감 날짜는 자동으로 이와 동일하게 조정되지만 호스트가 원하는 날짜로 변경할 수도 있습니다.");
        var refundItem = newDateTimeItem("환불 마감일");
        var refundError = document.createElement("div");
        refundError.className = "error-text hidden";
        refundError.textContent = "환불 마감 시간은 티켓 판매 종료 시간보다 이전이어야 합니다.";

        refund._body.appendChild(refundItem);
        refund._body.appendChild(refundError);
        
        ticket.refund = refund;
        container.appendChild(refund);

        // Button
        var buttonContainer = document.createElement("div");
        buttonContainer.className = "event-new-btn-container right";
        buttonContainer.style.margin = "0";

        var deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "preview-btn normal ticket";
        deleteButton.innerHTML = '<svg viewBox="0 0 448 512" height="1em" width="1em" aria-hidden="true" focusable="false" fill="currentColor" class="valign-down"><path fill="currentColor" d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"></path></svg>'
                                + " 삭제";

        // Fade In/Out Animation Control
        ticket.destroy = function() {
            if(ticket.destroyListener && !ticket.destroyListener()) {
                return;
            }

            container.addEventListener('transitionend', function() {
                dateTimeScript.items.forEach(function(i){
                    i._date._flatpickr.destroy();
                    i._time._dropdown.destroy();
                });
                container.parentElement.removeChild(container);
            });
            container.style.maxHeight = "0px";
        }
        function animationRemover() {
            container.removeEventListener('animationend', animationRemover);
            //container.style.maxHeight = container.offsetHeight + "px";
        }
        container.addEventListener('animationend', animationRemover);

        deleteButton.addEventListener('click', ticket.destroy);
        buttonContainer.appendChild(deleteButton);

        ticket.buttonContainer = buttonContainer;
        container.appendChild(buttonContainer);

        // Insert Ticket
        element.insertBefore(container, child);

        // flatpickr.js & dropdown.js load
        flatpickr.localize(flatpickr.l10ns.ko);
        function dateTimeScript(item, dateString, minDateString, maxDateString) {
            var date, time, min, max;
            if(dateString) {
                dateString = dateString.replace(/\.[0-9]/g, '');
                date = new Date(dateString.replace(/-/g, '/'));
                var hour = date.getHours();
                hour = hour >= 10 ? hour : '0' + hour;
                var minute = date.getMinutes();
                minute = minute >= 10 ? minute : '0' + minute;
                time = hour + ":" + minute;
                if(minDateString) {
                    minDateString = minDateString.replace(/\.[0-9]/g, '');
                    min = new Date(minDateString.replace(/-/g, '/'));
                } else {
                    min = date;
                }
                if(maxDateString) {
                    maxDateString = maxDateString.replace(/\.[0-9]/g, '');
                    max = new Date(maxDateString.replace(/-/g, '/'));
                }
            } else {
                min = date = new Date();
            }

            item._date.flatpickr({local: 'ko', minDate: min, maxDate: max, defaultDate: date});// edpItem나 refund의 경우에는 mindate가 최소 현재날짜로 되어야함.
            item._time.dropdown({scroll: 5});
            if(time) item._time._dropdown.selectValue(time);
            dateTimeScript.items.push(item);
        }
        dateTimeScript.items = new Array();
        if(editable) {
            dateTimeScript(stpItem);
            dateTimeScript(edpItem);
            dateTimeScript(refundItem);
        } else {
            dateTimeScript(stpItem, data.startDate);
            dateTimeScript(edpItem, data.endDate, data.startDate);
            dateTimeScript(refundItem, data.refundDeadline, data.startDate, data.endDate);
        }

        var dateChecker = flatpickrAutoSetter(stpItem._date, edpItem._date);
        var timeChecker = dropdownAutoSetter(stpItem._time, edpItem._time, stpError);
        
        edpItem._date.addEventListener('change', function() {
            var date = edpItem._date._flatpickr.selectedDates[0];
            var changedElem = refundItem._date;
            changedElem._flatpickr.setDate(date);
            changedElem.dispatchEvent(new Event("change"));
        });
        edpItem._time.addEventListener('optionchange', function(event) {
            refundItem._time._dropdown.select(event.detail.target._index);
        });

        var refundChecker = function() {
            var ed = edpItem._date._flatpickr.selectedDates[0];
            var edr = refundItem._date._flatpickr.selectedDates[0];
            if(ed < edr) {
                refundError.classList.remove("hidden");
                return false;
            } else if(ed.getTime() == edr.getTime()) {// date객체는 등호 연산자로 같은지 확인 불가. getTime을 통해 같은지 확인 필요
                var et = edpItem._time.value;
                var etr = refundItem._time.value;
                if(et < etr) {
                    refundError.classList.remove("hidden");
                    return false;
                }
            }
            refundError.classList.add("hidden");
            return true;
        };
        edpItem._date.addEventListener('change', function() {
            refundItem._date._flatpickr.config.maxDate = edpItem._date._flatpickr.selectedDates[0];
        }, true);
        edpItem._date.addEventListener('change', refundChecker);
        refundItem._date.addEventListener('change', refundChecker);
        edpItem._time.addEventListener('optionchange', refundChecker);
        refundItem._time.addEventListener('optionchange', refundChecker);

        ticket.checkRequired = function() {
            return (name._checker() && price._checker() && amount._checker() && limit._checker() && !dateChecker() && timeChecker() && refundChecker());
        };
        
        ticket.toJson = function() {
            var json = {
                "desc" : desc._input.value,
                "price" : parseNumber(price._input.value),
                "maxAmount" : parseNumber(amount._input.value),
                "isHide" : remainingCheckbox.checked,
                "purchaseLimit" : parseNumber(limit._input.value),
                "startDate" : stpItem.getDateValue(),
                "endDate" : edpItem.getDateValue(),
                "refundDeadline" : refundItem.getDateValue()
            };

            if(editable) {
                json.type = ticket.selectedType.typeValue;
                json.name = name._input.value;
            } else{
                json.id = ticket.ticketID;
                if(!hasBuyer) {
                    json.price = parseNumber(price._input.value);
                }
            }

            return JSON.stringify(json);
        };

        return ticket;
    }

    window.Ticket = Ticket;
})();