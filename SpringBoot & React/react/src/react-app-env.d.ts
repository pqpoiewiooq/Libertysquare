/// <reference types="react-scripts" />

/* axios 타입 추출 */
type AxiosResponse<T = any, D = any> = import('axios').AxiosResponse<T, D>;
// type ExtractAxios<T extends (...args: any) => Promise<any>> = T extends (...args: any) => Promise<infer R> ? R : any;
// type AxiosReturnType<T extends AxiosResponse<any, any>> = T extends AxiosResponse<infer R, any> ? R : null;
/**
 * axios promise를 return하는 함수에서 AxiosResponse의 Data 타입 추출
 * @generic (...args) => Promise<AxiosResponse<{Extract}, ?>>
 */
type AxiosDataType<T extends (...args: any) => Promise<AxiosResponse<any, any>>> = T extends (...args: any) => Promise<AxiosResponse<infer R, any>> ? R : any;

type PartialPick<T, K extends keyof T> = Partial<Pick<T, K>>;
type AxiosError = import("axios").AxiosError & { alert: (message) => void };


/* ETC */
type _Date = string;//yyyy-MM-dd HH:mm
type EnterEventHandler = Function | ((event: KeyboardEvent) => void);

type RootState = import("./store/reducers").RootState;


/* Member */
type Member = {
	id: string;
	pw: string;
	name: string;
	nickname: string;
	birth: string;
	gender: string;
	national: string;
	di: string;
	mobileCorp: string;
	profilePath: string;
}

type MemberInfo = Pick<Member, 'id' | 'nickname' | 'profilePath'>;
type SignUpParams = Omit<Member, 'nickname' | 'profilePath'>;
type LoginParams = Pick<Member, 'id' | 'pw'>;
type ProfileUpdateParams = Pick<Member, 'nickname'> & PartialPick<Member, 'profilePath'>;
type PasswordUpdateParams = {
	currentPw: string;
	newPw: string;
};

type Authenticate = {
	refreshToken: string;
	accessToken: string;
}

/* Organization */
type Organizer = {
	id: string,
	nickname: string
};

type Organization = {
	id: number;
	name: string;
	simpleIntroduce?: string;

	introduce: string;
	coverPath: string;
	profilePath: string;

	venue: string;
	detailVenue: string;
	since: _Date;//yyyy-MM-dd
	themeColor: string;

	organizer: Array<Organizer>;

	hasSubscribed: boolean;
	subscribeCount: number;
	hostedEventCount: number;
	totalAttendee: number;
}
type SimpleOrganization = Pick<Organization, 'id' | 'name' | 'simpleIntroduce' | 'themeColor' | 'coverPath' | 'profilePath'>;
type OrganizationCreateParams = Pick<Organization, "name" | "simpleIntroduce"> & { organizer: Array<string> };

/* Event */
type MyEventType = "INSIDE" | "OUTSIDE";
type MyEvent = {
	id: number;
	title: string;
	dtStart: _Date;
	dtEnd: _Date;
	hashtag?: Array<string>;
	isOnline: boolean;

	coverPath: string;
	isPublic: boolean;
	type: MyEventType;
	applyLink?: string;
	contactEmail?: string;
	contactTel?: string;
	category: Array<string>;
	genre: string;
	venue: string;
	detailVenue: string;
	venueDescription?: string;
	content: string;

	ticket?: Array<EventTicket>;
	organization: Pick<Organization, 'id' | 'name'>;
};
type SimpleMyEvent = Pick<MyEvent, 'id' | 'title' | 'dtStart' | 'coverPath'>;
type AffiliatedOrganizationEventList = Array<{ organization: Pick<Organization, 'id' | 'name'>, event: Array<SimpleMyEvent>}>;
type DetailEventList = Array<Pick<MyEvent, 'organization' | 'type' | 'ticket' | keyof SimpleMyEvent>>;

