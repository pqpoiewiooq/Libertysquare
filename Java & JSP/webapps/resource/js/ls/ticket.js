(function() {
    "use strict";

    // prototype element
    var _error = document.createElement("div");
    _error.className = "error-text";

	const freeText = currency(0);
    const regNumber = /[^0-9]/g;
    function parseNumber(str) {
		if(!str || str == freeText) return 0;
		const num = parseInt(str.replace(regNumber, ""));
        return num || 0;
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
        var type = newItem("?????? ??????", editable ? undefined : "?????? ????????? ????????? ??? ????????????.");
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

        fcfsIcon.src = location.getResource("icon/ic_ticket_fcfs.svg");
        fcfsIcon.alt = "????????? ?????????";
        fcfsTitle.textContent = "????????? ??????";
        fcfsDesc.textContent = "????????? ???????????? ???????????????.";

        selectionIcon.src = location.getResource("icon/ic_ticket_selection.svg");
        selectionIcon.alt = "?????? ?????????";
        selectionTitle.textContent = "????????? ?????? ??????";
        selectionDesc.textContent = "????????? ?????? ??? ???????????? ????????? ???????????? ????????? ???????????? ??????????????? ???????????????.";

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
            title: "?????? ??????",
            desc: "?????? ????????? ????????? ?????????.",
            placeholder: "?????? ?????????",
            limit: 32,
            emptyText: "?????? ????????? ????????? ?????????."
        };
        if(!editable) {
            nameOption.desc ="?????? ????????? ????????? ?????????.";
            nameOption.value = data.name;
        }
        var name = newInputItem(nameOption);

        ticket.name = name;
        container.appendChild(name);

        // Description
        var desc = newInputItem({
            title: "?????? ??????",
            desc: "??? ????????? ?????? ????????? ????????? ??????????????? ????????? ?????????.",
            type: "text",
            placeholder: "?????? ????????? ???????????????",
            limit: 256,
            value: editable ? undefined : data.desc
        });

        ticket.desc = desc;
        container.appendChild(desc);

        // Price
        var priceOption = {
            title: "??????",
            desc: "???????????? ?????? ?????? ?????? ????????? ????????? ??? ????????????.",
            min: 0,
            max: 99999999,
            limit: 8,
            emptyText: "?????? ????????? ????????? ?????????. ?????? ????????? 0??? ????????? ?????????."
        };
        var hasBuyer = false;
        if(!editable) {
            priceOption.value = currency(data.price);
            if(data.amount == data.curAmount) {
                priceOption.desc = "?????? ???????????? ?????? ????????? ?????? ??? ??? ?????????.";
            } else {
                priceOption.desc = "???????????? ?????? ????????? ????????? ??? ?????????.";
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
            title: "?????? ??????",
            max: 999999,
            limit: 6,
            emptyText: "?????? ????????? ????????? ?????????."
        };
        if(editable) {
            amountOption.desc = "???????????? ?????? ?????? ????????? ???????????????.";
            amountOption.min = 0;
            amountOption.onConfirm = function(event) {
                if(!ticket.limit) return;
                if(!(event instanceof CustomEvent)) ticket.limit._input.dispatchEvent(new CustomEvent("input"));
                var a = parseNumber(ticket.amount._input.value);
                if(a < 1) {
                    return "?????? ????????? 1?????? ?????? ??? ????????????.";
                } else if(a < parseNumber(ticket.limit._input.value)) {
                    return "?????? ????????? 1?????? ?????? ?????? ???????????? ?????? ??? ????????????.";
                }
            };
        } else {
            var purchasedAmount = data.amount - data.curAmount;
            amountOption.desc = "?????? ????????? ?????? ???????????? ?????? ?????? ??? ????????????.\n(?????? ?????? ??????: " + purchasedAmount + "???)\n(?????? ??????: " + data.curAmount + "???)";
            amountOption.min = purchasedAmount;
            amountOption.value = data.amount;
            amountOption.onConfirm = function(event) {
                if(!ticket.limit) return;
                if(!(event instanceof CustomEvent)) ticket.limit._input.dispatchEvent(new CustomEvent("input"));
                var a = parseNumber(ticket.amount._input.value);
                if(a < 1) {
                    return "?????? ????????? 1?????? ?????? ??? ????????????.";
                } else if(a < purchasedAmount) {
                    return "?????? ????????? ?????? ???????????? ?????? ?????? ??? ????????????.";
                } else if(a < parseNumber(ticket.limit._input.value)) {
                    return "?????? ????????? 1?????? ?????? ?????? ???????????? ?????? ??? ????????????.";
                }
            }
        }
        var amount = newInputItem(amountOption);

        ticket.amount = amount;
        container.appendChild(amount);

        // isHideRemaining
        var remaining = newItem("?????? ?????? ??????");
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
            title: "1?????? ?????? ?????? ??????",
            desc: "?????? 1?????? ????????? ??? ?????? ?????? ???????????????. ????????? ????????? ??????, 1?????? ????????? ??? ?????? ????????? ?????? ???????????????.",
            min: 1,
            max: 999999,
            limit: 6,
            emptyText: "1?????? ?????? ?????? ????????? ????????? ?????????.",
            onConfirm: function(event) {
                if(!ticket.limit) return;
                if(!(event instanceof CustomEvent)) ticket.amount._input.dispatchEvent(new CustomEvent("input"));
                var a = parseNumber(ticket.limit._input.value);
                if(a < 1) {
                    return "1?????? ?????? ?????? ????????? 1?????? ?????? ??? ????????????.";
                } else if(parseNumber(ticket.amount._input.value) < a) {
                    return "1?????? ?????? ?????? ????????? ?????? ???????????? ?????? ??? ????????????.";
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
        var period = newItem("?????? ??????", "???????????? ??????????????? ????????? ??? ????????????.");

        var stpItem = newDateTimeItem("??????");
        var edpItem = newDateTimeItem("??????");

        var stpError = document.createElement("div");
        stpError.className = "error-text hidden";
        stpError.textContent = "?????? ????????? ?????? ???????????? ??????????????? ?????????.";
        stpItem.appendChild(stpError);
        
        var edpError = document.createElement("div");
        edpError.className = "error-text hidden";
        edpError.textContent = "?????? ?????? ????????? ????????? ?????? ??? ??? ????????????.";
        edpItem.appendChild(edpError);

        period._body.appendChild(stpItem);
        period.start = period._body._start = stpItem;
        period._body.appendChild(edpItem);
        period.end = period._body._end = edpItem;
        edpItem.error = edpError;

        ticket.period = period;
        container.appendChild(period);

        // Refund Deadline
        var refund = newItem("?????? ?????? ??????", "?????? ???????????? ???????????? ?????? ?????? ????????? ???????????? ?????? ???????????? ??????????????? ???????????? ????????? ????????? ????????? ?????? ????????????.");
        var refundItem = newDateTimeItem("?????? ?????????");
        var refundError = document.createElement("div");
        refundError.className = "error-text hidden";
        refundError.textContent = "?????? ?????? ????????? ?????? ?????? ?????? ???????????? ??????????????? ?????????.";

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
                                + " ??????";

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
			var current = Date.current();

            var date, time, min, max;
            if(dateString) {
				date = Date.parse(dateString);
				time = Date.format(date, 'HH:mm:00');
				min = minDateString ? Date.parse(minDateString) : date;
				if(maxDateString) max = Date.parse(maxDateString);

				if(date.getFullYear() < current.getFullYear() || date.getMonth() < current.getMonth() || date.getDate() < current.getDate()) {
					item._date.disabled = true;
				}
				if(date < current) item._time.setAttribute('disabled', '');
            } else {
                min = date = current;
            }

            item._date.flatpickr({local: 'ko', minDate: min, maxDate: max, defaultDate: date});// edpItem??? refund??? ???????????? mindate??? ?????? ??????????????? ????????????.
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
            if(!ed || !edr || ed < edr) {
                refundError.classList.remove("hidden");
                return false;
            } else if(ed.getTime() == edr.getTime()) {// date????????? == ???????????? ???????????? ????????? getTime ??????
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
				"name" : name._input.value,
                "desc" : desc._input.value,
                "price" : parseNumber(price._input.value),
                "amount" : parseNumber(amount._input.value),
                "isHide" : remainingCheckbox.checked,
                "purchaseLimit" : parseNumber(limit._input.value),
                "startDate" : stpItem.getDateValue(),
                "endDate" : edpItem.getDateValue(),
                "refundDeadline" : refundItem.getDateValue()
            };

            if(editable) {
                json.type = ticket.selectedType.typeValue;
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