(function applicationPopup() {
	const cookie = (function() {
		const domain = ".libertysquare.co.kr";

		return {
			set: function(name, value, expireDays) {
				try {
					var today = new Date();
					today.setDate(today.getDate() + expireDays);
					document.cookie = name + "=" + escape(value) + "; path=/;domain=" + domain + ";expires=" + today.toGMTString() + ";";
				} catch(e) {}
			},
			get: function(name) {
				var aCookie = document.cookie.split("; ");
				for (var i = 0; i < aCookie.length; i++) {
					var aCrumb = aCookie[i].split("=");
					if (name == aCrumb[0])
						return unescape(aCrumb[1]);
				}
				return null;
			}
		}
	}());

	function createPopupStyleSheet() {
		const styleSheet = document.createElement('style');
		const styleText = `
			.popup {
				display: flex;position: fixed;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				z-index: 10000;
				align-items: center;
				justify-content: center;
				background: rgba(0,0,0,0.7);
			}

			.popup * {
				-webkit-tap-highlight-color: rgba(0,0,0,0.05);
				user-select: none;
				-webkit-user-drag: none;
			}
			
			.popup-inner {
				margin: -50px auto 0;
				width: 300px;
			}
			
			.popup img {
				cursor: pointer;
				width: 300px;
				vertical-align: top;
			}
			
			.popup span {
				cursor: pointer;
				display: block;
				padding: 5px 0;
				text-align: center;
				font-size: 15px;
				font-weight: normal;
				letter-spacing: -0.6px;
				color: #fff;
				text-decoration: underline;
				margin-top: 15px;
			}
		`;
		styleText.replace(/\n|\t/g, '').trim();
		styleSheet.textContent = styleText;
		return styleSheet;
	}

	window.addEventListener('load', function() {
		const agent = navigator.userAgent;
		
		const isAndroid = agent.includes('Android');
		const isIos = agent.includes('iPhone') || agent.includes('iPod') || agent.includes('iPad');

		if(!isAndroid && !isIos) return;// Mobile이 아닌 경우
		if(agent.includes('LSA')) return;// App인 경우
		if(cookie.get('showAppDownPopup') == 'N')  return;// cookie에 값이 남아있는 경우

		const styleSheet = createPopupStyleSheet();

		const popup = document.createElement('div');
		popup.className = 'popup';

		const popupInner = document.createElement('div');
		popupInner.className = 'popup-inner';
		popup.append(popupInner);

		const popupImage = document.createElement('img');
		popupImage.src = "https://ls2020.cafe24.com/img/popup-app-down.png";
		popupInner.append(popupImage);

		const popupText = document.createElement('span');
		popupText.textContent = "괜찮아요. 모바일웹으로 볼게요.";
		popupInner.append(popupText);

		function closePopup() {
			popup.remove();
			styleSheet.remove();
		}

		popupImage.addEventListener('click', function() {
			closePopup();

			if(isAndroid) {
				location.href = "intent://ls2020?url=" + location.href + "#Intent;scheme=libertysquare;package=com.libertysquare.libertysquare;end";
			} else if(isIos) {
				setTimeout(function() {
					location.href = 'itms-apps://itunes.apple.com/app/id1621025953';
				}, 1500);
	
				location.href = "libertysquare://" + location.host + location.pathname;
			} else {
				alert('지원하지 않는 기기입니다.');
				location.reload();
			}
		}, { once: true });

		popupText.addEventListener('click', function() {
			closePopup();

			cookie.set('showAppDownPopup', 'N', 15);
		}, { once: true });

		document.body.append(styleSheet);
		document.body.append(popup);
	});
})();