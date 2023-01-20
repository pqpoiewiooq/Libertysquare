/** description
 * WebSocket 통신을 담당하는 SharedWorker
 * 
 * BroadcastChannel - 창, 탭, 프레임 또는 iframe 간 통신을 위함
 */

indexedDB = indexedDB || mozIndexedDB || webkitIndexedDB || msIndexedDB;
IDBTransaction = IDBTransaction || webkitIDBTransaction || msIDBTransaction || {READ_WRITE: "readwrite"};
IDBKeyRange = IDBKeyRange || webkitIDBKeyRange || msIDBKeyRange;

class Database {
	#STORE_NAME = 'log';
	#db;

	/** @param {string} DB_NAME Database Name */
	async connect(DB_NAME) {
		if(!DB_NAME) throw '1 arguments required';
		if(this.#db) Promise.resolve(this.#db);

		/**
		 * @name room
		 * @type {{
				id: RoomId,
				log: Array<Message>,
			}}
		*/
		const VERSION = 1;

		return await new Promise((resolve, reject) => {
			const request = indexedDB.open(DB_NAME, VERSION);

			request.onupgradeneeded = e => {
				const db = e.target.result;
		
				if(!db.objectStoreNames.contains(this.#STORE_NAME)) {
					console.log('create object store');
					db.createObjectStore(this.#STORE_NAME, { keyPath : 'id' });
				}
			}
			
			request.onsuccess = () => {
				this.#db = request.result;
				
				if(this.#db) resolve(this.#db);
				else reject();
			}
			
			request.onerror = reject;
		});
	}

	/**
	 * @param {string} mode 
	 * @returns {IDBObjectStore}
	 */
	store(mode) {
		if(!this.#db) throw '';
		const transaction = this.#db.transaction(this.#STORE_NAME, mode);
		return transaction.objectStore(this.#STORE_NAME);
	}
}


/** types
 * @typedef {number} timestamp long
 * @typedef {string} UUID
 * @typedef {UUID} RoomId
 * @typedef {{
			id: UUID,
			writer: string,
			roomId?: RoomId,
			type: 'TEXT' | 'IMAGE' | 'NOTICE' | 'READ' | 'CREATE',
			content: string,
			time: timestamp,
		}} Message
 * @typedef {{
		id: string,
		lastViewTime: timestamp, 
		nickname: string,
		profilePath: string,
		isOnAlarm: boolean,
	}} Participant
* @typedef {{
		id?: RoomId,
		linkedPostId: number,
		type: 'PUBLIC' | 'PRIVATE' | 'NOTIFICATION',
		participants?: Participant[],
		messages: Message[],
		myParticipantId: string,
		onAlarm: boolean,
	}} Room
* @typedef {Map<RoomId, Room>} Log
*/

/* constants */
const CHANNEL_NAME = 'LS-Chat-Channel';
const WEB_SOCKET_URL = 'wss://chat.libertysquare.co.kr/ws';
const EventType = {
	WS_INIT: 'WSInit',
	WS_STATE_CHANGE: 'WSStateChange',
	WS_ERROR: 'WSError',
}
const UNKNOWN = {
	nickname: '(알 수 없음)',
	profilePath: 'https://ls2020.cafe24.com/img/anonym.png'
};

/*  채팅 기록 - localStorage는 ServiceWorker에서 사용 불가. indexedDB로 변경 */
const Logger = (function() {
	console.log('Retrieving chat log...');

	const LAST_SAVED_AT_ID = 'LAST_SAVED_AT';
	const suffix = self.d || (new URLSearchParams(location.search).get('d'));
	if(!suffix) {
		console.error('Variable d not found');
		self.close();
		return;
	}

	const db = new Database();
	const LOG_NAME = 'ChatIDB_' + suffix;

	/** @type {Log} */
	let dataMap = null;

	/**
	 * dataMap 접근 함수.
	 * @throws IllegalStateException. dataMap이 없을 경우.
	 * @returns {Log}
	 */
	function getDataMap() {
		if(dataMap) return dataMap;
		throw 'IllegalStateException: retreive() first'
	}

	function updateLastSavedAt() {
		const lastSavedAt = (dataMap.get(LAST_SAVED_AT_ID) ? Date.now() : 0);
		const data = {};
		data[LAST_SAVED_AT_ID] = lastSavedAt;

		getDataMap().set(LAST_SAVED_AT_ID, data);
	}

	/**
	 * Deep Copy
	 * @param {Message} message 
	 * @returns {Exclude<Message, 'roomId'>}
	 */
	function copyMessage(message) {
		const copy = { ...message };
		delete copy.roomId;
		return copy;
	}

	function _push(values, value) {
		if(!Array.isArray(values)) throw "argument 1 must be 'Array'";

		const index = values.findIndex(v => v.id == value.id);
		if(index >= 0) values.splice(index, 1, value);
		else values.push(value);
	}

	return Object.freeze({
		/**
		 * @returns {Promise<Log>}
		 */
		retreive: async () => {
			if(!dataMap) {
				await new Promise((reslove, reject) => {
					db.connect(LOG_NAME).then(() => {
						const store = db.store();
						const request = store.openCursor();
						const tempMap = new Map();
						request.onsuccess = (event) => {
							const cursor = event.target.result;
							if(cursor) {// IDBCursorWithValue는 android webview 37~57 버전만 지원해서 cursor.value 사용 불가
								store.get(cursor.key).onsuccess = (e) => {
									const data = e.target.result;
									const roomId = data.id;
									delete data.id;
									tempMap.set(roomId, data);
								}
		
								cursor.continue();
							} else {
								dataMap = tempMap;
								if(!dataMap.get(LAST_SAVED_AT_ID)) updateLastSavedAt();
								reslove();
							}
						}
						request.onerror = reject;
					}).catch(reject);
				});
			}
			return dataMap;
		},
		getLastSavedAt: () => {
			const lastSavedAt = getDataMap().get(LAST_SAVED_AT_ID);
			return lastSavedAt ? (lastSavedAt[LAST_SAVED_AT_ID] || -1) : -1;
		},
		/**
		 * @param {Message} message 
		 */
		pushMessage: (message) => {
			const room = getDataMap().get(message.roomId);
			if(room) {
				let messages = room.messages;
				if(!messages) room.messages = messages = [];

				
				_push(messages, copyMessage(message));
				return true;
			}
			return false;
		},
		/**
		 * @param {RoomId} roomId
		 * @param {Message[]} messages
		 */
		pushMessageAll: (roomId, messages) => {
			if(!Array.isArray(messages)) return false;

			const room = getDataMap().get(roomId);
			if(room) {
				const copy = [];
				for(const message of messages) {
					copy.push(copyMessage(message));
				}

				const messages = room.messages;
				if(messages) {
					copy.forEach(message => _push(messages, message));
				} else {
					room.messages = messages;
				}
				return true;
			}

			return false;
		},
		/**
		 * @param {Required<Room>} data 
		 */
		pushRoomData: (data) => {
			const map = getDataMap();
			
			const roomId = data.id;

			let room = map.get(roomId);
			if(room) {
				data.messages.forEach(message => _push(room.messages, copyMessage(message)));
				room.onAlarm = data.onAlarm;
				room.participants = data.participants;
			} else {
				room = { ...data };
				delete room.id;
				map.set(roomId, room);
			}
		},
		/**
		 * @param {RoomId} roomId 
		 */
		getRoom: (roomId) => getDataMap().get(roomId),
		/**
		 * 현재 기록된 내용들을 저장
		 */
		flush: () => {
			updateLastSavedAt();
			db.connect(LOG_NAME).then(() => {
				const store = db.store('readwrite');

				getDataMap().forEach((/** @type {Room}*/data, id) => {
					const savedData = { ...data, id };
					delete savedData.participants;
					store.put(savedData);
				});
			});
		},
	})
})();

/* BroadcastChannel Settings */
const channel = new BroadcastChannel(CHANNEL_NAME);

/** @type {WebSocket}*/
let ws = null;

function isConnect() {
	return ws && ws.readyState === 1;
}

/**
 * BroadcastChannel Event Dispatcher
 */
const Dispatcher = {
	/**
	 * @template T
	 * @param {BroadcastChannel|MessagePort} [target=]
	 * @param {T} message
	 * @returns {T} message
	 */
	dispatch: (target = channel, message) => {
		target.postMessage(message);
		return message;
	},
	/**
	 * @param {BroadcastChannel|MessagePort} [target=]
	 */
	init: (target = channel, data) =>
		Dispatcher.dispatch(target, { type: EventType.WS_INIT, data })
	,
	/**
	 * @param {BroadcastChannel|MessagePort} [target=]
	 * @param {number} [state=] if no present and WebSocket is null then dispatch -1
	 */
	stateChange: (target = channel, state = (ws instanceof WebSocket ? ws.readyState : -1)) =>
	 	Dispatcher.dispatch(target, { type: EventType.WS_STATE_CHANGE, state })
	,
	/**
	 * @param {BroadcastChannel|MessagePort} [target=]
	 * @param {Message} message
	 */
	message: (target = channel, message) =>
		Dispatcher.dispatch(target, message)
	,
	/**
	 * @param {BroadcastChannel|MessagePort} [target=]
	 * @param {Error} error
	 */
	error: (target = channel, error) =>
		Dispatcher.dispatch(target, { type: EventType.WS_ERROR, error })
	,
}

/**
 * @param {Room} room 
 * @param {Participant['id']} participantId 
 * @returns {Participant}
 */
function matchParticipant(room, participantId) {
	if(!room) return UNKNOWN;
	
	const participants = room.participants;
	if(!participants) return UNKNOWN;

	return participants.find(p => p.id == participantId) || UNKNOWN;
}

/**
 * message handler to WebSocket
 * @param {Required<Message>} message 
 */
function handleChatMessage(message) {
	if(message.type == 'CREATE') {
		const createdRoomData = JSON.parse(message.content);
		Logger.pushRoomData(createdRoomData);
		Logger.flush();

		// 직접 개설한 방은 main(ui) thread로 알리지 않음.
		if(createdRoomData.writer != createdRoomData.myParticipantId) {
			Dispatcher.message(channel, {
				type: 'CREATE',
				content: createdRoomData
			});
		}
		return;
	}

	const room = Logger.getRoom(message.roomId);
	const participant = matchParticipant(room, message.writer);

	switch(message.type) {
		case 'TEXT':
		case 'IMAGE':
		case 'NOTICE':
			Logger.pushMessage(message);
	
			// 데이터 가공(nickname 및 profilePath 설정)
			message.nickname = participant.nickname;
			message.profilePath = participant.profilePath;
			if(participant.id == room.myParticipantId) message.isMine = true;
			break;
		case 'READ':
			participant.lastViewTime = message.time;
			break;
		case 'LEAVE':
			break;
		default:
			console.error('invalid message type.' + message);
			return;
	}
	
	Dispatcher.message(channel, message);
}

async function connect() {
	if(ws) return;
	
	await Logger.retreive();
	await new Promise((resolve, reject) => {
		ws = new WebSocket(WEB_SOCKET_URL + '?dt=' + Logger.getLastSavedAt());
		ws.onopen = () => {
			Dispatcher.stateChange();
			resolve();
		}
		ws.onclose = () => {
			Dispatcher.stateChange();
			ws = null;
			Logger.flush();
		}
		ws.onmessage = (event) => {
			// 초기 데이터 정리
			const rooms = JSON.parse(event.data);
			rooms.forEach(room => Logger.pushRoomData(room));
			Logger.flush();

			Logger.retreive().then(dataMap => {
				Dispatcher.init(channel, { log: dataMap });
			});

			// setting message controll method
			ws.onmessage = (e) => {
				const data = JSON.parse(e.data);
				handleChatMessage(data);
			}
		}
		ws.onerror = (event) => {
			console.log(event);
			Dispatcher.error(channel, event.data);
			resolve();
		}
	});
	return ws;
}

async function handleMessage(event) {
	const data = event.data;
	if(data) {
		if(data == 'close') {
			Logger.flush();
		} else {
			if(!isConnect()) await connect();// 연결 끊어졌을 경우 대비
			ws.send(data);
		}
	}
}

channel.addEventListener('message', handleMessage);

// typeof null === 'object'
if(typeof window == 'undefined' && self.SharedWorkerGlobalScope) {// Shared Worker
	console.log('Running on Shared Worker');

	addEventListener('connect', async function(e) {
		const port = e.ports[0];
	
		port.addEventListener('message', handleMessage);
	
		port.start();
		Dispatcher.stateChange(port);
		if(!isConnect()) await connect();
	});
} else {
	/**
	 * Native.
	 * Worker는 작업에 적합하지 않음.
	 * Shared Worker 미지원시, 위 코드를 직접 실행하기 위해, 필요 코드 추가 및 설정
	 */
	console.log('Running on vanila');

	self.addEventListener('message', handleMessage);
	Dispatcher.stateChange();
	if(!isConnect()) connect();
}