// 공통 - 시작날짜, 아이디, 사진, 제목
// 메인페이지 - Array<날짜, 사진, 제목, 온/오프, 해시태그>
// 주최한 이벤트 - 시작 날짜, 사진, 제목
// 내 티켓 - 시작 날짜, 사진, 제목, 호스트 이름 및 아이디
// 리스팅 페이지 - 시작 날짜, 사진, 제목, 내외부(타입) / 호스트 이름 및아이디  / 가격
// 호스트 페이지 - 시작 날짜, 사진, 제목, 내외부(타입) / 호스트 이름  / 가격, 참가자수

type TicketType = "FCFS" | "SELECTION";
type EventTicket = {
	id?: number;
	personnel?: number;

	type: TicketType;
	name: string;
	description?: string;
	price: number;
	quantity?: number;
	stock?: number;
	hideStock: boolean;
	purchaseLimit: number;
	startDateTime: _Date;
	endDateTime: _Date;
	refundDeadline: _Date;
}

type DetailEvent = {
	event: MyEvent;
	organization: Organization;
	ticket: Array<EventTicket>;
}

// dropdown setting
type Dropdown = any;

type DropdownOption = {[key in string]: string} | Array<string>;
type DropdownStyle = string | {[attr in string] : string};
type DropdownConfig = {
	option: DropdownOption;
	style?: DropdownStyle;
	scroll?: number;
	class?: Array<string>;
	init?: boolean;
	hideMode?: boolean;
	defaultValue?: string;
};

var DropdownConfigs = {
	time_half: DropdownOption,
	category_event: DropdownOption,
	genre_event: DropdownOptions
};

type DropdownOptionObject = { text: string, value: string };
interface DropdownEvent {
	preventDefault(): void;
	detail: {
		target: HTMLElement,
		dropdown: Dropdown,
		before: DropdownOptionObject,
		after: DropdownOptionObject
	}
}
type DropdownEventType = "optionchange" | "optionselect" | "optioninit";
type DropdownEventListener = (event: DropdownEvent) => void;

declare interface HTMLDivElement {
	dropdown: (config: DropdownConfig) => void;
	_dropdown?: Dropdown;
	value?: any;
	addEventListener(type: DropdownEventType, listener: DropdownEventListener): void;
	removeEventListener(type: DropdownEventType, listener: DropdownEventListener): void;
}

// flatpickr 세팅
var flatpickr = any;
declare interface HTMLInputElement {
	_flatpickr: any;
}

// googlemap 세팅
function loadGoogleMap(key: string, container: HTMLElement, input: HTMLInputElement) : void;


/* tinymce 세팅 */
var tinymce = any;

/* tinymce 세팅 */
interface TinymceEditor {
	getContent: () => string;
	contentDocument: {
		images: HTMLCollection
	};
}

/* imageUploader 세팅 */
type ImageUploaderOption = {
	aspectRatio: number;
	width: number;
	height?: number;
	processor: (blob: File | Blob) => void;
	giflib: string;
	button: Element,
	loading: Element
}
function imageUploader(elem: HTMLElement, option: ImageUploaderOption) : void;
declare interface HTMLDivElement {
	_imageUploader?: any;
}

/* TossPayments 세팅 */
declare var TossPayments = any;


/* JS 기본 함수 재정의 */

// declare function isNaN(number: number): boolean;
// 어째서 number 타입만 args로 넘겨줄 수 있도록 타입을 설정해놨는지는 모르겠어서 재정의.
declare function isNaN(arg: any): boolean;

// DateUtil의 replacer function의 반환값이 number가 되지 않아서 재정의
declare interface String {
	replace(searchValue: string | RegExp, replacer: (s: string) => string | number): string;
}


/*** module 재정의 ***/

// useParams hook의 결과값이 string만 가능해서, 숫자도 받을 수 있게 변경
// declare module 'react-router' {
// 	type ParamValue = string | number;

// 	export type Params<Key extends ParamValue> = {
// 		readonly [key in string]?: Key;
// 	};
// 	export function useParams<Key extends ParamValue = string>(): Readonly<Params<Key>>;
// }
//// 위 내용이 의도대로 되지 않아서 아래처럼 별도 타입 정의.
//// const params = useParams() as Params<타입> 형식으로 사용
type Params<Value extends string | number = string> = {
	readonly [key in string]?: Value;
}