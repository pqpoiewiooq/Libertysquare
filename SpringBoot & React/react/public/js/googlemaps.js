(function() {
	"use strict";

	let container = undefined;
	let iframe;
	let input;

	let KEY = "YourGoogleMapsApiKey";

	function toEmbedURL(query) {
		return `https://www.google.com/maps/embed/v1/place?key=${KEY}&q=${encodeURIComponent(query)}`;
	}

	function isElement(element) {
		return element && element instanceof Element;
	}

	function initMap() {
		var searchBox = new google.maps.places.SearchBox(input);

		iframe = document.createElement("iframe");
		iframe.width = iframe.height = "100%";
		iframe.style.border = "0";
		iframe.loading = "lazy";
		iframe.setAttribute("allowfullscreen", "");
		iframe.src = toEmbedURL(input.value ? input.value : input.placeholder);
		container.appendChild(iframe);

		input.addEventListener('change', function(event) {
			event.stopImmediatePropagation();
			iframe.src = toEmbedURL(input.value);
		}, false);

		searchBox.addListener('places_changed', function() {
			var places = searchBox.getPlaces();

			if(places.length == 0) return;

			iframe.src = toEmbedURL(places[0].name);
		});

		window.initMap = undefined;
	}

	window.loadGoogleMap = function(key, containerElement, inputElement) {
		if(!key) throw 'key is empty';
		if(!isElement(containerElement)) throw 'could not find container element';
		if(!isElement(inputElement)) throw 'could not find search box input element';

		KEY = key;
		
		if(container) {
			for(var child of container.children) child.remove();
		}
		
		container = containerElement;
		iframe = undefined;
		input = inputElement;
		
		if(typeof google !== "undefined" && typeof google.maps !== "undefined") {
			initMap();
			return;
		}
		
		window.initMap = initMap;

		var script = document.createElement('script');
		script.src = `https://maps.googleapis.com/maps/api/js?key=${KEY}&callback=initMap&libraries=places&v=weekly&radius=5000`;
		script.async = true;
		container.appendChild(script);
	}
})();