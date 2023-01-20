(function() {
	const doc = window.document;

	/* Utility Functions */
	function createElement(tagName, className, textContent, href) {
		const element = doc.createElement(tagName);
		if(className) element.className = className;
		if(textContent != undefined && textContent != null) element.textContent = textContent;
		if(href) element.href = href;
		return element;
	}

	function createTextElement(tagName, textContent) {
		const element = doc.createElement(tagName);
		if(textContent != undefined && textContent != null) element.textContent = textContent;
		return element;
	}

	const _hr = doc.createElement('hr');
	function hr() {
		return _hr.cloneNode();
	}

	function parsePositiveInt(string) {
		const parsedInt = parseInt(string) || 1;
		return parsedInt < 1 ? 1 : parsedInt;
	}

	function getURLSearchParamsInt(name) {
		const params = new URLSearchParams(location.search);
		return parsePositiveInt(params.get(name));
	}

	function removeChildAll(parent) {
		if(!(parent instanceof Node || parent instanceof Element)) {
			throw "parameter 1 must be 'Node' or 'Element'";
		}
		while(parent.hasChildNodes()) {
			parent.firstChild.remove();
		}
	}

	function addActiveListener(elem, callback) {
		elem.active = false;
		elem.addEventListener('click', function() {
			if(elem.active) {
				elem.active = false;
				elem.classList.remove("active");
			} else {
				elem.active = true;
				elem.classList.add("active");
			}
			if(callback) callback(!elem.active);
		});
	}

	function addEnterListener(elem, callback) {
		elem.addEventListener('keydown', function(e) {
			if (e.keyCode === 13) {
				callback(e);
			}
		});
	}

	function stopEvent(event) {
		if(event && event instanceof Event) {
			event.preventDefault();
			event.stopImmediatePropagation();
		}
	}

	function clickToLoad(event) {
		stopEvent(event);
		const target = event.currentTarget || event.target;
		const href = target.href;
		if(href) WindowManager.load(href);
	}
	
	function addHrefListener(elem) {
		elem.addEventListener('click', clickToLoad);
	}

	function addAlertListener(elem, msg) {
		elem.addEventListener('click', function(event) {
			stopEvent(event);
			alert(msg);
		});
	}

	function createDialog(text) {
		return createElement('article', 'post dialog', text);
	}

	function createSearchForm() {
		const searchForm = createElement('form');
		searchForm.setAttribute('role', 'search');
		searchForm.action = '/search';

		return searchForm;
	}

	function createSearchInput(placeholder, enterListener) {
		const searchInput = createElement('input');
		searchInput.type = 'search';
		searchInput.name = 'keyword';
		searchInput.enterKeyHint = '검색';
		searchInput.placeholder = placeholder;

		addEnterListener(searchInput, enterListener);

		return searchInput;
	}

	function addLimitListener(elem, limit) {
		const property = (elem instanceof HTMLTextAreaElement || elem instanceof HTMLInputElement) ? 'value' : 'innerHTML';
		
		elem.addEventListener('keydown', function(e) {
			if(elem[property].length > limit) {
				e.preventDefault();
			}
		});
		elem.addEventListener('input', function() {
			if(elem[property].length > limit) {
				elem[property] = elem[property].substring(0, limit);
			}
		});
	}

	function confirmLogin() {
		if(confirm('로그인을 하신 후 이용해 주시기 바랍니다.')) {
			location.href = '/sign';
		}
	}

	function addNoLoginListener(eventType, elem) {
		if(!window.isLogin) {
			elem.addEventListener(eventType, function(event) {
				stopEvent(event);
				elem.blur();
				confirmLogin();
			}, true);
		}
	}

	function submitChatRequest(type, id) {
		const form = createElement('form');
		form.method = 'POST';
		form.action = 'https://chat.libertysquare.co.kr';
		form.style.display = 'none';

		const t = createElement('input');
		t.name = 'type';
		t.type = 'hidden';
		t.value = type;
		form.append(t);
		
		const i = createElement('input');
		i.name = 'id';
		i.type = 'hidden';
		i.value = id;
		form.append(i);

		document.body.append(form);
		form.submit();
		try {
			form.remove();
		} catch(error) {}
	}

	/**
	 * target이 화면에 중간에 오도록 scroll 및 focus
	 * @param {HTMLElement} target 
	 */
	function scrollIntoView(target) {
		const rect = target.getBoundingClientRect();
		const adjustY = rect.top + window.pageYOffset - (window.innerHeight / 2) + (rect.height / 2) ;//window.innerHeight
		window.scrollTo(0, adjustY);
		target.focus();
	}

	/* check containers */
	function findById(id) {
		const element = doc.getElementById(id);
		if(!(element instanceof Element)) throw 'Not Found #' + id;
		return element;
	}

	const rootElement = findById('container');
	const main = findById('main');

	const title = (function(parent) {
		const h1 = createElement('h1');
		parent.append(h1);

		const a = createElement('a');
		addHrefListener(a);
		h1.append(a);

		parent.setTitle = function({ title, desc, href } = {}) {
			a.textContent = (title || '');
			if(desc);
			if(href) a.href = href;
			else a.removeAttribute('href');
		}

		return parent;
	})(findById('title'));
	const container = findById('content');
	container.replace = function(node) {
		removeChildAll(container);
		container.append(node);
		window.scrollTo(0, 0);
	}





	/* functions */

	const Status = {
		BAD_REQUEST: 400,
		UNAUTHORIZED: 401,
		FORBIDDEN: 403,
		UNPROCESSABLE_ENTITY: 422,
		METHOD_NOT_ALLOWED: 405,
		CONFLICT: 409,
		NOT_IMPLEMENTED: 501,
	}
	function handleError(error, msg) {
		if(error) {
			if(error instanceof XMLHttpRequest) {
				switch(error.status) {
					case Status.UNAUTHORIZED:
						confirmLogin();
						return;
					case Status.FORBIDDEN:
						alert('요청 권한이 없습니다.');
						return;
					case Status.METHOD_NOT_ALLOWED:
					case Status.NOT_IMPLEMENTED:
						alert('잘못된 요청입니다.');
						return;
					default:
						alert(msg + '\n' + error.responseText);
						return;
				}
			} else if(error instanceof Error) {
				alert(msg + '\n' + error);
				return;
			}
		}
		alert(msg);
	}

	// addAutoSizeListener에서 등록되는 이벤트와 fakeElement를 지우기 위한 리스트
	const autoSizeFakeErasers = [];
	function clearAutoSizeFakes() {
		let eraser;
		while((eraser = autoSizeFakeErasers.shift())) {
			eraser();
		}
	}
	function addAutoSizeListener(textarea, rows) {
		if(!textarea instanceof HTMLTextAreaElement) throw "parameter 1 must be 'HTMLTextAreaElement'";
		if(rows) {
			if(isNaN(rows)) throw "parameter 2 must be 'number'";
			if(rows < 1) throw "parameter 2 must be positive number";
			textarea.rows = rows;
		}

		function autoSizeAdapter() {
			const styleMap = window.getComputedStyle(textarea);
			const lineHeight = styleMap.lineHeight;

			const increase = parseInt(lineHeight.endsWith('px') ? lineHeight : styleMap.fontSize);
			const baseHeight = parseInt(styleMap.height);//textarea.getBoundingClientRect().height;
			
			const fakeTextAreaParent = textarea.parentElement.cloneNode();
			const fakeTextArea = textarea.cloneNode();
			fakeTextAreaParent.append(fakeTextArea);
			fakeTextAreaParent.style.position = "absolute";
			fakeTextAreaParent.style.top = "-100vh";
			fakeTextAreaParent.style.right = "100vw";
			function resizeFakeElement() {
				fakeTextAreaParent.style.width = textarea.getBoundingClientRect().width + "px";
			}
			resizeFakeElement();
			window.addEventListener('resize', resizeFakeElement);
			autoSizeFakeErasers.push(function() {
				fakeTextAreaParent.remove();
				window.removeEventListener('resize', resizeFakeElement);
			});
			window.document.body.append(fakeTextAreaParent);

			function resize(event) {
				fakeTextArea.style.height = "";
				fakeTextArea.value = textarea.value;

				const scrollHeight = fakeTextArea.scrollHeight;
				const row = (scrollHeight / increase);
				const adjustedHeight = (row >= rows) ? (baseHeight - increase) + (increase * rows) : scrollHeight;
				textarea.style.height = adjustedHeight + 'px';
			}

			// function resize(event) {
			// 	textarea.style.height = "";
			// 	const scrollHeight = textarea.scrollHeight;
			// 	const row = (scrollHeight / increase);
			// 	const adjustedHeight = (row >= rows) ? (baseHeight - increase) + (increase * rows) : scrollHeight;
			// 	textarea.style.height = adjustedHeight + 'px';
			// }

			textarea.addEventListener('input', resize);
			textarea.addEventListener('keyup', resize);
			textarea.addEventListener('keydown', resize);
			textarea.addEventListener('paste', resize);
		}
		
		textarea.addEventListener('focus', autoSizeAdapter, { once: true });
	}

	/* optimizing functions */
	const imgTagRegex = /<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/g;
	const trimRegex = /^(\s|<br\s*\/?>)*/;
	function optimizePostContent(content) {
		if(!content) return;

		let images = 0;
		let firstImageSrc = undefined;
		const nonImgContent = content.replace(imgTagRegex, function(match, $1) {
			if((images++) == 0) {
				firstImageSrc = $1;
			}
			return '';
		});
		
		const pure = nonImgContent.replace(trimRegex, '');

		return { pure, images, firstImageSrc };
	}

	const MINUTE = 1000 * 60;
	function normalizeDate(datetime) {
		if(!datetime) return null;
		//const { year, month, day, hour, minute, second, nano } = {...datetime.date, ...datetime.time};
		return Date.parse(datetime);
	}

	function optimizeDate(datetime) {
		const date = (datetime instanceof Date) ? datetime : normalizeDate(datetime);
		const now = Date.current();
		
		if(date.getYear() == now.getYear()) {
			var interval = date.getTime() - now.getTime();
			var intervalMinute = -Math.round(interval/MINUTE);
			if(intervalMinute >= 0 && intervalMinute < 60) {
				return (intervalMinute == 0) ? '방금' : intervalMinute + '분 전';
			} else return Date.format(date, "MM/dd HH:mm");
		} else {
			return Date.format(date, 'yy/MM/dd HH:mm');
		}
	}

	const urlRegex = /(<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>)|(((http|https):\/\/)(www.)?([a-zA-Z\d]+)\.[a-z]+([a-zA-Z\d.?#\/&=_\-*%;]+)?)/mg;
	function convertUrlToA(text) {
		if(!text) return '';

		return text.replace(urlRegex, function(match) {
			return match.startsWith('<img') ? match : '<a href="' + match + '" target="_blank">' + match + '</a>';
		});
	}



	/* api */
	loadJs("https://cdn.jsdelivr.net/gh/fengyuanchen/compressorjs/dist/compressor.min.js");
	async function resize(image, width) {// 최대 650
		const fname = (image && image.fname) || 'resized' + width;

		if(image.type == 'image/gif') {
			if(typeof(SuperGif) == "undefined") {
				await new Promise(function(resolve, reject) {
					loadJs("https://rs.libertysquare.co.kr/assets/croppr/giflib.min.js", resolve);
				});
			}

			return await new Promise(function(resolve, reject) {
				const fileReader = new FileReader();
				fileReader.onload = function(e) {
					const tempImage = new Image();
					tempImage.src = e.target.result;

					var rub = new SuperGif({ gif: tempImage } );
					rub.load(function(){
						const w = tempImage.naturalWidth;
						const h = tempImage.naturalHeight;
						const adjustedHeight = (w > width) ? (width * h) / w : h;
						if(w < width) width = w;

						const imageDataList = rub.get_crop_data_list({x: 0, y: 0, width: w, height: h});

						var ge = new GIFEncoder();
						ge.setRepeat(0);
						ge.setFrameRate(60);
						ge.setSize(width, adjustedHeight);

						ge.start();
						for(var i = 0; i < imageDataList.length; i++) {
							var data = imageDataList[i];
							ge.setDelay(data.delay);
							ge.addFrame(data.data, true);
						}
						ge.finish();

						const binary_gif = ge.stream().getData();
						
						var length = binary_gif.length;
						var tempArray = new Uint8Array(length);
						for (var i = 0; i < length; i++){
							tempArray[i] = binary_gif.charCodeAt(i);
						}

						const blob = new Blob([tempArray], { type: "image/gif" });
						blob.name = fname;

						resolve(blob);
					});
				};
				fileReader.onerror = reject;
				fileReader.readAsDataURL(image);
			});
		}
		
		return await new Promise(function(resolve, reject) {
			new Compressor(image, {
				strict: true,
				maxWidth: width,
				quality: 1,
				success: function (result) {
					result.name = fname;
					resolve(result);
				},
				error: reject
			});
		});
	}



	/*** post-list ***/
	function createPostListItem(post) {
		const { pure, images, firstImageSrc } = optimizePostContent(post.content);
		const generatedAt = optimizeDate(post.generatedAt);

		const fragment = doc.createDocumentFragment();
		const item = createElement('a', 'post', undefined, '/post/' + post.id);
		addHrefListener(item);
		fragment.append(item);

		if(images) {
			const thumbnail = createElement('div', 'thumbnail');
			thumbnail.style = 'background-image: url(' + firstImageSrc + ')';
			item.append(thumbnail);
		}

		const title = createElement('h2', 'title', post.title);
		item.append(title);

		const content = createElement('p', 'content');
		content.innerHTML = pure;
		item.append(content);

		const time = createTextElement('time', generatedAt);
		item.append(time);

		const nickname = createElement('h3', 'nickname', post.writerInfo.nickname);
		item.append(nickname);

		/* status start */
		const status = createElement('ul', 'status');
		item.append(status);

		if(images) {
			const photo = createElement('li', 'photo', images);
			status.append(photo);
		}

		const vote = createElement('li', 'vote', post.likes);
		vote.title = '공감';
		status.append(vote);

		const comment = createElement('li', 'comment', post.comments);
		comment.title = '댓글';
		status.append(comment);
		/* status end */

		item.append(hr());

		return fragment;
	}

	const typeList = [
		{ text: '전체', value: ''},
		{ text: '제목', value: 'TITLE'},
		{ text: '내용', value: 'CONTENT'},
		{ text: '작성자', value: 'WRITER'},
	];
	function createPagination(href, page, hasNext) {
		const pagination = createElement('div', 'pagination');

		if(page > 2) {
			const first = createElement('a', 'first', '처음', href);
			addHrefListener(first);
			pagination.append(first);
		} else if(href.startsWith('/board/')) {
			const split = href.split('/');
			if(split.length >= 3 && !isNaN(split[2])) {
				const searchForm = createSearchForm();
				pagination.append(searchForm);

				const select = createElement('select');
				searchForm.append(select);

				for(let type of typeList) {
					const item = createTextElement('option', type.text);
					item.value = type.value;
					select.append(item);
				}

				const searchInput = createSearchInput('검색어를 입력하세요.', function(event) {
					event.preventDefault();
					
					const keyword = searchInput.value;
					if(keyword.length < 2) {
						alert('검색어를 두 글자 이상 입력하세요!');
					} else {
						const data = new FormData();
						data.append('q', keyword);
						data.append('b', split[2]);
						if(select.value) data.append('t', select.value);
						WindowManager.load(href + '/search?' + data.toString());
					}
				});
				searchForm.append(searchInput);	
			}
		}

		if(page > 1) {
			const prev = createElement('a', 'prev', '이전', href + '?p=' + (page - 1));
			addHrefListener(prev);
			pagination.append(prev);
		}

		if(hasNext && page) {
			const next = createElement('a', 'next', '다음', href + '?p=' + (page + 1));
			addHrefListener(next);
			pagination.append
			pagination.append(next);
		}

		pagination.append(hr());

		return pagination;
	}

	function createNewButton(href) {
		const button = createElement('a', 'new-post-button', undefined, href);
		addHrefListener(button);
		addNoLoginListener('click', button);
		return button;
	}

	const LIST_NOT_FOUND_TEXT = '더 이상 글이 없습니다.';
	const NO_BOARD_TEXT = '게시판이 존재하지 않습니다.';
	const NO_SEARCH_TEXT = '검색 결과가 없습니다.';
	function createPostList(postArray, href, page) {
		const fragment = doc.createDocumentFragment();

		if((!Array.isArray(postArray) || postArray.length < 1)) {// post가 없을 경우
			if(href && href.startsWith('/board/myscrap')) {// 스크랩 페이지인 경우
				fragment.append(createDialog('아직 스크랩한 글이 없습니다.'));// 검색의 경우처럼 createPostList를 불러오기 전에 확인 하여 넣거나 검색의 경우를 이곳에 적용할 예정.
			} else {
				fragment.append(createDialog(LIST_NOT_FOUND_TEXT));
				fragment.append(createPagination(href, page, false));
			}
		} else {// post가 하나라도 있을 경우
			for(let post of postArray) {
				fragment.append(createPostListItem(post));
			}
			fragment.append(createPagination(href, page, true));
		}
		return fragment;
	}
	/*** post-list end ***/



	/*** post(detail) ***/
	/**
	 * 포스트 상세 페이지용
	 */
	const POST_NOT_FOUNT_TEXT = '삭제 또는 존재하지 않는 글입니다.';
	const Post = (function() {
		function createPost(post) {
			const { images } = optimizePostContent(post.content);
			const generatedAt = optimizeDate(post.generatedAt);
			
			const item = createElement('article', 'post');
	
			const image = createElement('img', 'picture');
			image.src = post.writerInfo.profilePath;
			item.append(image);
	
			/* profile start */
			const profile = createElement('div', 'profile');
			item.append(profile);
	
			const nickname = createTextElement('h3', post.writerInfo.nickname);
			profile.append(nickname);
	
			const time = createTextElement('time', generatedAt);
			profile.append(time);
			/* profile end */
	
			/* add-ons start */
			const addOns = createElement('ul', 'status');
			item.append(addOns);

			if(post.isMine) {
				const edit = createElement('li', 0, '수정', '/post/' + post.id + '/edit');
				addHrefListener(edit);
				addOns.append(edit);

				const remove = createTextElement('li', '삭제');
				remove.addEventListener('click', function() {
					majax.load(document.body, '/post/' + post.id, 'DELETE', null, 0, true)
						.then(function() {
							alert('삭제되었습니다.');
							history.back();
						})
						.catch(function(xhr) {
							handleError(xhr, '게시글 삭제에 실패하였습니다.');
						});
				});
				addOns.append(remove);
			} else {
				const chatting = createTextElement('li', '채팅');
				chatting.addEventListener('click', function() {
					submitChatRequest('POST', post.id);
				});
				addNoLoginListener('click', chatting);
				addOns.append(chatting);


				const report = createTextElement('li', '신고');
				report.addEventListener('click', function() {
					const reason = prompt('신고 사유 (100자 이내로 입력하시오)');
					if(reason) {
						const data = new FormData();
						data.append('id', post.id);
						data.append('reason', reason.substring(0, 100));
						majax.load(0, '/report/post', 'POST', data.toString())
							.then(function() {
								alert('신고가 접수되었습니다.');
							})
							.catch(function(xhr) {
								if(xhr instanceof XMLHttpRequest && xhr.status == Status.CONFLICT) {
									alert('이미 신고한 글입니다.');
								} else {
									handleError(xhr, '통신오류로 인해 신고 접수가 실패되었습니다.');
								}
							});
					}
				});
				addNoLoginListener('click', report);
				addOns.append(report);


				const block = createElement('li');
				var isBlocked;
				function setBlocked(bool) {
					block.textContent = (isBlocked = bool) ? '차단 해제' : '차단';
				}
				setBlocked(!!post.isBlocked);
				block.addEventListener('click', function() {
					majax.load(document.body, '/block/post/' + post.id, 'POST', null, 0, true)
						.then(function() {
							setBlocked(!isBlocked);
							alert(isBlocked ? '차단되었습니다.' : '차단 해제되었습니다.');
							history.back();
						})
						.catch(function(xhr) {
							handleError(xhr, (isBlocked ? '차단 해제' : '차단') + '에 실패하였습니다.\n잠시 후 다시 시도해 주세요.');
						});
				});
				addNoLoginListener('click', block);
				addOns.append(block);
			}
			
			item.append(hr());
			/* add-ons end */
	
	
			const title = createElement('h2', 'title', post.title);
			item.append(title);
	
			const content = createElement('p', 'content');
			content.innerHTML = convertUrlToA(post.content);
			item.append(content);
	
			/* status start */
			const status = createElement('ul', 'status left');
			item.append(status);
	
			if(images) {
				const photo = createElement('li', 'photo', images);
				photo.title = "사진";
				status.append(photo);
			}
	
			const vote = createElement('li', 'vote', post.likes);
			vote.title = '공감';
			status.append(vote);
	
			const comment = createElement('li', 'comment', post.comments);
			comment.title = '댓글';
			status.append(comment);
	
			const scrap = createElement('li', 'scrap', post.scrap);
			scrap.title = '스크랩';
			status.append(scrap);
	
			item.append(hr());
			/* status end */
	
			/* buttons start */
			const buttons = createElement('div', 'buttons');
			item.append(buttons);
	
	
			var wasVoted = !!post.isLiked;
			const baseVoteCount = wasVoted ? post.likes - 1 : post.likes;
			const b_vote = createElement('span', wasVoted ? 'vote on' : 'vote', '공감');// 본인 좋아요 여부에 따라 on/off 세팅
			if(post.isMine) {
				addAlertListener(b_vote, '자신의 글을 공감할 수 없습니다.');
			} else {
				function toggleVote() {
					if(wasVoted) {
						wasVoted = false;
						vote.textContent = baseVoteCount;
						b_vote.classList.remove('on');
					} else {
						wasVoted = true;
						vote.textContent = baseVoteCount + 1;
						b_vote.classList.add('on');
					}
				}
				b_vote.addEventListener('click', function() {
					toggleVote();
					majax.load(0, '/like/post/' + post.id, 'POST')
						.catch(function(xhr) {
							handleError(xhr, '공감 요청에 대한 반영이 실패하였습니다.\n잠시 후 다시 시도해 주세요.');
							toggleVote();
						});
				});
			}
			addNoLoginListener('click', b_vote);
			buttons.append(b_vote);
	
			var wasScraped = !!post.wasScraped;
			const baseScrapCount = wasScraped ? post.scrap - 1 : post.scrap;
			const b_scrap = createElement('span', wasScraped ? 'scrap on' : 'scrap', '스크랩');
			if(post.isMine) {
				addAlertListener(b_scrap, '자신의 글을 스크랩할 수 없습니다.');
			} else {
				function toggleScrap() {
					if(wasScraped) {
						wasScraped = false;
						scrap.textContent = baseScrapCount;
						b_scrap.classList.remove('on');
					} else {
						wasScraped = true;
						scrap.textContent = baseScrapCount + 1;
						b_scrap.classList.add('on');
					}
				}
				b_scrap.addEventListener('click', function() {
					toggleScrap();
					majax.load(0, '/post/scrap/' + post.id, 'POST')
						.catch(function(xhr) {
							handleError(xhr, '스크랩 요청에 대한 반영이 실패하였습니다.\n잠시 후 다시 시도해 주세요.');
							toggleScrap();
						});
				});
			}
			addNoLoginListener('click', b_scrap);
			buttons.append(b_scrap);
	
			item.append(hr());
			/* buttons end */
	
			return {
				item,
				id: post.id,
				setCommentCount: function(count) {
					comment.textContent = count;
				}
			};
		}
		
		const commentContainer = createElement('div');
		function setCommentList(postObject, commentList) {
			clearAutoSizeFakes();

			const commentFragment = doc.createDocumentFragment();

			const commentMap = {};
			let bestComment = { likes: 10, generatedAt: null, element: null };// 10개 이상, 생성일 빠른순
			for(let comment of commentList) {
				const parent = commentMap[comment.parent] || commentFragment;
				const generatedAt = (comment.generatedAt = normalizeDate(comment.generatedAt));
				const commentElment = (commentMap[comment.id] = createComment(postObject, comment));
				
				/* best 댓글 확인 start */
				if(comment.likes > bestComment.likes // 좋아요 수가 기존보다 높음 - true
					|| ((comment.likes == bestComment.likes && generatedAt) // 좋아요 수가 같고, 생성일이 있을 때(삭제된 댓글이 아닌 경우)
						&& (bestComment.generatedAt == null // 기존 best 댓글이 없음 - true
							|| generatedAt < bestComment.generatedAt)// 기존 best 댓글보다 생설일이 빠름 - true
							)) {
					bestComment.likes = comment.likes;
					bestComment.generatedAt = generatedAt;
					bestComment.element = commentElment;
				}
				/* best 댓글 확인 end */

				parent.append(commentElment);
			}

			// best 댓글 추가
			if(bestComment.element) {
				bestComment.element.classList.add('best');
				const best = bestComment.element.cloneNode(true);
				best.addEventListener('click', function(event) {
					stopEvent(event);
					scrollIntoView(bestComment.element);
				}, true);
				best.querySelector('.status').remove();
				const childCommentList = best.querySelectorAll('.comment');
				for(let childComment of childCommentList) {
					childComment.remove();
				}
				commentFragment.prepend(best);
			}
			
			commentContainer.replaceChildren(commentFragment);
			commentContainer.append(createCommentForm(postObject, 0));
			postObject.setCommentCount(commentList.length);
		}

		const MAX_COMMENT = 3000;
		function createCommentForm(postObject, parentId) {
			const form = createElement('form', 'post comment-form');
	
			const textarea = createElement('textarea');
			textarea.autocomplete = "off";
			textarea.maxLength = MAX_COMMENT;
			textarea.placeholder = (parentId > 0 ? '대댓글' : '댓글') + '을 입력해 주세요.';
			addLimitListener(textarea, MAX_COMMENT);
			addAutoSizeListener(textarea, 5);
			addNoLoginListener('click', textarea);
			addNoLoginListener('input', textarea);
			addNoLoginListener('keydown', textarea);
			form.append(textarea);
	
			const option = createElement('ul', 'option');
			form.append(option);
	
			const anonym = createElement('li', 'anonym');
			anonym.title = '익명';
			anonym.active = false;
			addActiveListener(anonym);
			option.append(anonym);
	
			const submit = createElement('li', 'submit');
			submit.title = '완료';
			submit.addEventListener('click', function() {
				const formdata = new FormData();
				formdata.append('post', postObject.id);
				formdata.append('comment', textarea.value);
				formdata.append('isAnonymity', anonym.active);
				if(parentId > 0) formdata.append('parent', parentId);
				
				majax.load(submit, '/comment', 'POST', formdata.toString())
					.then(function(xhr) {
						const json = JSON.parse(xhr.responseText);
						setCommentList(postObject, json);
					})
					.catch(function(xhr) {
						console.log(xhr);
						handleError(xhr, '댓글 작성에 실패하였습니다.\n잠시 후, 다시 시도해 주세요.');
					});
			});
			addNoLoginListener('click', submit);
			option.append(submit);

			form.focus = function() {
				scrollIntoView(textarea);
			}
	
			return form;
		}
	
		function createComment(postObject, comment) {
			const item = createElement('article', 'post comment');
	
			const image = createElement('img', 'picture');
			image.src = comment.writerInfo.profilePath;
			item.append(image);
	
			const nickname = createTextElement('h3', comment.writerInfo.nickname);
			if(comment.isPostWriter) nickname.className = "writer";
			item.append(nickname);

			/* add-ons start */
			let status;
			if(!comment.isDeleted) {
				const addOns = createElement('ul', 'status');
				item.append(addOns);
				
				if(comment.depth < 3) {
					const childComment = createTextElement('li', '대댓글');
					let childCommentForm;
					let redered = false;
					childComment.addEventListener('click', function() {
						if(childCommentForm) {
							if(redered) {
								childCommentForm.remove();
								redered = false;
								return;
							}
						} else {
							childCommentForm = createCommentForm(postObject, comment.id);
						}
						item.append(childCommentForm);
						childCommentForm.focus();
						redered = true;
					});
					addOns.append(childComment);
				}
				
				if(!comment.isMine) {// 확인 필요 - 내가 쓴 댓글인 경우 제거하는게 확정인지 정해지지 않아서, 겉에만 if문으로 감싸서 임시 적용은 해둠. 언제든 필요하면 if문만 제거하여 사용
					const commentVote = createTextElement('li', '공감');
					var wasVoted = !!comment.isLiked;
					const baseVoteCount = wasVoted ? comment.likes - 1 : comment.likes;
					status = createElement('ul', 'status left');
					const vote = createElement('li', 'vote');
					if(comment.likes) vote.textContent = comment.likes;
					if(wasVoted) commentVote.style.color = "#c62917";
					status.append(vote);
					if(comment.isMine) {
						addAlertListener(commentVote, '내가 쓴 댓글은 공감할 수 없습니다.');
					} else {
						function toggleVote() {
							if(wasVoted) {
								wasVoted = false;
								vote.textContent = baseVoteCount || '';
								commentVote.style.color = "";
							} else {
								wasVoted = true;
								vote.textContent = baseVoteCount + 1;
								commentVote.style.color = "#c62917";
							}
						}
						commentVote.addEventListener('click', function() {
							toggleVote();
							majax.load(0, '/like/comment/' + comment.id, 'POST')
								.catch(function(xhr) {
									handleError(xhr, '공감 요청에 대한 반영이 실패하였습니다.\n잠시 후 다시 시도해 주세요.');
									toggleVote();
								});
						});
					}
					addNoLoginListener('click', commentVote);
					addOns.append(commentVote);
				}
	
				if(comment.isMine) {
					const remove = createTextElement('li', '삭제');
					remove.addEventListener('click', function() {
						if(confirm('이 댓글을 삭제하시겠습니까?')) {
							majax.load(0, '/comment', 'DELETE', 'id=' + comment.id)
								.then(function(xhr) {
									const json = JSON.parse(xhr.responseText);
									setCommentList(postObject, json);
								})
								.catch(function(xhr) {
									handleError('삭제에 실패하였습니다.\n잠시 후 다시 시도해 주세요.');
								});
						}
					});
					addOns.append(remove);
				} else {
					const chatting = createTextElement('li', '채팅');
					chatting.addEventListener('click', function() {
						submitChatRequest('COMMENT', comment.id);
					});
					addNoLoginListener('click', chatting);
					addOns.append(chatting);

					const report = createTextElement('li', '신고');
					report.addEventListener('click', function() {
						const reason = prompt('신고 사유 (100자 이내로 입력하시오)');
						if(reason) {
							const data = new FormData();
							data.append('id', comment.id);
							data.append('reason', reason.substring(0, 100));
							majax.load(0, '/report/comment', 'POST', data.toString())
								.then(function() {
									alert('신고가 접수되었습니다.');
								})
								.catch(function(xhr) {
									if(xhr instanceof XMLHttpRequest && xhr.status == Status.CONFLICT) {
										alert('이미 신고한 글입니다.');
									} else {
										handleError(xhr, '통신오류로 인해 신고 접수가 실패되었습니다.');
									}
								});
						}
					});
					addNoLoginListener('click', report);
					addOns.append(report);

					const block = createElement('li');
					var isBlocked;
					function setBlocked(bool) {
						block.textContent = (isBlocked = bool) ? '차단 해제' : '차단';
					}
					setBlocked(!!comment.isBlocked);
					block.addEventListener('click', function() {
						majax.load(document.body, '/block/comment/' + comment.id, 'POST', null, 0, true)
							.then(function() {
								setBlocked(!isBlocked);
								alert(isBlocked ? '차단되었습니다.' : '차단 해제되었습니다.');
								location.reload();
							})
							.catch(function(xhr) {
								handleError(xhr, (isBlocked ? '차단 해제' : '차단') + '에 실패하였습니다.\n잠시 후 다시 시도해 주세요.');
							});
					});
					addNoLoginListener('click', block);
					addOns.append(block);
				}
			}
			/* add-ons end */
	
			item.append(hr());
	
			const content = createElement('p');
			content.innerHTML = convertUrlToA(comment.comment);
			item.append(content);
	
			if(comment.generatedAt) {
				const time = createTextElement('time', optimizeDate(comment.generatedAt));
				item.append(time);

				if(status) {
					item.append(status);
				}
			}
	
			item.append(hr());
	
			return item;
		}

		return {
			create: function(post, commentList) {
				const postFragment = doc.createDocumentFragment();

				const postObject = createPost(post);
				postFragment.append(postObject.item);
				postFragment.append(commentContainer);
				setCommentList(postObject, commentList);

				return postFragment;
			}
		}
	})();

	/*** post(detail) end ***/



	/*** post editor ***/
	/**
	 * *:not(input, textarea)[contenteditable=true]인 element를 editor로 만들어줌.
	 * Editor.on(element) 형식으로 사용
	 */
	///////////////////////////////////////// drag & drop 기능 추가
	const Editor = (function() {
		function getRange() {
			if (window.getSelection) {
				var sel = window.getSelection();
				if (sel.getRangeAt && sel.rangeCount) {
					return sel.getRangeAt(0);
				}
			} else if (document.selection && document.selection.createRange) {
				return document.selection.createRange();
			}
			return null;
		}
	
		function restoreRange(range) {
			if (range) {
				if (window.getSelection) {
					var sel = window.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
				} else if (document.selection && range.select) {
					range.select();
				}
			}
		}
	
		function moveRangeAfter(range, node) {
			var move = range.cloneRange();
			move.setStartAfter(node);
			move.collapse(true);
			return move;
		}
	
		function addEmptyChanger(elem) {
			elem.addEventListener('input', function() {
				if(elem.children.length == 1) {
					if(elem.children[0].tagName == 'BR') {
						elem.children[0].remove();
					}
				}
			});
		}
	
		function setRangeLogic(elem, editor) {
			var range;
	
			elem.addEventListener('blur', function() {
				range = getRange();
			});
			elem.addEventListener('focus', function() {
				range = null;
			});
	
			function move(node) {
				if(!range) range = document.createRange();
				range = moveRangeAfter(range, node);
				restoreRange(range);
				ragne = getRange();
			}
	
			function process(processor) {
				var removed = false;
				if(!range) {
					range = getRange();
					removed = true;
				}
				
				if(range) {
					if(elem.isSameNode(range.commonAncestorContainer)) {
						range.deleteContents();
					} else {
						range = null;
					}
				}
	
				processor();
	
				if(removed) range = null;
			}

			function append(node) {
				const lastChild = elem.lastChild;
				if(lastChild && lastChild.nodeName == 'BR') {
					lastChild.remove();
					elem.append(node);
					elem.append(lastChild);
				} else elem.append(node);
			}
	
			editor.insertNode = function(node) {
				process(function() {
					var lastNode;
					if(!Array.isArray(node)) node = [node];
					for(var n of node) {
						if(range) range.insertNode(n);
						else append(n);
						lastNode = n;
					}
					
					move(lastNode);
				});
			}
	
			editor.insertText = function(text) {
				if(typeof text != 'string') throw "parameter 1 is not of type 'string'";
				process(function() {
					try {
						const node = range.commonAncestorContainer;
						const offset = range.endOffset;
						node.insertData(offset, text);
		
						const move = range.cloneRange();
						move.setStart(node, offset + text.length);
						move.collapse(true);
						range = move;
						restoreRange(range);
						range = getRange();
					} catch(error) {
						const node = document.createTextNode(text);
						append(node);
						move(node);
					}
				});
			}
		}

		return {
			on: function(elem, option) {
				//if(!(elem instanceof HTMLDivElement)) throw "parameter 1 is not of type 'HTMLDivElement'";
				if(elem instanceof HTMLInputElement) throw "parameter 1 must not 'HTMLInputElement'";
				if(elem instanceof HTMLTextAreaElement) throw "parameter 1 must not 'HTMLTextAreaElement'";
				if(typeof option != 'object') throw "2 arguments required, but only 1 present.";
				if(typeof option.limit != 'number') throw "option.limit are NaN";
		
				elem.contentEditable = true;
		
				addLimitListener(elem, option.limit);
				addEnterListener(elem, function() {});
				addEmptyChanger(elem);
				const editor = {};
				elem.contenteditor = editor;
				setRangeLogic(elem, editor);
			}
		}
	})();

	const MAX_TITLE = 300;
	const MAX_CONTENT = 15000;
	function createPostEditor(board, post) {
		if(!board && !post) throw '1 arguments required';

		const fragment = doc.createDocumentFragment();

		const form = createElement('form', 'write');
		fragment.append(form);

		// title
		const titleWrapper = createElement('p');
		form.append(titleWrapper);

		const title = createElement('input', 'title');
		title.autocomplete = "off";
		title.placeholder = "글 제목";
		if(post) title.value = post.title;
		addLimitListener(title, MAX_TITLE);
		addEnterListener(title, function(event) {
			event.preventDefault();
		});
		titleWrapper.append(title);

		// content
		const contentWrapper = createElement('p');
		form.append(contentWrapper);

		const content = createElement('span', 'content');
		content.contentEditable = true;
		content.ariaPlaceholder = "플랫탑은 누구나 기분 좋게 참여할 수 있는 커뮤니티를 만들기 위해 커뮤니티 이용규칙을 제정하여 운영하고 있습니다. 위반 시 게시물이 삭제되고 서비스 이용이 일정 기간 제한될 수 있습니다."
				+ "\n"
				+ "\n" + "게시물 작성 전 커뮤니티 이용규칙 전문을 반드시 확인하시기 바랍니다."
				+ "\n"
				+ "\n" + "※ 홍보 및 판매 관련 행위 금지"
				+ "\n" + "- 영리 여부와 관계 없이 사업체·기관·단체·개인에게 직간접적으로 영향을 줄 수 있는 게시물을 반복해서 작성 행위"
				+ "\n" + "- 위와 관련된 것으로 의심되거나 예상될 수 있는 행위"
				+ "\n" + "* 해당 게시물은 홍보게시판에만 작성 가능합니다."
				+ "\n"
				+ "\n" + "※ 그 밖의 규칙 위반"
				+ "\n" + "- 타인의 권리를 심각하게 침해하거나 불쾌감을 주는 행위"
				+ "\n" + "- 범죄, 불법 행위 등 법령을 위반하는 행위"
				+ "\n" + "- 음란물, 성적 수치심을 유발하는 행위";
		Editor.on(content, { limit: MAX_CONTENT });
		if(post) content.innerHTML = post.content;
		contentWrapper.append(content);

		// file adapter
		const file = createElement('input', 'file');
		file.type = file.name = "file";
		file.accept = "image/*";
		file.multiple = true;

		const uploadedImages = new Array();
		if(post) {
			const { images } = optimizePostContent(post.content);
			uploadedImages.length = images;
		}
		function createImg(src) {
			var img = document.createElement('img');
			img.src = src;
			return img;
		}

		const imageUploadListener = createImageListener(async function(files) {
				if((files.length + uploadedImages.length) > 99) {
					alert('사진은 최대 99장까지 가능합니다.');
					return;
				}

				doLoading(contentWrapper);
				const data = new FormData();
				let i = 0;
				for(; i < files.length; i++) {
					const file = files[i];
					const resizedImage = await resize(file, 650);
					data.append("file" + i, resizedImage.size > file.size ? file : resizedImage, file.name);
				}

				const progress = createElement('div');
				progress.style.cssText = "font-size: 11px; font-weight: bold; display: flex; align-items: center; justify-content: center; height: 100%;";
				progress.textContent = '0/' + i;
				contentWrapper.querySelector(".loading-container").append(progress);

				for(let complete = 0; complete < i; complete++) {
					await majax.uploadImage(data.get('file' + complete), null,
						function(url) {
							uploadedImages.push(url);
							content.contenteditor.insertNode(createImg(url));
						},
						function() {
							complete = i;
						});
					progress.textContent = (complete + 1) + '/' + i;
				}
				stopLoading(contentWrapper);
			});
		file.addEventListener('change', imageUploadListener);
        content.addEventListener('drop', imageUploadListener);
		function selectFile() {
			file.click();
		}

		form.append(file);
		form.append(hr());

		// question - notice
		const questionNotice = createElement('p', 'question');
		form.append(questionNotice);

		const questionText = createElement('span');
		questionText.innerHTML = "질문 글을 작성하면 게시판 상단에 일정 기간 동안 노출되어, 더욱 빠르게 답변을 얻을 수 있게 됩니다.";//<br />또한, 다른 회원들이 정성껏 작성한 답변을 유지하기 위해, 댓글이 달린 이후에는 <b>글을 수정 및 삭제할 수 없습니다.</b>";
		questionNotice.append(questionText);
		
		/* options start */
		const options = createElement('ul', 'options');
		form.append(options);

		// hashtag
		const hashtag = createElement('li', 'hashtag');
		hashtag.addEventListener('click', function() {
			content.contenteditor.insertText('#');
			content._scrollTop(true, false);
		});
		options.append(hashtag);

		// attach
		const attach = createElement('li', 'attach');
		attach.addEventListener('click', selectFile);
		options.append(attach);

		// submit
		const submit = createElement('li', 'submit');
		options.append(submit);

		// anonym
		const anonym = createElement('li', 'anonym');
		addActiveListener(anonym);
		if(post && post.isAnonymity) anonym.dispatchEvent(new CustomEvent('click'));
		options.append(anonym);

		// question
		const question = createElement('li', 'question');
		addActiveListener(question, function(active) {
			questionNotice.style.display = active ? "" : "block";
		});
		if(post && post.isQuestion) anonym.dispatchEvent(new CustomEvent('click'));
		options.append(question);


		// submit logic
		submit.addEventListener('click', function() {
			const formdata = new FormData();
			formdata.append('title', title.value);
			formdata.append('content', content.innerHTML);
			formdata.append('board', board);
			formdata.append('isAnonymity', anonym.active);
			formdata.append('isQuestion', question.active);
			for(let contentImg of uploadedImages) {
				if(contentImg) {
					formdata.append('content_img', contentImg);
				}
			}
			
			if(board) {
				majax.load(submit, '/post', 'post', formdata.toString())
					.then(function() {
						WindowManager.load('/board/' + board);
					})
					.catch(function(xhr) {
						handleError(xhr, '게시글을 올리지 못하였습니다.');
					});
			} else if(post) {
				majax.load(submit, '/post/' + post.id, 'patch', formdata.toString())
					.then(function() {
						WindowManager.load('/post/' + post.id);
					})
					.catch(function(xhr) {
						handleError(xhr, '게시글을 수정하지 못하였습니다.');
					});
			}
		});

		/* options end */

		// end
		form.append(hr());
		fragment.append(hr());

		return fragment;
	}
	/*** post editor end ***/



	/*** RightSide ***/
	const RightSide = (function() {
		let rightsideElement;

		function createRightSideItem(post) {
			const item = createElement('a', 'post', undefined, '/post/' + post.id);
			addHrefListener(item);
	
			const title = createElement('p', 'title', post.title);
			item.append(title);
	
			const { pure } = optimizePostContent(post.content);
			const text = createElement('p', 'small');
			text.innerHTML = pure;
			item.append(text);
	
			const board = createTextElement('h4', post.board);
			item.append(board);
	
			const status = createElement('ul', 'status');
			item.append(status);
	
			const like = createElement('li', 'vote', post.likes);
			status.append(like);
	
			const comment = createElement('li', 'comment', post.comments);
			status.append(comment);
	
			item.append(hr());
	
			return item;
		}
	
		function createRightSideCard(data) {
			const card = createElement('div', 'card');
			
			const board = createElement('div', 'board');
			card.append(board);
	
			const boardNameWrapper = createElement('h3');
			board.append(boardNameWrapper);
	
			const boardName = createElement('a', 0, data.board, data.uri ? '/board/' + data.uri : '');
			addHrefListener(boardName);
			boardNameWrapper.append(boardName);
	
			if(data.uri) {
				const 더보기 = createTextElement('span', '더보기');
				boardName.append(더보기);
			}
	
			if(data.posts) {
				for(var post of data.posts) {
					board.append(createRightSideItem(post));
				}
			}
	
			return card;
		}

		function remove() {
			if(rightsideElement) {
				rightsideElement.remove();
				rightsideElement = undefined;
			}
		}

		function newInstance() {
			rightsideElement = createElement('section', 'pconly');
			rightsideElement.id = "rightside";
			rootElement.append(rightsideElement);
		}

		return {
			load: function() {
				if(rightsideElement) return;

				const _ajaxOnceFlag = majax.once;
				majax.once = false;
				newInstance();
				majax.load(rightsideElement, '/post/rightside', 'GET')
					.then(function(xhr) {
						const json = JSON.parse(xhr.responseText);
						
						for(var data of json) {
							rightsideElement.append(createRightSideCard(data));
						}

						addResponsiveAds(['9240318749', '2247899942', '3273685933'], function(adElement) {
							rightsideElement.append(adElement);
						});
					})
					.catch(function() {
						console.error('rightside load failed');
						remove();
					})
					.finally(function() {
						majax.once = _ajaxOnceFlag;
					});
				return rightsideElement;
			},
			remove
		}
	})();
	/*** RightSide end ***/



	const WindowManager = (function() {
		const PageType = {};
		function appendPageType(type) {
			if(typeof type != 'string') throw "parameter 1 is not 'string'";
			PageType[type] = type;
		}
		appendPageType('board');// data: { board: any, page?: number }
		appendPageType('post');// data: { id: number }
		Object.freeze(PageType);

		const PageState = (function() {
			const current = { type: 'none', data: null };

			function validate(type, data) {
				if(!PageType[type]) throw "parameter 1 is not 'PageType'";
				if(!data) throw "2 arguments required, but only 1 present.";
				switch(type) {
					case PageType.board:
						if(data.post) throw "invalid data: { data.post: " + data.post + " }";
						if(!data.board) throw "data.board is required";
						if(data.page && typeof data.page != 'number') throw "data.page is not 'number'";
						break;
					case PageType.post:
						if(data.board) throw "invalid data: { data.board: " + data.board + " }";
						if(data.page) throw "invalid data: { data.page: " + data.page + " }";
						if(typeof data.post != 'object') throw "data.post is not 'object'";
						break;
					default:
						throw "unkown error";
				}
			}

			return {
				set: function(type, data) {
					validate(type, data);

					current.type = type;
					current.data = data;
				},
				compare: function(type, data) {
					validate(type, data);

					if(type !== current.type) return false;
					if(data.board !== current.data.board) return false;

					return true;
				},
				isFirst: function() {
					return current.type == 'none';
				},
				get: function() {
					return {
						type: current.type,
						data: current.data ? Object.assign(current.data) : null
					};
				}
			}
		})();

		function loadBoardEditor() {
			const currentPageState = PageState.get();
			const currentPageType = currentPageState.type;

			if(currentPageType == PageType.board) {
				container.replace(createPostEditor(currentPageState.data.board));
			} else if (currentPageType == PageType.post) {
				container.replace(createPostEditor(null, currentPageState.data.post));
			} else {
				container.replace(createDialog('잘못된 요청입니다.'));
			}
		}

		function get(url, param) {
			RightSide.load();
			return majax.load(container, url, 'GET', param);
		}

		function parseSearchParams() {
			const params = new URLSearchParams(location.search);
			const keyword = params.get('q') || '';
			const board = new Set(params.getAll('b'));
			const type = new Set(params.getAll('t'));
			const page = parsePositiveInt(params.get('p'));

			const param = new FormData();
			param.append('keyword', keyword);
			for(let b of board.keys()) { // board값 필터링 - positive number
				if(isNaN(b) || b < 0) board.delete(b);
				else param.append('board', b);
			}
			for(let t of type.keys()) {// type값 필터링 - SEARCH_TYPES, 변환 - toUpperCase
				const ut = t.toUpperCase();
				if(SEARCH_TYPES.includes(ut)) {
					param.append('type', ut);
					if(t == ut) continue;
				}
				type.delete(t);
			}
			if(page > 1) param.append('page', page);

			return param;
		}

		const BOARD_NAMES = ['best', 'hot', 'myarticle', 'mycommentarticle', 'myscrap'];
		function loadBoard(board, page) {
			if(isNaN(board) && !BOARD_NAMES.includes(board)) {
				title.setTitle();
				container.replace(createDialog(NO_BOARD_TEXT));
			}

			const hasBoardInfo = !PageState.compare(PageType.board, { board, page }); 

			const param = new FormData();
			param.append('board', board);
			if(page && page > 1) param.append('page', page);
			if(hasBoardInfo) {
				param.append('hasBoardInfo', true);
				title.setTitle();
			}

			get('/post/list', param.toString())
				.then(function(xhr) {
					const json = JSON.parse(xhr.responseText);
					PageState.set(PageType.board, { board, page });

					var posts;
					if(hasBoardInfo) {
						posts = json.posts;
						title.setTitle({
							title: json.board,
							href: '/board/' + board
						});
					} else {
						posts = json;
					}

					const postList = createPostList(posts, '/board/' + board, page);
					container.replace(postList);
					if(!isNaN(board)) {
						const newButton = createNewButton('/board/' + board + '/new');
						container.prepend(newButton);
					}

					const firstPostElement = container.querySelector('a.post');
					if(firstPostElement) {
						addFluidAd('2705644063', '-gy-11+2i-73+bq', function(adElement) {
							adElement.style.height = firstPostElement.offsetHeight + 'px';
							firstPostElement.insertAdjacentElement('afterend', adElement);
						});
					}
				})
				.catch(function(xhr) {
					if(xhr) {
						switch(xhr.status) { 
							case Status.BAD_REQUEST:
								container.replace(createDialog(NO_BOARD_TEXT));
								break;
							case Status.UNAUTHORIZED:
								location.href = '/sign';
								break;
						}
					} else {
						container.replace(createDialog(LIST_NOT_FOUND_TEXT));
					}
				}).finally(function() {
					const lastChild = container.querySelector('.post:last-of-type');
					if(!lastChild) return;
					addFluidAd('4167486270', '-gy-11+2i-73+bq', function(adElement) {
						adElement.style.height = '110px';
						lastChild.insertAdjacentElement('afterend', adElement);
					});
				});
		}
		
		function loadPost(postId) {
			if(typeof postId != 'number' || isNaN(postId)) {
				container.replace(createDialog(POST_NOT_FOUNT_TEXT));
				return;
			}

			const param = new FormData();
			param.append('id', postId);
			param.append('hasBoardInfo', true);

			get('/post', param.toString())
				.then(function(xhr) {
					const json = JSON.parse(xhr.responseText);
					const post = json.post;
					PageState.set(PageType.post, { post });

					title.setTitle({
						title: json.boardName,
						href: '/board/' + json.board
					});
					
					const postElement = Post.create(post, json.comment);
					if(json.board == 3) {
						const contentElement = postElement.querySelector('.content');
						contentElement.innerHTML += '<br><span style="color: red;">*본 서비스는 보다 더 많은 회원들이 자유롭게 거래할 수 있도록 별도의 진입장벽을 규정하지 않습니다. 구매자는 게시물의 진위 여부 등을 확인 후 신중히 거래하시기 바랍니다. 회사는 이에 대해 책임을 지지 않습니다.</span>';
					}
					container.replace(postElement);

					addFluidAd('5153264888', '-gy-11+2i-73+bq', function(adElement) {
						adElement.style.height = '92px';
						container.firstElementChild.insertAdjacentElement('afterend', adElement);
					});
				})
				.catch(function(xhr) {
					console.log(xhr);
					container.replace(createDialog(POST_NOT_FOUNT_TEXT));
				});
		}




		const SEARCH_TYPES = ['TITLE', 'CONTENT', 'WRITER'];
		const noFilterSearchForm = createSearchForm();
		noFilterSearchForm.classList.add('search');
		const noFilterSearchInput = createSearchInput('전체 게시판의 글을 검색하세요!', function(event) {
			event.preventDefault();

			const keyword = noFilterSearchInput.value;
			if(keyword.length < 2) {
				alert('검색어를 두 글자 이상 입력하세요!');
			} else location.href = '/search?q=' + encodeURIComponent(keyword);
		});
		noFilterSearchForm.append(noFilterSearchInput);
		function loadSearch(board) {
			const param = parseSearchParams();
			const keyword = param.get('keyword');
			const page = param.get('page');

			if(keyword.length < 2) {
				title.setTitle();
				container.replace(createDialog('검색어를 두 글자 이상 입력하세요!'));
			} else if(board) {// 게시판 검색시
				param.delete('board');
				param.append('board', board);
				get('/post/list/search', param.toString())
					.then(function(xhr) {
						const json = JSON.parse(xhr.responseText);
						PageState.set(PageType.board, { board, page });

						const posts = json.posts;
						title.setTitle({
							title: json.board,
							href: '/board/' + board
						});
						
						if(!posts || posts.length < 1) throw '검색 결과 없음.';

						const postList = createPostList(posts, '/board/' + board, page);
						container.replace(postList);

						const newButton = createNewButton('/board/' + board + '/new');
						container.prepend(newButton);
					})
					.catch(function(xhr) {
						const fragment = doc.createDocumentFragment();
						fragment.append(createDialog(NO_SEARCH_TEXT));
						fragment.append(createPagination('/board/' + board, page));
						container.replace(fragment);
					})
					.finally(function() {// 검색 keyword를 검색 칸에 넣어주기 위함
						const input = container.querySelector('input');
						if(input) input.value = keyword;
					});
			} else {// 메인 페이지 검색시
				title.setTitle({ title: "'" + keyword + "' 검색 결과" });
				const stringfiedParam = param.toString();
				get('/post/search', stringfiedParam)
					.then(function(xhr) {
						const posts = JSON.parse(xhr.responseText);
						PageState.set(PageType.board, { board: '검색', page });
						
						if(!posts || posts.length < 1) throw '검색 결과 없음.';

						return createPostList(posts, '', page);
					})
					.catch(function() {
						return createDialog(NO_SEARCH_TEXT);
					})
					.then(function(content) {
						const fragment = doc.createDocumentFragment();
						fragment.append(noFilterSearchForm);
						fragment.append(content);
						container.replace(fragment);
					});
			}
		}

		return {
			load(href) {
				if(href !== location.href) history.pushState(null, null, href);

				const pathname = location.pathname.split('/');
				switch(pathname[1]) {
				case 'board':
					const board = pathname[2];

					if(!isNaN(board)) {
						switch(pathname[3]) {
							case 'new':
								if(PageState.isFirst()) WindowManager.load('/board/' + board);
								else loadBoardEditor();
								return;
							case 'search':
								loadSearch(board);
								return;
						}
					}

					const page = getURLSearchParamsInt('p');
					loadBoard(board, page);
					break;
				case 'post':
					const id = pathname[2];
					if(!PageState.isFirst() && pathname[3] == 'edit') {
						loadBoardEditor();
					} else {
						loadPost(parseInt(id));
					}
					break;
				case 'search':
					loadSearch();
					break;
				default:
					location.href = '/error404';
				}
				//
			}
		}
	})();

	function loadCurrentPage(event) {
		if(event) {
			event.stopImmediatePropagation();
		}
		WindowManager.load(location.href);
	}

	window.addEventListener('popstate', loadCurrentPage);
	window.addEventListener('DOMContentLoaded', loadCurrentPage);
})();