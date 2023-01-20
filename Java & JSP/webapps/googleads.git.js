/**
 * @typedef {HTMLElement} HTMLInsElement
 * @typedef {AdElement} HTMLInsElement
 */
(function() {
	/* ===== Custom Setting ===== */
	const AD_CLIENT_KEY = 'Your Client Key';

	(function loadAdsByGoogleScript() {
		const adsbygoogleScript = document.createElement("script");
		adsbygoogleScript.type = "text/javascript";
		adsbygoogleScript.async = true;
		adsbygoogleScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + AD_CLIENT_KEY;
		adsbygoogleScript.crossOrigin = "anonymous";

		document.head.append(adsbygoogleScript);
	}());

	function createAdElement() {
		const adsenseElement = document.createElement('ins');
		adsenseElement.className = 'adsbygoogle';
		adsenseElement.style.display = 'block';
		adsenseElement.dataset.adClient = AD_CLIENT_KEY;
		adsenseElement.dataset.adSlot = slotCode;
	}

	/* ===== Utils ===== */
	function pushAdsByGoogle() {
		(adsbygoogle = window.adsbygoogle || []).push({});
	}

	function pushAdsByGoogleAll() {
		try {
			let adElements = document.querySelectorAll("ins");
			for(let _ of adElements) {
				pushAdsByGoogle()
			}
		} catch(_) { }
	}

	function assertFunction(func) {
		if(typeof func != 'function') throw func + " is not a function";
	}

	function assertNode(node) {
		if(!(node instanceof Node)) throw node + " is not an Node";
	}

	function isSlotCode(slotCode) {
		return typeof slotCode == 'string';
	}

	/**
	 * @param {string | string[]} slotCode
	 * @returns {boolean} whether slotCode is Array
	 */
	function checkSlotCode(slotCode) {
		if(Array.isArray(slotCode)) {
			var length = slotCode.length;
			if(length < 1) throw 'array is empty';


			for(var i = 0; i < length; i++) {
				if(!isSlotCode(slotCode[i])) throw 'array element type mismatch. [index: ' + i + '] is not a string';
			}

			return true;
		} else {
			if(!isSlotCode(slotCode)) throw slotCode + ' is not a string';
			return false;
		}
	}

	function _addGoogleAd(slotCode, setter) {
		const adElement = createAdElement();
		adElement.dataset.slotCode = slotCode;

		setter(adElement);
		const autoPush = adElement.dataset.autoPush;
		if(autoPush == 'false') {
			delete adElement.dataset.autoPush;
			return;
		}

		pushAdsByGoogle();
	}

	function addGoogleAd(slotCode, setter) {
		return new Promise(function(resolve, reject) {
			assertFunction(setter);

			if(checkSlotCode(slotCode)) {
				for(var i = 0; i < length; i++) {
					_addGoogleAd(slotCode[i], setter);
				}
			} else {
				_addGoogleAd(slotCode, setter);
			}
			resolve();
		});
	}

	/* ===== Position Delegate ===== */
	function appendDelegate(targetNode) {
		assertNode(targetNode);

		return function(adElement) {
			targetNode.appendChild(adElement);
		}
	}

	/* ===== Add Functions ===== */
	function addDisplayResponsiveAd(slotCode, positionDelegate) {
		return addGoogleAd(slotCode, function(adElement) {
			adElement.dataset.adFormat = 'auto';
			adElement.dataset.fullWidthResponsive = 'true';
	
			positionDelegate(adElement);
		});
	}

	/**
	 * @param {(AdElement) => void} setter set your fiexd options in setter
	 */
	function addDisplayFixedAd(slotCode, setter) {
		return addGoogleAd(slotCode, function(adElement) {
			adElement.style.display = "inline-block";
	
			setter(adElement);
		});
	}

	function addInFeedAd(slotCode, layoutKey, positionDelegate) {
		return addGoogleAd(slotCode, function(adElement) {
			adElement.dataset.adFormat = 'fluid';
			adElement.dataset.layoutKey = layoutKey;
	
			positionDelegate(adElement);
		});
	}

	function addInArticleAd(slotCode, positionDelegate) {
		return addGoogleAd(slotCode, function(adElement) {
			adElement.style.textAlign = 'center';
			adElement.dataset.adFormat = 'fluid';
			adElement.dataset.adLayout = 'in-article';
	
			positionDelegate(adElement);
		});
	}

	function addMultiplexAd(slotCode, positionDelegate) {
		return addGoogleAd(slotCode, function(adElement) {
			adElement.dataset.adFormat = 'autorelaxed';
	
			positionDelegate(adElement);
		});
	}

	window.GoogleAd = Object.freeze({
		// push
		push: pushAdsByGoogle,
		pushAll: pushAdsByGoogleAll,

		// add
		add: addGoogleAd,
		addDisplayResponsive: addDisplayResponsiveAd,
		addDisplayFixed: addDisplayFixedAd,
		addInFeed: addInFeedAd,
		addInArticle: addInArticleAd,
		addMultiplex: addMultiplexAd,

		// append
		append: function(slotCode, targetNode) {
			return addGoogleAd(slotCode, appendDelegate(targetNode));
		},
		appendDisplayResponsive: function(slotCode, targetNode) {
			return addDisplayResponsiveAd(slotCode, appendDelegate(targetNode));
		},
		appendDisplayFixed: function(slotCode, targetNode) {
			return addDisplayFixedAd(slotCode, appendDelegate(targetNode));
		},
		appendInFeed: function(slotCode, layoutKey, targetNode) {
			return addInFeedAd(slotCode, layoutKey, appendDelegate(targetNode));
		},
		appendInArticle: function(slotCode, targetNode) {
			return addInArticleAd(slotCode, appendDelegate(targetNode));
		},
		appendMultiplex: function(slotCode, targetNode) {
			return addMultiplexAd(slotCode, appendDelegate(targetNode));
		},
	});
}());