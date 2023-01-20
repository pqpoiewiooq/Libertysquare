import React, { useCallback, useRef } from 'react';

type RefStateAction<A> = A | ((prevState: A) => A);

/**
 * useState 처럼 사용하되, state가 아닌, ref를 사용해서 re-rendering 되지 않기 위해 사용.
 * 기본 ref 타입은 string
 */
export function useRefState<T = string>(initialState: T): [React.MutableRefObject<T>, (action?: RefStateAction<T>) => void];
export function useRefState<T = string>(initialState?: T): [React.MutableRefObject<T | undefined>, (action?: RefStateAction<T>) => void];
export function useRefState<T = string>(initialState: T): [React.MutableRefObject<T>, (action?: RefStateAction<T>) => void] {
	const ref = useRef<T>(initialState);

	const callback = useCallback(
		(action?: RefStateAction<T>) => {
			ref.current = (typeof action == "function") ? (action as Function)(ref.current) : action;
		},
		[ref]
	);

	return [ref, callback];
}