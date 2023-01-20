//payments-ticket-item
(function() {
    const ticketList = document.querySelectorAll("label.payment-ticket-item");
	let selectedTicketElement = undefined;

    function selectTicket(event) {
        for(var i = 0; i < ticketList.length; i++) {
            var item = ticketList[i];
            if(event.currentTarget.isSameNode(item)) {
                item.classList.add("selected");
                item.checkbox.checked = true;
				selectedTicketElement = item;
            } else {
                item.classList.remove("selected");
                item.checkbox.checked = false;
            }
        }
    }

    for(var i = 0; i < ticketList.length; i++) {
        var item = ticketList[i];
        item.checkbox = item.querySelector("input[type='checkbox']");
        item.addEventListener('click', selectTicket);
		item.ticketID = item.dataset.id;
    }

	for(var item of document.querySelectorAll(".counter-container")) {
		(function(counter) {
			var leftBtn = counter.querySelector(".counter-button.left");
			var input = counter.querySelector(".counter-input");
			var rightBtn = counter.querySelector(".counter-button.right");
			var maxCounter = +(counter.previousElementSibling.textContent.replace(/[^0-9]/g, ""));

			leftBtn.countInput = input;
			rightBtn.countInput = input;
			leftBtn.addEventListener('click', function() {
				input.value = +input.value - 1;
				if(input.value <= 1) {
					leftBtn.disabled = true;
				}
				if(input.value < maxCounter) {
					rightBtn.disabled = false;
				}
			});
			rightBtn.addEventListener('click', function() {
				input.value = +input.value + 1;
				if(input.value > 1) {
					leftBtn.disabled = false;
				}
				if(input.value >= maxCounter) {
					rightBtn.disabled = true;
				}
			});

			counter.parentElement.previousElementSibling.counterElement = counter;
			counter.inputElement = input;
		})(item);
	}

	const clientKey = 'live_ck_OEP59LybZ8BL52X6zJYV6GYo7pRe';//'test_ck_7DLJOpm5QrlWP6llDpPVPNdxbWnY';
	let tossPayments = undefined;
	
	let buyButton = document.querySelector("#submitButton");

	function requestPaymentData() {
		var ticketID = selectedTicketElement.ticketID;
		var amount = (selectedTicketElement.counterElement) ? selectedTicketElement.counterElement.inputElement.value : 1;
		majax.load(document.body, "/toss/payment-data?ticketID="+ticketID+"&amount="+amount, "GET", undefined, undefined, true)
			.then(function(xhr) {
				var data = JSON.parse(xhr.responseText);
				if(data.amount == 0) location.href = "/toss/success?_=" + data.orderId;
				else requestTossPayment(data);
			}).catch(function(xhr) {
				alert(xhr.responseText);
			});
	}

	function requestTossPayment(data) {
		if(tossPayments == undefined) {
			loadJs("https://js.tosspayments.com/v1", function() {
				tossPayments = TossPayments(clientKey);
				requestTossPayment(data);
			});
		} else {
			data["successUrl"] = window.location.origin + '/toss/success';
			data["failUrl"] = window.location.origin + '/toss/fail';
			tossPayments.requestPayment('카드', data);
		}
	}

	buyButton.addEventListener('click', requestPaymentData);
})();