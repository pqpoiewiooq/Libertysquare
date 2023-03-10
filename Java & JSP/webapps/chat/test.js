(function() {
	/* utility functions */
	function createElement(name, className) {
		const element = document.createElement(name);
		if(className) element.className = className;
		return element;
	}

	function isMobile() {
		if(navigator.maxTouchPoints < 1) return false;
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi|mobi/i.test(navigator.userAgent);
	}

	HTMLElement.prototype.clear = function() {
		while(this.hasChildNodes()) {
			this.firstChild.remove();
		}
	};

	/**
	 * copy all property
	 * @param {object} to 
	 * @param {object} from 
	 */
	function copy(to, from) {
		for(const property in from) {
			to[property] = from[property];
		}
	}


	/* ui */
	const ChatItem = (function() {
		const _item_ = createElement('section', 'chat-item');
		const _time_ = createElement('time');
		const _unread_ = createElement('div', 'unread-text');
		const _text_ = createElement('span');
		const _img_ = createElement('img', 'picture mouse');
		
		const DATE_FORMAT = 'a hh:mm';
		
		/**
		 * @param {boolean} isMine 
		 * @param {Date} date 
		 * @param {number} unreadCount 
		 * @param {Node} node 
		 * @returns {HTMLElement}
		 */
		function newItem(isMine, date, unreadCount, node) {
			const item = _item_.cloneNode();
			
			const time = _time_.cloneNode();
			const unread = _unread_.cloneNode();
			time.append(unread);
			time.append(Date.format(date, DATE_FORMAT));
			
			if(isMine) {
				item.classList.add('right');
				item.append(time);
				item.append(node);
			} else {
				item.classList.add('left');
				item.append(node);
				item.append(time);
			}

			item.date = date;
			item.updateCount = (count) => {
				unread.textContent = (typeof count == 'number' && count > 0) ? count : '';
			}
			item.updateCount(unreadCount);
			return item;
		}
		
		return {
			text: function(isMine, date, text, unreadCount) {
				const textNode = _text_.cloneNode();
				textNode.textContent = text;
				return newItem(isMine, date, unreadCount, textNode);
			},
			img: function(isMine, date, src, unreadCount) {
				const img = _img_.cloneNode();
				img.src = src;
				return newItem(isMine, date, unreadCount, img);
			},
			dayDivider: function(date) {
				const divider = createElement('section', 'flex center day-divider');
				const time = createElement('time', 'flex center');
				time.textContent = Date.format(date, 'yyyy??? MM???dd???');
				divider.append(time);
				return divider;
			}
		}
	})();


	let selectedRoom = null;
	const UNKNOWN = Object.freeze({
		nickname: '(??? ??? ??????)',
		profilePath: 'https://ls2020.cafe24.com/img/anonym.png',
		lastViewTime: 0,
		isOnAlarm: false
	});

	/* container */
	const Container = (function() {
		const container = document.getElementById('container');

		/* empty */
		const empty = createElement('div', 'flex center empty');
		empty.innerHTML = '<svg width="96" height="81" viewBox="0 0 96 81" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M33.0004 0C15.0185 0 0 13.0729 0 29.6567C0 40.358 6.27606 49.642 15.5279 54.8364L13.8397 64.5305C13.7353 65.1299 13.928 65.7446 14.3535 66.1751L14.3573 66.179L14.3724 66.1939C14.3853 66.2066 14.4061 66.2267 14.4326 66.2506C14.4869 66.2995 14.568 66.3668 14.6744 66.435C14.9082 66.5849 15.1569 66.6709 15.3962 66.7073C15.7666 66.7637 16.0661 66.6901 16.1358 66.673L16.1413 66.6716C16.3174 66.6287 16.5003 66.558 16.6232 66.51C16.9302 66.3901 17.5014 66.1524 18.5787 65.6955C20.7218 64.7866 24.9636 62.9696 33.3799 59.3641C51.1931 59.1817 66.0008 46.1763 66.0008 29.7093C66.0008 13.1297 50.987 0 33.0004 0Z" fill="#DCDEE3"></path><path d="M72.2312 29.4385C72.2312 48.2002 56.7085 62.679 37.8858 64.8408C44.0168 70.067 52.3818 73.2792 61.479 73.3633C70.2216 76.9749 74.6257 78.7941 76.8498 79.7036C77.9674 80.1606 78.5583 80.3977 78.8749 80.517C79.0036 80.5654 79.1863 80.6333 79.3599 80.6741L79.3652 80.6754C79.4339 80.6917 79.7238 80.7604 80.0821 80.7078C80.313 80.6739 80.5564 80.5935 80.7883 80.4501C80.8943 80.3846 80.9756 80.3195 81.0307 80.2717C81.0459 80.2585 81.0593 80.2464 81.0704 80.2362C81.0789 80.2284 81.0861 80.2217 81.0918 80.2163L81.1071 80.2017L81.111 80.1978C81.5557 79.764 81.7577 79.1325 81.6467 78.5179L79.9012 68.8524C89.4699 63.674 96 54.3943 96 43.6557C96 29.1206 84.0984 17.353 68.7254 14.6059C70.9682 19.0808 72.2312 24.0881 72.2312 29.4385Z" fill="#DCDEE3"></path></svg><div>????????? ????????? ??????????????????.</div>';
		
		/* room template */
		const template = createElement('section', 'content');
		
		// template - head
		const head = createElement('article', 'flex head');
		template.append(head);

		const profileBox = createElement('div');
		head.append(profileBox);

		const profileImage = createElement('img', 'profile');
		profileBox.append(profileImage);

		const profileNickname = document.createTextNode('');
		profileBox.append(profileNickname);

		const menuIcon = createElement('div', 'flex center menu-button mouse');
		menuIcon.innerHTML = '<svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.0002 3.19998C2.7152 3.19998 3.3002 2.61498 3.3002 1.89998C3.3002 1.18498 2.7152 0.599976 2.0002 0.599976C1.2852 0.599976 0.700195 1.18498 0.700195 1.89998C0.700195 2.61498 1.2852 3.19998 2.0002 3.19998Z" fill="#212124"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M2.0002 6.70001C1.2852 6.70001 0.700195 7.28501 0.700195 8.00001C0.700195 8.71501 1.2852 9.30001 2.0002 9.30001C2.7152 9.30001 3.3002 8.71501 3.3002 8.00001C3.3002 7.28501 2.7152 6.70001 2.0002 6.70001Z" fill="#212124"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M2.0002 12.8C1.2852 12.8 0.700195 13.385 0.700195 14.1C0.700195 14.815 1.2852 15.4 2.0002 15.4C2.7152 15.4 3.3002 14.815 3.3002 14.1C3.3002 13.385 2.7152 12.8 2.0002 12.8Z" fill="#212124"></path></svg>';
		let mouseenter = false;
		let isClosing = false;
		menuIcon.addEventListener('mouseenter', () => mouseenter = true);
		menuIcon.addEventListener('mouseleave', () => mouseenter = false);
		head.append(menuIcon);

		const menuBox = createElement('div', 'menu');
		menuBox.tabIndex = -1;
		menuBox.addEventListener('blur', (event) => {
			if(mouseenter) isClosing = true;
			menuBox.remove();
		});
		menuIcon.addEventListener('click', () => {
			if(isClosing) {
				isClosing = false;
				return;
			}

			mouseenter = true;
			head.append(menuBox);
			menuBox.focus();
		});

		const menuAlarm = createElement('div', 'mouse');
		menuAlarm.addEventListener('click', () => {
			menuAlarm.target?.toggleAlarm?.();
			menuBox.blur();
		});
		menuBox.append(menuAlarm);

		const menuLeave = menuAlarm.cloneNode();
		menuLeave.textContent = '????????? ?????????';
		menuBox.append(menuLeave);

		const preview = createElement('article', 'flex head mouse');
		let currentPreviewPostId = null;
		preview.addEventListener('click', function() {
			if(currentPreviewPostId) {
				location.href = 'https://flattop.kr/post/' + currentPreviewPostId;
			}
		});
		template.append(preview);

		const previewInner = createElement('div');
		preview.append(previewInner);

		const previewThumbnail = createElement('img', 'thumbnail');
		previewInner.append(previewThumbnail);

		const previewBody = createElement('div', 'post-preview');
		previewInner.append(previewBody);

		const previewBoardName = createElement('span');
		previewBody.append(previewBoardName);

		const previewTitle = createElement('b');
		previewBody.append(previewTitle);

		function setPostPreview(data) {
			currentPreviewPostId = data.id;
			if(isNaN(currentPreviewPostId)) {
				preview.classList.remove('mouse');
			} else {
				preview.classList.add('mouse');
			}
			previewThumbnail.src = data.thumbnail || '';
			previewTitle.textContent = data.title || '';
			previewBoardName.textContent = data.desc || '';
		}
		
		/* form */
		const form = createElement('form', 'flex center chat-form');
		
		const textarea = createElement('textarea');
		textarea.placeholder = '???????????? ??????????????????';
		form.append(textarea);

		const addons = createElement('section', 'flex add-ons');
		form.append(addons);

		addons.append(createElement('div'));// submit, textLength??? ????????? addon??? ?????????, css??? ????????? ??? div ??????
		// const addonImage = createElement('label');
		// addonImage.innerHTML = '????????? ????????????\n'
		// 	+ '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"/></svg>';
		// addons.append(addonImage);
		
		// const imageSelector = createElement('input');
		// imageSelector.type = 'file';
		// imageSelector.multiple = true;
		// addonImage.append(imageSelector);

		const addonSubmit = createElement('button');
		addonSubmit.textContent = '??????';
		addons.append(addonSubmit);

		const addonTextLength = createElement('span', 'length');
		addons.append(addonTextLength);

		// event setting
		if(!isMobile()) {// Enter ?????? ???, PC??? ?????? shift ?????? ??????????????? ??????.
			textarea.addEventListener('keydown', function(e) {
				if (e.keyCode === 13 && !e.shiftKey) {
					e.preventDefault();
					addonSubmit.click();
				}
			});
		}
		const TEXT_LIMIT = 1000;
		function updateTextLength() {
			const value = textarea.value;
			if(selectedRoom) selectedRoom.textarea = value;

			// ????????? ??????
			if(value.length > TEXT_LIMIT) {
				textarea.value = value.substring(0, TEXT_LIMIT);
			}
			// ????????? ????????????
			const length = textarea.value.length;
			addonTextLength.textContent = length + '/' +  TEXT_LIMIT;
			addonSubmit.disabled = !length;
		}
		textarea.addEventListener('input', updateTextLength);
		updateTextLength();

		addonSubmit.addEventListener('click', function(e) {
			e.preventDefault();
			
			// ?????????
			const value = textarea.value;
			if(value && selectedRoom) {
				textarea.value = '';
				updateTextLength();
	
				const message = { type: 'TEXT', roomId: selectedRoom._id, content: value };
				if(__ && __.data && selectedRoom._id == -1) {
					const requestedRoom = selectedRoom;
					function handleAjax(xhr) {
						if(!xhr) return alert('??????????????? ???????????????.');
						switch(xhr.status) {
						case 409: // Confilct
							alert('????????? ??????.\n?????? ????????? ??????????????????.');
							if(!selectRoom(xhr.responseText)) {// ?????? ?????? ??????????????? ?????? ?????? ?????? ????????????
								location.reload();
							}
							break;
						case 201: // Created
							const data = JSON.parse(xhr.responseText);
							requestedRoom.injectInformation(data);
							message.roomId = data.id;
							postMessage(message);
							__ = null;
							break;
						default:
							alert('??? ????????? ?????????????????????.\n' + xhr.responseText);
						}
					}
					majax.do('./contact', 'POST', __.data, handleAjax, handleAjax);
				} else {
					postMessage(message);
				}
			}
		});

		const imgTagRegex = /<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/g;
		function findThumbnail(content) {
			if(!content) return;

			let thumbnail = undefined;
			content.replace(imgTagRegex, function(match, $1) {
				if(!thumbnail) {
					thumbnail = $1;
				}
				return '';
			});

			return thumbnail;
		}

		function changeRoom(imagePath, name, roomElement, roomData) {
			profileImage.src = imagePath;
			profileNickname.textContent = name;

			if(currentList) currentList.remove();
			currentList = roomElement.list;
			template.append(currentList);

			textarea.value = roomElement.textarea || '';
			updateTextLength();

			menuAlarm.textContent = roomData.onAlarm ? '????????? ??????' : '????????? ??????';
			menuAlarm.target = roomData;

			container.clear();
			container.append(template);
			container.append(form);
			container.classList.add('room');
			
			currentList.scrollBottom();
			currentList.focus();
		}

		/**
		 * form??? disabled ?????? ???, linkedPost(preview)??? hidden ??????
		 */
		function setSendable(sendable) {
			if(sendable) {
				form.removeAttribute('disabled');
				preview.style.display = '';
			} else {
				form.setAttribute('disabled', 'disabled');
				preview.style.display = 'none';
			}
		}

		let currentList;
		return {
			empty: () => {
				container.clear();
				container.append(empty);
				container.classList.remove('room');
			},
			room: (imagePath, name, roomElement, roomData, linkedPost) => {
				setSendable(true);

				if(linkedPost.loading) doLoading(previewBody);
				else if(previewBody.__isLoading) stopLoading(previewBody);

				if(linkedPost.title) {
					setPostPreview(linkedPost);
				} else {
					previewThumbnail.src = '';
					const requestedRoom = selectedRoom;
					const param = new FormData();
					param.append('id', linkedPost.id);
					param.append('hasBoardInfo', true);
					linkedPost.loading = true;
					majax.load(previewBody, '/post', 'GET', param)
						.then((xhr) => {
							const postData = JSON.parse(xhr.responseText);
							
							linkedPost.thumbnail = findThumbnail(postData.post.content);
							linkedPost.title = postData.post.title;
							linkedPost.desc = postData.boardName;
						})
						.catch((xhr) => {
							linkedPost.title = '?????? ?????? ???????????? ?????? ????????????.';
						})
						.finally(() => {
							linkedPost.loading = false;
							if(requestedRoom === selectedRoom) {
								setPostPreview(linkedPost);
							}
						});
				}
				
				changeRoom(imagePath, name, roomElement, roomData);
			},
			notifyRoom: (imagePath, name, roomElement, roomData) => {
				setSendable(false);
				changeRoom(imagePath, name, roomElement, roomData);
			}
		}
	})();

	/* Leftside */
	const leftside = document.getElementById('leftside');
	const roomList = leftside.querySelector('ul');
	function findRoom(roomId) {
		for(const room of roomList.children) {
			if(room._id && room._id == roomId) {
				return room;
			}
		}
	}
	function selectRoom(roomId) {
		const room = findRoom(roomId);
		if(room) {
			room.click();
			return true;
		}
		return false;
	}
	const leftsideMenu = (function() {
		let mouseenter = false;
		let rootElement = null;
		const onmouseenter = () => mouseenter = true;
		const onmouseleave = () => mouseenter = false;

		const menu = createElement('div', 'menu');
		menu.tabIndex = -1;
		function close() {
			if(rootElement) {
				rootElement.style.display = '';
				rootElement.removeEventListener('mouseenter', onmouseenter);
				rootElement.removeEventListener('mouseleave', onmouseleave);
				rootElement = null;
			}
			mouseenter = false;
			menu.remove();
		}
		menu.addEventListener('blur', (event) => {
			event.stopImmediatePropagation();
			if(!mouseenter) close();
		});

		const alarm = createElement('div', 'mouse');
		alarm.addEventListener('click', () => {
			alarm.target?.toggleAlarm?.();
			menu.blur();
		});
		menu.append(alarm);

		const leave = alarm.cloneNode();
		leave.textContent = '????????? ?????????';
		menu.append(leave);
		
		return {
			on: (element, room) => {
				if(element.isSameNode(rootElement)) {
					close();
					return;
				}

				close();

				const roomItem = element.parentElement;
				menu.style.top = roomItem.getBoundingClientRect().bottom + 'px';
				alarm.textContent = room.onAlarm ? '????????? ??????' : '????????? ??????';
				alarm.target = room;

				leftside.append(menu);
				menu.focus();
				rootElement = element;
				rootElement.addEventListener('mouseenter', onmouseenter);
				rootElement.addEventListener('mouseleave', onmouseleave);
				rootElement.style.display = 'flex';
				mouseenter = true;
			}
		}
	})();


	function formatRoomDate(date) {
		const now = Date.current();
		
		return Date.format(date,
			now.getFullYear() == date.getFullYear
			? ((now.getMonth() == date.getMonth() && now.getDate() == date.getDate())
				? 'a hh:mm'
				: 'MM??? dd???')
			: 'yyyy.MM.dd')
	}

	/**
	 * @param {number} lhs 
	 * @param {number} rhs 
	 * @returns {boolean}
	 */
	function diffDays(lhs, rhs) {
		// ?????? ?????????, ??? ??? ???????????? ????????? true
		if(lhs == rhs || (!lhs || !rhs)) return true;
		const date1 = Date.toKST(new Date(lhs));
		const date2 = Date.toKST(new Date(rhs));
		date1.setHours(0, 0, 0, 0);
		date2.setHours(0, 0, 0, 0);
		return Math.floor((date1 - date2) / 864e5) != 0;
	}

	function appendManagerIcon(parent) {
		const managerIcon = createElement('svg');
		parent.append(managerIcon);
		managerIcon.outerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.49875 2.96157C6.99096 2.08939 7.92611 1.5 9 1.5C10.0739 1.5 11.009 2.08936 11.5012 2.96143C12.466 2.69285 13.544 2.93744 14.3032 3.69666C15.0626 4.45603 15.307 5.53399 15.0384 6.49875C15.9106 6.99096 16.5 7.92611 16.5 9C16.5 10.0739 15.9106 11.009 15.0386 11.5012C15.3072 12.466 15.0626 13.544 14.3033 14.3032C13.544 15.0626 12.466 15.307 11.5012 15.0384C11.009 15.9106 10.0739 16.5 9 16.5C7.92614 16.5 6.991 15.9106 6.49878 15.0386C5.53405 15.3072 4.45602 15.0626 3.6968 14.3033C2.93743 13.544 2.69296 12.466 2.96157 11.5013C2.08939 11.009 1.5 10.0739 1.5 9C1.5 7.92614 2.08936 6.991 2.96143 6.49878C2.69285 5.53404 2.93744 4.45602 3.69666 3.6968C4.45603 2.93743 5.53399 2.69296 6.49875 2.96157ZM11.7341 6.49602C11.4472 6.28914 11.0469 6.354 10.84 6.6409L8.41363 10.0057L7.11178 8.59068C6.87229 8.33037 6.46714 8.31349 6.20683 8.55297C5.94653 8.79245 5.92964 9.19761 6.16913 9.45791L8.00255 11.4508C8.13284 11.5924 8.31988 11.6679 8.51196 11.6565C8.70405 11.645 8.88081 11.5478 8.99335 11.3917L11.879 7.39009C12.0859 7.10319 12.021 6.70291 11.7341 6.49602Z" fill="#00B493"></path></svg>';
	}

	/**
	 * room ??????.
	 * leftside??? ??????.
	 * @param {{
			id: number,
			title?: string,
			thumbnail?: string,
			desc?: string,// desc??? ????????????, boardName??? ?????????.
		}} linkedPost
	 * @returns {HTMLElement} room
	 */
	function createRoom(id, data) {//participants, linkedPost, isManager
		let participants = data.participants;
		let linkedPost = { id: data.linkedPostId };
		let isManager = data.type == 'NOTIFICATION';

		const my = participants?.find(participant => participant.id == data.myParticipantId) || { ...UNKNOWN };
		my.toggleAlarm = () => {
			postMessage({ type: 'ALARM', roomId: id });
			data.onAlarm = !data.onAlarm;
		}
		const opponent = participants?.find(participant => participant.id != data.myParticipantId) || { ...UNKNOWN };

		const room = createElement('li');
		room._id = id;
		if(id == -1) {
			room.injectInformation = (injectData) => {
				data = injectData;

				room._id = id = data.id;

				const myParticipantId = data.myParticipantId;
				participants = data.participants;
				copy(my, participants.find(participant => participant.id == myParticipantId));
				copy(opponent, participants.find(participant => participant.id != myParticipantId));
				my.lastViewTime = Date.now();

				isManager = data.type == 'NOTIFICATION';
				if(isManager) appendManagerIcon(previewInner);

				delete room.injectInformation;
			}
		}

		const body = createElement('div', 'flex preview mouse');
		room.append(body);

		const img = createElement('img', 'profile');
		img.src = opponent.profilePath;
		body.append(img);

		const previewWrapper = createElement('div');
		body.append(previewWrapper);

		const previewInner = createElement('div', 'flex');
		previewWrapper.append(previewInner);

		const previewNickname = createElement('span', 'nickname');
		previewNickname.textContent = opponent.nickname;
		previewInner.append(previewNickname);

		if(isManager) appendManagerIcon(previewInner);

		const previewTime = createElement('time');
		previewInner.append(previewTime);

		const previewText = createElement('span', 'text');
		previewText.className = 'text';
		previewWrapper.append(previewText);

		const thumbnail = createElement('img', 'thumbnail');
		body.append(thumbnail);

		const count = createElement('count');
		body.append(count);

		const option = createElement('div', 'flex center options mouse');
		option.innerHTML = '<svg width="36" height="36" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M192 512c0 35.2 28.8 64 64 64s64-28.8 64-64-28.8-64-64-64-64 28.8-64 64z m255.99999999 0c0 35.2 28.8 64 64.00000001 64.00000001s64-28.8 64.00000001-64.00000001-28.8-64-64.00000001-64.00000001-64 28.8-64.00000001 64.00000001z m256.00000001 0c0 35.2 28.8 64 64 64s64-28.8 64-64-28.8-64-64-64-64 28.8-64 64z" fill="rgb(101, 103, 107)"></path></svg>';
		option.addEventListener('click', (event) => {
			event.stopImmediatePropagation();

			leftsideMenu.on(option, my);
		});
		room.append(option);


		
		const list = createElement('article', 'flex list');
		room.list = list;
		list.tabIndex = -1;
		list.scrollBottom = () => list.scrollTo(0, list.scrollHeight);
		let hasFocus = false;
		function postRead(time = Date.now()) {
			my.lastViewTime = time;
			postMessage({ type: 'READ', roomId: id });
		}
		list.addEventListener('focus', () => {
			hasFocus = true;
			
			// focus??? ????????? ?????? ???????????? ??????
			postRead();
		});
		list.addEventListener('blur', () => hasFocus = false);


		/**
		 * ????????? ??? ???????????? ????????? ????????? ????????????, -1
		 * @param {number} time 
		 * @returns {number} ?????? ?????? ??????
		 */
		function countUnread(time) {
			if(isManager) return my.time < time ? 1 : 0;// ?????? ?????? ??????, ?????? ???????????? ??????
			return participants?.reduce((cnt, participant) => cnt + (participant.lastViewTime < time), 0) || 0;
		}

		room.appendMessage = (message) => {
			// ????????? ?????????, focus??? ????????? ????????? ?????? ???????????? ???????????? ?????????, ????????? ????????? ?????? ??????
			if(hasFocus) postRead(message.time);

			const date = Date.toKST(new Date(message.time));
			message.isMine = (my.id == message.writer);
			
			let item;
			switch(message.type) {
				case 'TEXT':
					item = ChatItem.text(message.isMine, date, message.content);
					item.message = message;
					previewText.textContent = message.content;
					previewTime.textContent = formatRoomDate(date);
					thumbnail.removeAttribute('src');
					break;
				case 'IMAGE':// ~?????? ????????? ????????????.
				case 'LEAVE':
				default:
					return;
			}

			// ????????? message??? ????????? ????????? day divider ??????
			if(diffDays(list.lastElementChild?.message?.time, message.time)) {
				list.append(ChatItem.dayDivider(date));
			}

			// ????????? ?????? ???, ??? ???????????? ????????? ??????
			list.append(item);
			list.scrollBottom();
			room.updateLastViewTime(message.writer, message.time);
		}

		// ??? ???????????? unread count??? preview??? count ??????
		room.updateLastViewTime = (participantId, time) => {
			const participant = participants?.find(participant => participant.id == participantId) || UNKNOWN;
			participant.lastViewTime = time;

			let myUnreadCount = 0;// ?????? ?????? ?????? ??? message ???
			for(const item of list.children) {
				const message = item.message;
				if(!message) continue;
				item.updateCount(countUnread(message.time));
				if(message.time > my.lastViewTime) myUnreadCount++;
			}
			count.textContent = myUnreadCount || '';
		}

		room.deselect = () => {
			if(selectedRoom == room) {
				selectedRoom = null;
				Container.empty();
			}
			room.classList.remove('selected');
		}

		const title = opponent.nickname + ' | FLATTOP';
		room.addEventListener('click', (event) => {
			if(selectedRoom) {
				if(selectedRoom == room) return;// ????????? room??? ????????? room??? ????????? ?????? ????????? ?????? ??????
				selectedRoom.deselect();
			}
			selectedRoom = room;
			selectedRoom.classList.add('selected');

			if(isManager) Container.notifyRoom(opponent.profilePath, opponent.nickname, room, my);
			else Container.room(opponent.profilePath, opponent.nickname, room, my, linkedPost);

			if(event.isTrusted) history.pushState({ roomId: id }, title, '#');
			document.title = title;
		});

		if(id == -1) roomList.prepend(room);
		else roomList.append(room);

		return room;
	}


	//let webSocketState = WebSocket.CONNECTING;

	function postMessage(message) {} // interface

	function handleEvent(event) {
		const data = event.data;
		switch (data.type) {
		case 'WSError':
			console.log(data);
			break;
		case 'WSStateChange':
			webSocketState = data.state;
			break;
		case 'WSInit':
			if(!window.defaultRoomId && selectedRoom) {
				window.defaultRoomId = selectedRoom._id;
			}
			roomList.clear();
			Container.empty();

			data.data.log.forEach((room, roomId) => {
				if(roomId == 'LAST_SAVED_AT') return;

				const roomElement = createRoom(roomId, room);
				room.messages.forEach(message => roomElement.appendMessage(message));
			});
			
			stopLoading(roomList);

			if(window.defaultRoomId) {
				if(!selectRoom(window.defaultRoomId)) {
					Container.empty();
				}
				delete window.defaultRoomId;
			}
			break;
		case 'CREATE':
			const roomData = data.content;
			if(findRoom(roomData.id)) return;
			createRoom(roomData.id, roomData);
			break;
		case 'READ':
			findRoom(data.roomId)?.updateLastViewTime(data.writer, data.time);
			break;
		case 'LEAVE':
			alert('???????????? ???????????? ???????????????.');
			const leavedRoom = findRoom(data.roomId);
			if(leavedRoom) {
				leavedRoom.deselect();
				leavedRoom.remove();
			}
			break;
		default: // message
			findRoom(data.roomId)?.appendMessage(data);
		}
	}

	// SharedWorker, BroadcastChannel ?????? ????????? ?????? ?????? ?????? ??????
	if(window.SharedWorker && window.BroadcastChannel) {
		const worker = new SharedWorker('chatWorker.js?version=1&d=' + d);
		const port = worker.port;

		postMessage = function(message) {
			port.postMessage((typeof message == 'string') ? message : JSON.stringify(message));
		}

		port.addEventListener('message', handleEvent);
		port.start();
		
		const broadcastChannel = new BroadcastChannel("LS-Chat-Channel");
		broadcastChannel.addEventListener("message", handleEvent);
	} else {// wor
		// chatWorker.js?????? BraodcastChannel??? ????????????, ???????????? ??????
		window.BroadcastChannel = class extends EventTarget {
			postMessage(message) {
				const event = new Event('message');
				event.data = message;
				handleEvent(event);
			}
		}

		postMessage = function(message) {
			const event = new Event('message');
			event.data = (typeof message == 'string') ? message : JSON.stringify(message);
			window.dispatchEvent(event);
		}
		loadJs('./chatWorker.js');
	}



	window.addEventListener('popstate', (event) => {
		const state = event.state;
		if(!state || !selectRoom(state.roomId)) {
			if(selectedRoom) selectedRoom.deselect();
			Container.empty();
		}
	});

	window.addEventListener('unload', () => postMessage('close'), { once: true });


	

	/* initialize */
	doLoading(roomList);

	if(__ && __.data && __.user) {
		const requestRoom = createRoom(-1, [__.user], { id: __.postId });
		requestRoom.click();
	} else {
		Container.empty();
	}
})();