import React, { useEffect } from 'react';

// 한글은 keypress에 잡히지 않음.
export const useKeyFilter = (ref: React.RefObject<HTMLInputElement>, filter?: RegExp) => {
	useEffect(() => {
		const targetElement = ref.current!;

		const listener = (event: KeyboardEvent) => {
			if(filter) {
				if(!filter.test(event.key)) {
					event.preventDefault();
				}
			}
		};
		
		targetElement.addEventListener('keypress', listener);

		return () => targetElement.removeEventListener('keypress', listener);
	}, [ref, filter]);
};