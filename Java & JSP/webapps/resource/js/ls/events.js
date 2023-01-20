(function() {
    function parseDate(str) {
        str = str.replace(/\.[0-9]/g, '')
        var date = new Date(str.replace(/-/g, '/'));
        var year = date.getFullYear();
        var month = (date.getMonth() + 1);
        month = month >= 10 ? month : '0' + month;
        var day = date.getDate();
        day = day >= 10 ? day : '0' + day;
        var hour = date.getHours();
        hour = hour >= 10 ? hour : '0' + hour;
        var meridiem = (hour > 12 ? "오후" : "오전");
        var minute = date.getMinutes();
        minute = minute >= 10 ? minute : '0' + minute;

        return year + '년 ' + month + '월 ' + day + '일 ' + meridiem + ' ' + hour + ':' + minute;
    }

    function createEventElement(data) {
        var wrapper = document.createElement("a");
        wrapper.className = "event-card-wrapper";
        wrapper.href = "/event/" + data.eventID;

        var card = document.createElement("div");
        card.className = "event-card";

        var header = document.createElement("div");
        header.className = "event-card-header";

        var img = document.createElement("img");
        img.className = "event-card-image";
        img.src = data.coverPath;

        var inner = document.createElement("div");
        inner.className = "event-card-inner";

        var body = document.createElement("div");
        body.className = "event-card-body";

        var date = document.createElement("span");
        date.className = "event-card-date";
        date.textContent = parseDate(data.dtStart);

        var title = document.createElement("h3");
        title.className = "event-card-title";
        title.textContent = data.title;

        var link = document.createElement("a");
        link.className = "event-card-host-link";
        link.textContent = data.hostName;
        link.href = "/host/" + data.hostID;

        var footer = document.createElement("div");

        var hr = document.createElement("hr");
        hr.className = "event-card-hr";

        var price = document.createElement("span");
        price.className = "event-card-price";
        if(data.type == "LIBERTYSQUARE") {
            var min = data.ticketPrices[0];
            var max = data.ticketPrices[data.ticketPrices.length - 1];
            
            var _min = min == 0 ? "무료" : ("₩" + min).replace(/\B(?=(\d{3})+(?!\d))/, ",");
            if(min == max) {
                price.textContent = _min;
            } else {
                var _max = ("₩" + max).replace(/\B(?=(\d{3})+(?!\d))/, ",");
                price.textContent = _min + " ~ " + _max;
            }
        } else {
            price.textContent = "외부 행사";
        }

        wrapper.append(card);
        card.append(header);
        header.append(img);
        card.append(inner);
        inner.append(body);
        body.append(date);
        body.append(title);
        body.append(link);
        inner.append(footer);
        footer.append(hr);
        footer.append(price);

        return wrapper;
    }
    
    function requestEventList(page) {
        var container = document.querySelector(".event-list-box");

        var loadingBox = document.createElement("div");
        loadingBox.className = "loading-container";
        loadingBox.innerHTML = '<svg viewBox="0 0 512 512" height="60" width="60" aria-hidden="true" focusable="false" fill="currentColor" class="loading-inner"><path fill="currentColor" d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"></path></svg>';
        loadingBox.style.position = "relative";
        container.append(loadingBox);


        var url = 'https://api.libertysquare.co.kr/event/list';
        var n = parseInt(page);
        if(page && typeof(n) == "number") url += '?page=' + n;
        majax.onceAlert = undefined;
        var result = majax.do(url, "GET", undefined, function(xhr) {
            requestNextEventList.pageNumber++;
            var json = JSON.parse(xhr.responseText);
            
            container.removeChild(loadingBox);

            for(var item of json) {
                container.append(createEventElement(item));
            }
        }, function(xhr) {
            if(xhr.status == 204) {
                console.log("end of event list.");
                window.removeEventListener('scroll', scrollBottomListener);
            } else console.log("Event Load Failed... Please retry");
            container.removeChild(loadingBox);
        });

        if(!result) {
            container.removeChild(loadingBox);
        }
    }

    function requestNextEventList() {
        requestEventList(requestNextEventList.pageNumber + 1);
    }

    function scrollBottomListener(event) {
        let scrollTop = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
        var innerHeight = window.innerHeight;
        var scrollHeight = document.body.scrollHeight - 10;
        if(scrollTop + innerHeight >= scrollHeight) {
            requestNextEventList();
        }
    }
    requestNextEventList.pageNumber = 0;

    window.addEventListener('load', function() {
        requestNextEventList();
        window.addEventListener('scroll', scrollBottomListener);
    });
    var supportPageOffset = window.pageXOffset !== undefined;
	var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
})();