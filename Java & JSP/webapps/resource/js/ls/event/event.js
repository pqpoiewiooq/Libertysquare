history.scrollRestoration = "manual";

let infoBar,
	infoBarTop,
	infoBarTempHeightElementStyle,
	isLargeScreen = false,
	isFixed = false;

window.onload = function() {
	initVariable();
	addEventListener('resize', initVariable);

	const deleteButton = document.querySelectorAll(".js-delete");
	for(let i = 0; i < deleteButton.length; i++) {
		deleteButton[i].addEventListener('click', function(e) {
			e.preventDefault();

			if(confirm('삭제된 행사는 복구할 수 없습니다.\n삭제를 완료하시겠습니까?')) {
				majax.load(document.body, '/event', 'DELETE', 'id=' + e.currentTarget.dataset.id, 0, true)
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
								case 406:// NOT_ACCEPTABLE
									alert('티켓 구매자가 있습니다. 환불 처리 후 삭제하시기 바랍니다.');
									break;
								case 422:// UNPROCESSABLE_ENTITY
									alert('현재 진행 중인 행사이므로 삭제가 불가합니다.');
									break;
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