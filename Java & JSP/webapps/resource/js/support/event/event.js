history.scrollRestoration = "manual";

let infoBar,
	infoBarTop,
	infoBarTempHeightElementStyle,
	isLargeScreen = false,
	isFixed = false;

function copy(elem) {
	var text = elem.dataset.account;
	if(text) { 
		navigator.clipboard.writeText(text);
		alert('계좌번호가 복사되었습니다.');
	}
}
window.onload = function() {
	var account = document.querySelectorAll(".contact-text[data-account]");
	if(account && account.length > 0) {
		for(var i = 0; i < account.length; i++) {
			account[i].style = "cursor: pointer";
			account[i].addEventListener('click', function(event) {
				event.preventDefault();
				copy(event.currentTarget);
			});
		}
	}

	initVariable();
	addEventListener('resize', initVariable);

	const deleteButton = document.querySelectorAll(".js-delete");
	for(let i = 0; i < deleteButton.length; i++) {
		deleteButton[i].addEventListener('click', function(e) {
			e.preventDefault();

			if(confirm('삭제된 행사는 복구할 수 없습니다.\n삭제를 완료하시겠습니까?')) {
				majax.load(document.body, '/support', 'DELETE', 'id=' + e.currentTarget.dataset.id, 0, true)
					.then(function() {
						alert('삭제가 완료되었습니다.');
						location.href = '/my/events';
					})
					.catch(function(xhr) {
						if(xhr instanceof XMLHttpRequest) {
							switch(xhr.status) {
								case 403:// FORBIDDEN
									alert('삭제 권한이 없습니다.');
									bkrea;
								default:
									alert('통신오류로 인해 삭제가 실패되었습니다.\n' + xhr.responseText);
									break;
							}
						} else {
							alert('삭제 요청 중 오류가 발생하였습니다.\n' + xhr);
						}
					});
			}
		});
	}
};

function initVariable() {
	const standardWidth = 1024;// body의 font-size가 16이므로 64em = 1024px
	let width = window.innerWidth;
	
	if (isLargeScreen === false && width >= standardWidth) {
		if(isLargeScreen === true) return;
		infoBar = document.querySelector(".info-bar");
		infoBarTempHeightElementStyle = document.querySelector(".info-bar-default-height").style;
		infoBarTop = infoBar.getBoundingClientRect().top + window.pageYOffset;
		isLargeScreen = true;
		mScorllEventListener();
		addEventListener('scroll', mScorllEventListener);
	} else if(isLargeScreen === true && width < standardWidth){
		changeFixed(false);
		infoBar = undefined;
		infoBarTempHeightElementStyle = undefined;
		infoBarTop = undefined;
		isLargeScreen = false;
		removeEventListener('scroll', mScorllEventListener);
	}
}

function mScorllEventListener() {
	let scrollLocation = document.documentElement.scrollTop;
	if(isFixed === false && scrollLocation >= infoBarTop){
		changeFixed(true);
	} else if(isFixed === true && scrollLocation < infoBarTop){
		changeFixed(false);
	}
}

function changeFixed(f){
	if(f){
		infoBar.className = "info-bar--fixed";
		infoBarTempHeightElementStyle.display = "block";
		isFixed = true;
	}else{
		infoBar.className = "info-bar";
		infoBarTempHeightElementStyle.display = "none";
		isFixed = false;
	}
}