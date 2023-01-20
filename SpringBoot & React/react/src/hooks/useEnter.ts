import React, { useCallback } from 'react';
import { useEventListener } from './useEventListener';

export const useEnter = (enter: React.RefObject<HTMLElement>, trigger?: EnterEventHandler) => {
	useEventListener(
		'keypress',
		useCallback((event: KeyboardEvent) => {
			if(event.key === 'Enter') {
				//(event.currentTarget as HTMLElement).blur();
				trigger?.(event);
			}
		}, [trigger]),
		enter
	);
};