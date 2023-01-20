import { RefObject, useEffect, useRef } from 'react'

type EventHandler<K extends keyof HTMLElementEventMap> = (ev: HTMLElementEventMap[K]) => any;

export function useEventListener
	<K extends keyof HTMLElementEventMap, T extends HTMLElement>
	(type: K, handler: (ev: HTMLElementEventMap[K]) => any, element?: RefObject<T>) {

	const savedHandler = useRef<EventHandler<K>>();

	useEffect(() => {
		const targetElement: T | Window = element?.current || window
		if (!(targetElement && targetElement.addEventListener)) {
			return
		}

		if (savedHandler.current !== handler) {
			savedHandler.current = handler
		}

		const eventListener = (event: Event) => {
			if (!!savedHandler?.current) {
				savedHandler.current(event as HTMLElementEventMap[K])
			}
		}

		targetElement.addEventListener(type, eventListener)

		return () => {
			targetElement.removeEventListener(type, eventListener)
		}
	}, [type, element, handler])
}