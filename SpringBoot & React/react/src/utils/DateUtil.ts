export function twoDigit(num: number): number | string {
	return (num >= 10) ? num : `0${num}`;
}

export function toDate(str: string) {
	str = str.replace(/\.[0-9]/g, '')
	return new Date(str.replace(/-/g, '/'));
}

/**
 * @tutorial week_ko[date.getDay()]
 */
export const week_ko = ["일", "월", "화", "수", "목", "금", "토"];
//export const fullWeek_ko = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

export const format = function(date: Date, f: string) {
	if (!date) return "";
	 
	return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a)/gi, function($1) {
		switch ($1) {
			case "yyyy": return date.getFullYear();
			case "yy": return twoDigit(date.getFullYear() % 1000);
			case "MM": return twoDigit(date.getMonth() + 1);
			case "dd": return twoDigit(date.getDate());
			case "E": return week_ko[date.getDay()];
			case "HH": return twoDigit(date.getHours());
			case "hh":
				let h = date.getHours() % 12;
				return h ? twoDigit(h) : 12;
			case "mm": return twoDigit(date.getMinutes());
			case "ss": return twoDigit(date.getSeconds());
			case "a": return date.getHours() < 12 ? "오전" : "오후";
			default: return $1;
		}
	});
};





export function wasExpired(date : Date) {
	let current = new Date();
	
	return !(current < date);
}

export function dateFormat(str: string, isOnline: boolean) {
	const date = toDate(str);

	const formatDate = format(date, "yyyy-MM-dd");
	let a = week_ko[date.getDay()];

	return `${formatDate} (${a}) · ${isOnline ? "온라인" : "오프라인"}`;
}

// KK 대신, 타임존이 한국이라고 가정하고, HH로 설정
export function termFormat(lhs: Date, rhs: Date) {
	let result = format(lhs, "yyyy년 MM월 dd일 (E) a hh:mm\n- ");
	
	if(lhs.getFullYear() === rhs.getFullYear()) {
		if(lhs.getMonth() === rhs.getMonth()) {
			if(lhs.getDay() === rhs.getDay()) {
				result = format(lhs, "yyyy년 MM월 dd일 (E)\na hh:mm - ") + format(rhs, "a hh:mm");
			} else {
				result += format(rhs, "dd일 (E) a hh:mm");
			}
		} else {
			result += format(rhs, "MM월 dd일 (E) a hh:mm");
		}
	} else {
		result += format(rhs, "yyyy년 MM월 dd일 (E) a hh:mm");
	}

	return result;
}

export function sinceFormat(date: Date) {
	return format(date, "Since yyyy년 MM월 dd일");
}

export function fullFormat(date: Date) {
	return format(date, "yyyy년 MM월 dd일 a hh:mm")
}

export function simpleFormat(date: Date) {
	let current = new Date();

	if(current.getFullYear() === date.getFullYear()) {
		return format(date, "MM월 dd일 (E)");
	} else {
		return format(date, "yyyy년 MM월 dd일 (E)")
	}
}



export function term(date: Date) : number;
export function term(lhs: Date, rhs?: Date) : number {
	if(!rhs) rhs = new Date();
	
	const day = 24 * 60 * 60 * 1000;
	const cal = lhs.getTime() - rhs.getTime();

	return Math.floor(Math.abs(cal / day));
}




export class DateTime {
	date: Date;
	time: string;

	/**
	 * 0 ~ 29 = 00
	 * 30 ~   = 30
	 */
	private floor(num: number): string {
		return num >= 30 ? '30' : '00';
	}

	constructor(date?: Date, time?: string) {
		if(date && date instanceof Date) {
			this.date = date;
		} else {
			this.date = new Date();
			this.date.setDate(this.date.getDate() + 1);
		}
		
		if(time && DateTime.isTime(time)) {
			this.time = time;
		} else {
			let hours = twoDigit(this.date.getHours());
			let minutes = this.floor(this.date.getMinutes());
			this.time = `${hours}:${minutes}`;
		}

		this.toString = this.toString.bind(this);
	}

	/**
	 * HH:mm 형식이 맞는지 확인
	 * @returns boolean
	 */
	static isTime = function(time: string) {
		return (/(0[1-9]|1[0-9]|2[0-4]):([0-5][0-9])/.test(time));
	}

	/**
	 * @returns string to 'yyyy-MM-dd HH:mm'
	 */
	toString() {
		if(!(this.date instanceof Date)) return;
		if(!DateTime.isTime(this.time)) return;

		let year = this.date.getFullYear();
		let month = twoDigit((this.date.getMonth() + 1));
		let day = twoDigit(this.date.getDate());

		return `${year}-${month}-${day} ${this.time}`;
	}
};