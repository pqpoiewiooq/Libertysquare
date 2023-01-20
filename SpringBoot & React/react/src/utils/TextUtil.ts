/* eslint-disable */

type ValidateFunction = (text: string) => boolean;
const createValidateFunction = (regex: RegExp) : ValidateFunction => {
	return (text: string) => {
		return regex.test(text);
	}
};

type ReplaceFunction = (text: string) => string;
const createReplaceFunction = (searchValue: string | RegExp, replaceValue : string) : ReplaceFunction => {
	return (text: string) => {
		return text.replace(searchValue, replaceValue);
	}
};


// const createFilter = (searchValue: string | RegExp) => createReplaceFunction(searchValue, '');
// export const numberFilter = createFilter(numRegex);

const telRegex = /^0([2-6][1-5]?[2-9]\d{2,3}|10\d{4})\d{4}$/;
export const validateTel = createValidateFunction(telRegex);

const phoneRegex = /^010\d{4}\d{4}$/;
export const validatePhone = createValidateFunction(phoneRegex);

// eslint-disable-next-line
//const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const validateEmail = createValidateFunction(emailRegex);

export const validateNum = createValidateFunction(/[0-9]/g);
export const numFilter = /\d+/;

const hexColorRegex = /^#([0-9a-f]{3}){1,2}$/i;
export const validateHexColor = createValidateFunction(hexColorRegex);
export const hexColorFilter = /[0-9a-f]/;

const replaceNumberBefore = createReplaceFunction(/[^0-9]/g, '');
const replaceNumberAfter = createReplaceFunction(/\B(?=(\d{3})+(?!\d))/g, ',');

const _currency = (value: string | number) => `₩ ${replaceNumberAfter(typeof value === "string" ? value : (value + ""))}`;
/**
 * 금액 접두사 추가
 */
export const currency = (value: string | number) => value == 0 ? "무료" : _currency(value);

const urlRegex = /^((http|https):\/\/)?(www.)?([a-zA-Z0-9]+)\.[a-z]+([a-zA-Z0-9.?#]+)?/;
export const urlFilter = /[^~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}0a-zA-Z0-9]/g;
export const replaceUrl = createReplaceFunction(urlFilter, '');
export const validateUrl = createValidateFunction(urlRegex);

const passwordRegex = /^.*(?=^.{4,16}$).*$/;
export const validatePassword = createValidateFunction(passwordRegex);

export const isEmpty = (text: string) => text ? true : false;

export const isEndWithConsonant = (korStr: string) => {
	const finalChrCode = korStr.charCodeAt(korStr.length - 1);
	const finalConsonantCode = (finalChrCode - 44032) % 28;// 0 = 받침 없음, 그 외 = 받침 있음
	return finalConsonantCode !== 0;
};





// Validator
const ValidatorType = {
	TEL: "tel",
	PHONE: "phone",
	NUM: "num",
	EMAIL: "email",
	MONEY: "money",
	URL: "url",
	TEXT: "text",
	PASSWORD: "password",
} as const;
export type ValidatorType = typeof ValidatorType[keyof typeof ValidatorType];

export type Validator = {
	type?: string;
	before?: ReplaceFunction;
	validate: ValidateFunction;
	after?: ReplaceFunction;
	filter?: RegExp;
	maxLength?: number;
};

export const mapToValidator = (type?: ValidatorType) : Validator => {
	switch(type) {
		case ValidatorType.TEL: 
			return {
				validate: validateTel,
				filter: numFilter,
				maxLength: 11
			}
		case ValidatorType.PHONE: 
			return {
				validate: validatePhone,
				filter: numFilter,
				maxLength: 11
			}
		case ValidatorType.NUM: 
			return {
				before: replaceNumberBefore,
				validate: validateNum,
				filter: numFilter,
				after: replaceNumberAfter,
				maxLength: 9// signed int의 최대 범위가 2,147,483,647 이므로, 최대 자리수에 도달하기 직전 자리 수 까지만 허용
			}
		case ValidatorType.EMAIL: 
			return {
				validate: validateEmail,
				maxLength: 255
			}
		case ValidatorType.MONEY: 
			return {
				before: replaceNumberBefore,
				validate: isEmpty,
				filter: numFilter,
				after: _currency,
				maxLength: 8
			}
		case ValidatorType.URL:
			return {
				before: replaceUrl,
				validate: validateUrl,
				maxLength: 512
			}
		case ValidatorType.TEXT: 
			return {
				validate: isEmpty,
				maxLength: 255
			}
		case ValidatorType.PASSWORD:
			return {
				type: "password",
				validate: validatePassword,
				maxLength: 16
			}
		case undefined:
		default:
			return {
				validate: isEmpty
			}
	}
};



export function generateClassName() {
	return Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 5);
}

export function simpleNickname(nickname: string) {
	const len = nickname.length;
	return len > 2 ? nickname.substring(len - 2) : nickname;
}