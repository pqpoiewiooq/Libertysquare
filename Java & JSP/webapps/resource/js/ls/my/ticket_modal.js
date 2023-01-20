(function() {
    const week_ko = ["일", "월", "화", "수", "목", "금", "토"];
    function parseDate(str) {
        str = str.replace(/\.[0-9]/g, '')
        var date = new Date(str.replace(/-/g, '/'));
        var year = date.getFullYear();
        var month = (date.getMonth() + 1);
        month = month >= 10 ? month : '0' + month;
        var day = date.getDate();
        day = day >= 10 ? day : '0' + day;
        var a = week_ko[date.getDay()];
        var hour = date.getHours();
        hour = hour >= 10 ? hour : '0' + hour;
        var minute = date.getMinutes();
        minute = minute >= 10 ? minute : '0' + minute;

        return year + '년 ' + month + '월 ' + day + '일 (' + a + ') ' + hour + ':' + minute;
    }

    function disabledCard(card) {
        card.classList.add("disabled");
        if (checkIE()) card.scrollTo(0, 0);
        else card.scrollTo({ behavior: 'smooth', left: 0, top: 0 });
    }

    function createModal(data) {
        var modal = document.createElement("div");
        modal.className = "ticket-modal";

        function closeModal() {
            modal.parentElement.removeChild(modal);
            document.body.style.overflow = "scroll";
        }
        modal.closeModal = closeModal;

        var slider = document.createElement("div");
        slider.className = "ticket-modal-slider";
        slider.cards = slider.getElementsByClassName("ticket-modal-card");
        modal.append(slider);

        for(var i = 0; i < data.attendant.length; i++) {
            slider.append(createModalCard(slider, data, i));
        }




        // desktop controller
        var desktopController = document.createElement("div");
        desktopController.className = "ticket-modal-desktop-view";
        modal.append(desktopController);

        var desktopCounter = document.createElement("p");
        desktopCounter.className = "ticket-modal-desktop-counter";
        desktopCounter.textContent = "1/" + slider.cards.length;
        desktopController.append(desktopCounter);

        var desktopCloseButton = document.createElement("div");
        desktopCloseButton.className = "ticket-modal-desktop-close";
        desktopCloseButton.innerHTML = '<svg viewBox="0 0 352 512" aria-hidden="true" focusable="false" fill="currentColor" class="valign-down"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>';
        desktopCloseButton.addEventListener('click', closeModal);
        desktopController.append(desktopCloseButton);

        // mobile Controller
        var mobileController = document.createElement("div");
        mobileController.className = "ticket-modal-mobile-view";
        modal.append(mobileController);

        var mobileCounter = document.createElement("p");
        mobileCounter.className = "ticket-modal-mobile-counter";
        mobileCounter.textContent = "1/" + slider.cards.length;
        mobileController.append(mobileCounter);

        var mobileCloseButton = document.createElement("div");
        mobileCloseButton.className = "ticket-modal-mobile-close";
        mobileCloseButton.innerHTML = '<svg viewBox="0 0 352 512" height="1.33em" width="1.33em" aria-hidden="true" focusable="false" fill="currentColor" class="valing-down"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>';
        mobileCloseButton.addEventListener('click', closeModal);
        mobileController.append(mobileCloseButton);


        // add Event Listener
        let isMouseDown = false;
        let startX, scrollLeft;
        slider.isMouseMoved = false;
        slider.addEventListener('click', function(event) {
            if(!slider.isMouseMoved && event.target.isSameNode(slider)) {
                closeModal();
                event.preventDefault();
            }
        }, true);
        slider.addEventListener('mousedown', function(event) {
            isMouseDown = true;
            slider.isMouseMoved = false;
            startX = event.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', function() {isMouseDown = false;});
        slider.addEventListener('mouseup', function() {isMouseDown = false;});
        function scrollEventListener() {
            var offsetWidth = 0;
            var currentIndex = undefined;
            var length = slider.cards.length;
            for(var i = 0; i < length; i++) {
                var elem = slider.cards[i];
                if(currentIndex) {
                    disabledCard(elem);
                } else {
                    if(slider.scrollLeft < (offsetWidth + (elem.offsetWidth/2))) {
                        elem.classList.remove("disabled");
                        currentIndex = i + 1;
                    } else disabledCard(elem);
                    offsetWidth += elem.offsetWidth;
                }
            }
            var count = currentIndex + "/" + length;
            desktopCounter.textContent = count;
            mobileCounter.textContent = count;
        }
        slider.addEventListener('mousemove', function(event) {
            if(isMouseDown) {
                event.preventDefault();
                slider.isMouseMoved = true;
                const x = event.pageX - slider.offsetLeft;
                const walk = (x - startX) * 1;
                slider.scrollLeft = scrollLeft - walk;

                scrollEventListener();
            }
        });
        slider.addEventListener('scroll', scrollEventListener);

        return modal;
    }

    function createModalCard(slider, data, attendantCount) {
        var card = document.createElement("div");
        card.className = attendantCount > 0 ? "ticket-modal-card disabled" : "ticket-modal-card";

        var inner = document.createElement("div");
        inner.className = "ticket-modal-card-inner";
        inner.addEventListener('click', function(event) {
            if(!slider.isMouseMoved) {
                event.preventDefault();

                const left = slider.scrollLeft + this.getBoundingClientRect().left - parseFloat(getComputedStyle(slider).paddingLeft);//336.5;


                if (checkIE()) slider.scrollTo(left, 0);
                else slider.scrollTo({ behavior: 'smooth', left: left, top: 0 });
            }
        });
        card.append(inner);

        var isWait = data.attendant[attendantCount].state == "WAIT";
        if(isWait) {
            var placeholder = document.createElement("div");
            placeholder.className = "ticket-modal-card-qr-placeholder";
            placeholder.textContent = "승인 대기 중";
            inner.append(placeholder);
        } else {
            /* 체크인 기능 + 폭죽 효과 넣기. 체크인 시, indicator의 클래스에 checkin 추가  + 체크인 시, '환불하기' -> '환불 불가능' 변경*/
            var indicator = document.createElement("div");
            indicator.className = data.attendant[attendantCount].state == "APPROVE" ? "ticket-modal-card-indicator" : "ticket-modal-card-indicator checkin";
            indicator.innerHTML = '<svg viewBox="0 0 512 512" width="22" aria-hidden="true" focusable="false" fill="currentColor" class="valign-down"><path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg>';
            inner.append(indicator);
    
            var qr = document.createElement("div");
            qr.className = "ticket-modal-card-qr-wrapper";
            inner.append(qr);// 160 x 160사이즈로 qr 넣기
    
            var qrcode = new QRCode(qr, {width: 160, height: 160});
            qrcode.makeCode("https://libertysquare.co.kr/manage/attend/"+data.attendant[attendantCount].id);
        }

        var eventName = document.createElement("div");
        eventName.className = "ticket-modal-card-event-name";
        eventName.textContent = data.event.title;
        inner.append(eventName);

        var ticketName = document.createElement("div");
        ticketName.className = "ticket-modal-card-ticket-name";
        ticketName.textContent = data.ticket.name;
        inner.append(ticketName);

        // row 1 start
        var row1 = document.createElement("div");
        row1.className = "ticket-modal-card-row";
        inner.append(row1);

        var ticketIdCoulmn = document.createElement("div");
        row1.append(ticketIdCoulmn);

        var ticketIdLabel = document.createElement("div");
        ticketIdLabel.className = "ticket-modal-card-label";
        ticketIdLabel.textContent = "Ticket ID";
        ticketIdCoulmn.append(ticketIdLabel);

        var ticketIdContent = document.createElement("div");
        ticketIdContent.className = "ticket-modal-card-content";
        ticketIdContent.textContent = data.attendant[attendantCount].id;
        ticketIdCoulmn.append(ticketIdContent);

        var userNameCoulmn = document.createElement("div");
        row1.append(userNameCoulmn);

        var userNameLabel = document.createElement("div");
        userNameLabel.className = "ticket-modal-card-label";
        userNameLabel.textContent = "구매자 이름";
        userNameCoulmn.append(userNameLabel);

        var userNameContent = document.createElement("div");
        userNameContent.className = "ticket-modal-card-content";
        userNameContent.textContent = data.username;
        userNameCoulmn.append(userNameContent);
        // row 1 end

        // row 2 start
        var row2 = document.createElement("div");
        row2.className = "ticket-modal-card-row";
        inner.append(row2);

        var ticketPriceCoulmn = document.createElement("div");
        row2.append(ticketPriceCoulmn);

        var ticketPriceLabel = document.createElement("div");
        ticketPriceLabel.className = "ticket-modal-card-label";
        ticketPriceLabel.textContent = "티켓 가격";
        ticketPriceCoulmn.append(ticketPriceLabel);

        var ticketPriceContent = document.createElement("div");
        ticketPriceContent.className = "ticket-modal-card-content";
        ticketPriceContent.textContent = currency(data.ticket.price);
        ticketPriceCoulmn.append(ticketPriceContent);

        var paymentDateCoulmn = document.createElement("div");
        row2.append(paymentDateCoulmn);

        var paymentDateLabel = document.createElement("div");
        paymentDateLabel.className = "ticket-modal-card-label";
        paymentDateLabel.textContent = "결제일";
        paymentDateCoulmn.append(paymentDateLabel);

        var paymentDateContent = document.createElement("div");
        paymentDateContent.className = "ticket-modal-card-content date";
        paymentDateContent.textContent = parseDate(data.attendant[attendantCount].paymentTime);
        paymentDateCoulmn.append(paymentDateContent);
        // row 2 end

        var hr = document.createElement("hr");
        hr.className = "ticket-modal-card-hr";
        inner.append(hr);


        var eventDateLabel = document.createElement("div");
        eventDateLabel.className = "ticket-modal-card-label";
        eventDateLabel.textContent = "행사 날짜";
        inner.append(eventDateLabel);

        var eventDateContent = document.createElement("div");
        eventDateContent.className = "ticket-modal-card-content date";
        eventDateContent.textContent = parseDate(data.event.dtStart) + "\n- " + parseDate(data.event.dtEnd);
        inner.append(eventDateContent);

        if(data.event.venue == "zoom") {
            var eventVenueLabel = document.createElement("div");
            eventVenueLabel.className = "ticket-modal-card-label";
            eventVenueLabel.textContent = "온라인 플랫폼";
            inner.append(eventVenueLabel);

            var eventVenueContent = document.createElement("div");
            eventVenueContent.className = "ticket-modal-card-content";
            eventVenueContent.textContent = "Zoom";
            inner.append(eventVenueContent);

            var ticketDescLabel = document.createElement("div");
            ticketDescLabel.className = "ticket-modal-card-label";
            ticketDescLabel.textContent = "티켓 안내";
            inner.append(ticketDescLabel);

            var ticketDescContent = document.createElement("div");
            ticketDescContent.className = "ticket-modal-card-content";
            ticketDescContent.textContent = data.ticket.desc;
            inner.append(ticketDescContent);

            if(!isWait) {
                var eventLinkLabel = document.createElement("div");
                eventLinkLabel.className = "ticket-modal-card-label";
                eventLinkLabel.textContent = "행사 진행 링크";
                inner.append(eventLinkLabel);

                var eventLinkContent = document.createElement("div");
                eventLinkContent.className = "ticket-modal-card-content attend";
                eventLinkContent.textContent = "입장하기";
                eventLinkContent.addEventListener('click', function(event) {
                    event.stopImmediatePropagation();
                    //window.open("about:blank").location.href = data.event.venueDetail;
                    var child = window.open(data.event.venueDetail, "_blank");
                    child.focus();
                });
                inner.append(eventLinkContent);
            }
        } else {
            var eventVenueLabel = document.createElement("div");
            eventVenueLabel.className = "ticket-modal-card-label";
            eventVenueLabel.textContent = "행사 장소";
            inner.append(eventVenueLabel);

            var eventVenueContent = document.createElement("div");
            eventVenueContent.className = "ticket-modal-card-content";
            eventVenueContent.textContent = data.event.venue;
            inner.append(eventVenueContent);

            var ticketDescLabel = document.createElement("div");
            ticketDescLabel.className = "ticket-modal-card-label";
            ticketDescLabel.textContent = "티켓 안내";
            inner.append(ticketDescLabel);

            var ticketDescContent = document.createElement("div");
            ticketDescContent.className = "ticket-modal-card-content";
            ticketDescContent.textContent = data.ticket.desc;
            inner.append(ticketDescContent);
        }

        var refundButton = document.createElement("div");
        refundButton.className = "ticket-modal-card-refund-button";
        inner.append(refundButton);

        var refundText = document.createElement("span");
        refundText.className = "ticket-modal-card-refund-button-text";
        if(data.attendant[attendantCount].state == "ATTEND") {
            refundText.textContent = "환불 불가능";
        } else {
            refundText.textContent = "환불하기";
            refundText.addEventListener('click', function(event) {
                event.stopImmediatePropagation();
                location.href = "/my/refund/" + data.attendant[attendantCount].paymentID;
            });
        }
        refundButton.append(refundText);

        return card;
    }

    window.showTicketModal = function(container, data) {
        container.append(createModal(data));
        document.body.style.overflow = "hidden";
    };
}());