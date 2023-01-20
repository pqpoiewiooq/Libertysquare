(function() {
    "use strict";

    let container = undefined;
    let iframe;
    let input;

    window.loadGoogleMap = function(containerElement, inputElement) {
        if(!containerElement) {
            console.log("could not find container element");
            return;
        }
        if(!inputElement) {
            console.log("could not find search box input element");
            return;
        }

        if(container) {
            container.parentElement.removeChild(iframe);
            container = undefined;
            iframe = undefined;
            input = undefined;
        }
        
        var script = document.createElement('script');
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBvGKFCLL6khttyoTqy_7haBhgoA2pPR6Q&callback=initMap&libraries=places&v=weekly&radius=5000";
        script.async = true;

        window.initMap = initMap;
        container = containerElement;
        input = inputElement;

        document.head.appendChild(script);
    }

    function initMap() {
        var searchBox = new google.maps.places.SearchBox(input);

        iframe = document.createElement("iframe");
        iframe.width = iframe.height = "100%";
        iframe.style.border = "0";
        iframe.loading = "lazy";
        iframe.setAttribute("allowfullscreen", "");
        iframe.src = "https://www.google.com/maps/embed/v1/place?key=GOOGLE_MAP_KEY=" + encodeURIComponent(input.value ? input.value : input.placeholder);
        container.appendChild(iframe);

        input.addEventListener('change', function(event) {
            event.stopImmediatePropagation();
            iframe.src = "https://www.google.com/maps/embed/v1/place?key=GOOGLE_MAP_KEY=" + encodeURIComponent(input.value);
        }, false);

        searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();
            if(places.length == 0) return;
			
            iframe.src = "https://www.google.com/maps/embed/v1/place?key=GOOGLE_MAP_KEY=" + encodeURIComponent(places[0].formatted_address);
        });

        window.initMap = undefined;
    }

/*
    var map;
    let container = undefined;
    let input;
    var marker = undefined;

    window.loadGoogleMap = function(containerElement, inputElement) {
        if(!containerElement) {
            console.log("could not find container element");
            return;
        }
        if(!inputElement) {
            console.log("could not find search box input element");
            return;
        }

        if(container) {
            var parent = container.parentElement;
            while(parent.hasChildNodes()) {
                parent.removeChild(parent.firstChild);
            }
            container = undefined;
            input = undefined;
        }
        
        var script = document.createElement('script');
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBvGKFCLL6khttyoTqy_7haBhgoA2pPR6Q&callback=initMap&libraries=places&v=weekly&radius=5000";
        script.async = true;

        window.initMap = initMap;
        container = containerElement;
        input = inputElement;

        document.head.appendChild(script);
    }

    function initMap() {
        map = new google.maps.Map(container, {
            center: {lat: 37.5642135, lng: 127.0016985},
            zoom: 17,
            disableDefaultUI: true, // panControl, mapTypeControl, streetViewControl, zoomControl
            zoomControl: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP // "roadmap"
        });

        var searchBox = new google.maps.places.SearchBox(input);

        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
        });

        searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();

            if(places.length == 0) return;

            if(marker) {
                marker.setMap(null);
                marker = undefined;
            }
            var place = places[0];
            createMarker(place);
            showInfoWindow(place);
                
            var bounds = new google.maps.LatLngBounds();
            if(place.geometry.viewport) bounds.union(place.geometry.viewport);
            else bounds.extend(place.geometry.location);
            map.fitBounds(bounds);
        });

        window.initMap = undefined;
    }

    function replaceGoogleMap(q) {
        var iframe = document.createElement("iframe");
        iframe.width = iframe.height = "100%";
        iframe.style.border = "none";
        iframe.loading = "lazy";
        iframe.setAttribute("allowfullscreen", "");
        iframe.src = "https://www.google.com/maps/embed/v1/place?key=GOOGLE_MAP_KEY=" + q;
    }

    function createMarker(place) {
        if(!place.geometry) {
            console.log("returned place contains no geometry");
            return;
        }

        marker = new google.maps.Marker({
            map: map,
            title: place.name,
            position: place.geometry.location
        });
    }

    function showInfoWindow(place) {
        // place.name - ex) 스타벅스 대명거리점
        // place.vicinity - ex) 종로구 명륜4가 대명길 5
        // place.rating - ex) 3.9
        if(marker) {
            var infoWindow = new google.maps.InfoWindow();
            infoWindow.setContent("html 양식");
            infoWindow.open(map, marker);
            // infoWindow.setPosition();
            // infoWindow.setOptions({pixelOffset: new google.maps.Size(0, 0)});
        }
    }
*/
})();