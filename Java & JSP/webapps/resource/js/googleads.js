const AD_CLIENT_KEY = 'GOOGLE_AD_KEY';

(function() {
	const adsbygoogleScript = document.createElement('script');
    adsbygoogleScript.type = "text/javascript";
	adsbygoogleScript.async = true;
	adsbygoogleScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + AD_CLIENT_KEY;
	adsbygoogleScript.crossOrigin = "anonymous";

	document.head.append(adsbygoogleScript);
}());

function pushAdsByGoogle() {
	(adsbygoogle = window.adsbygoogle || []).push({});
}

function loadAllAds() {
	try {
		let adElements = document.querySelectorAll("ins");
		for(let _ of adElements) {
			pushAdsByGoogle()
		}
	} catch(_) {}
}

function addGoogleAd(slotCode, setter) {
	try {
		const adsenseElement = document.createElement('ins');
		adsenseElement.className = 'adsbygoogle';
		adsenseElement.style.display = 'block';
		adsenseElement.dataset.adClient = AD_CLIENT_KEY;
		adsenseElement.dataset.adSlot = slotCode;

		setter(adsenseElement);

		const autoPush = adsenseElement.dataset.autoPush;
		if(autoPush == 'false') {
			delete adsenseElement.dataset.autoPush;
			return;
		}
		
		pushAdsByGoogle();
	} catch(_) {}
}

function addResponsiveAd(slotCode, positionDelegate) {
	addGoogleAd(slotCode, function(adElement) {
		adElement.classList.add('pconly');
		adElement.dataset.adFormat = 'auto';
		adElement.dataset.fullWidthResponsive = 'true';

		positionDelegate(adElement);
	});
}

function addResponsiveAds(slotCodes, positionDelegate) {
	for(const slotCode of slotCodes) {
		addResponsiveAd(slotCode, positionDelegate);
	}
}

function addFluidAd(slotCode, layoutKey, positionDelegate) {
	addGoogleAd(slotCode, function(adElement) {
		adElement.dataset.adFormat = 'fluid';
		adElement.dataset.layoutKey = layoutKey;

		positionDelegate(adElement);
	});
}