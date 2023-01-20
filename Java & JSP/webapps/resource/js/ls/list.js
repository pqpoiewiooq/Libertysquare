function wasExpired(str) {
	str = str.replace(/\.[0-9]/g, '')
	var date = new Date(str.replace(/-/g, '/'));
	var current = new Date();

	return !(current < date);
}

function createEventElement(data) {
	var box = document.createElement("a");
	box.className = "event-box";
	box.href = "/event/" + data.eventID;

	var imgWrapper = document.createElement("div");
	var img = document.createElement("img");
	imgWrapper.className = "event-img-wrapper";
	img.loading = "eager";
	img.alt = "행사 이미지";
	var imgLoadingContainer = document.createElement("div");
	var imgLoadingElement = document.createElement("div");
	imgLoadingContainer.className = "loading-container";
	imgLoadingElement.className = "image-loader";
	imgLoadingContainer.append(imgLoadingElement);
	imgWrapper.append(imgLoadingContainer);
	img.addEventListener('load', function() {
		imgLoadingContainer.remove();
	});
	img.src = data.coverPath;

	var body = document.createElement("div");
	var dDay = document.createElement("div");
	var title = document.createElement("div");
	var hashtag = document.createElement("div");
	body.className = "event-body";
	dDay.className = "event-d-day";
	dDay.textContent = dateFormat(data.dtStart, data.isOnline);
	title.className = "event-title";
	title.textContent = data.title;
	hashtag.className = "event-tag";
	if(data.hashtags) {
		data.hashtags.forEach(function(tag) {
			hashtag.textContent += tag + " ";
		});
	}
	if(wasExpired(data.dtEnd)) box.setAttribute("expired", "");
	
	box.appendChild(imgWrapper);
	imgWrapper.appendChild(img);
	box.appendChild(body);
	body.appendChild(dDay);
	body.appendChild(title);
	body.appendChild(hashtag);

	return box;
}