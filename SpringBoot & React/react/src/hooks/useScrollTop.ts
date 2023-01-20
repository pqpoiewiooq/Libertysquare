import { useCallback } from 'react';

type ScrollTopOption = {
	smooth?: boolean;
	focus?: boolean;
	alert?: string;
}

export function useScrollTop(defaultOption: ScrollTopOption = { smooth: true, focus: false }) {
	return useCallback((target: HTMLElement, option?: ScrollTopOption) => {
		if(!option) option = defaultOption;
		if(option.alert) alert(option.alert);

		let abTop = target.getBoundingClientRect().top + window.pageYOffset - 29;
		if(!option) option = defaultOption;

		window.scrollTo({ left: 0, top: abTop, behavior: option.smooth ? 'smooth' : undefined });
		if(option.focus) target.focus();
	}, [defaultOption]);
}