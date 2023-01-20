<%@ tag language="java" pageEncoding="UTF-8" description="Base Template" %>
<%@ attribute name="title"%>
<%@ attribute name="head" fragment="true" %>

<!DOCTYPE html>
<html lang="ko">
<head>
	<!-- Meta -->
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">

	<!-- Page Info -->
	<title><%= title == null ? "관리자 페이지" : title + " | 관리자 페이지" %></title>

	<link rel="shortcut icon" type="image/x-icon" href="https://ls2020.cafe24.com/img/flattop/favicon.ico">
	<link rel="icon" type="image/x-icon" href="https://ls2020.cafe24.com/img/flattop/favicon.ico">

	<!-- css -->
	<link rel="stylesheet" type="text/css" href="/common.css">

	<!-- js -->
	<%-- 리터럴 이용하려 했는데, JSP 내에서 사용하고 있어서 제외. --%>
	<script id="notificationScript">
		(() => {
			function createFeatures(width, height) {
				const x = (window.screen.width / 2) - (width / 2);
				const y = (window.screen.height / 2) - (height / 2);
				return 'width=' + width + ', height=' + height + ', top=' + y + ', left=' + x + ', fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=no, location=no, scrollbar=yes';
				// return `width=${width}, height=${height}, top=${y}, left=${x}, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=no, location=no, scrollbar=yes`;
			}
			window.createFeatures = createFeatures;
			const defaultFeatures = createFeatures(355, 480);

			window.openDialog = (url, title, features = defaultFeatures) => {
				window.open(url, title, features);
			}

			window.openNotificationDialog = (to) => {
				let url = '/notification/dialog';
				if(to) {
					if(typeof to === 'string') {
						url += '?to=' + to;
					} else if(to instanceof HTMLElement) {
						const token = to.dataset.target;
						if(!token || token == 'null') {
							alert('Invalid Token.\n대상이 App으로 로그인한 기록이 없거나 찾을 수 없습니다.');
						} else {
							url += '?to=' + to.dataset.target;
						}
					}
				}

				window.openDialog(url, '알림 전송');
			}
		})();
	</script>
	<script id="utilityScript">
		FormData.prototype.toString = function() {
			var data = "";
			var flag = false;
			for(let item of this.entries()) {
				if(item[1].length < 1) continue;
				if(flag) data += "&";
				data += (item[0] + "=" + encodeURIComponent(item[1]));
				flag = true;
			}
			return data;
		};
	</script>

	<jsp:invoke fragment="head"/>
</head>
<body>
	<header>
		<input type="checkbox" name="toggle_lnb" id="toggle_lnb">

		<nav id="gnb">
			<label class="nav_button" for="toggle_lnb">
				<svg class="valign-down" viewBox="0 0 448 512" height="1.33em" width="1.33em" aria-hidden="true" focusable="false" fill="currentColor">
					<path fill="currentColor" d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
				</svg>
			</label>
		</nav>

		<nav id="lnb">
			<label for="toggle_lnb"><a class="close"></a></label>
			
			<ul title="회원">
				<li><a href="/user/search">조회</a></li>
				<li><a href="javascript:openNotificationDialog()">알림</a></li>
			</ul>

			<ul title="커뮤니티">
				<li><a href="javascript:alert('개발중...')">게시글</a></li>
				<li><a href="javascript:alert('개발중...')">댓글</a></li>
				<li><a href="/community/board/list">게시판</a></li>
			</ul>

			<a href="javascript:alert('개발중...')">행사</a>
		</nav>
	</header>

	<main>
		<jsp:doBody/>
	</main>
</body>
</html>