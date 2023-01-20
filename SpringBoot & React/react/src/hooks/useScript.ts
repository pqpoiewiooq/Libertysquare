import { useState, useEffect } from "react";

export type ScriptStatus = "loading" | "ready" | "error" | "idle";

const ATTR_NAME = "data-status";

function typeToStatus(type: string) {
	return type === "load" ? "ready" : "error";
}

/**
 * reject : (HTMLScriptElement) => void;
 */
function createScript(src: string, resolve: (event: Event) => void, reject: (script: HTMLScriptElement) => void) : HTMLScriptElement {
	if(src[0] === '/') src = `${process.env.PUBLIC_URL}${src}`;
	let script : HTMLScriptElement | null = document.querySelector(`script[src="${src}"]`);

	if (!script) {// 중복 체크
		script = document.createElement("script");
		script.src = src;
		script.async = true;
		script.setAttribute("data-status", "loading");
		document.body.appendChild(script);

		const setAttributeFromEvent = (event: Event) => {
			script!.setAttribute(ATTR_NAME, typeToStatus(event.type));
			script!.removeEventListener("load", setAttributeFromEvent);
			script!.removeEventListener("error", setAttributeFromEvent);
			resolve(event);
		};

		script.addEventListener("load", setAttributeFromEvent);
		script.addEventListener("error", setAttributeFromEvent);
	} else {
		reject(script);
	}

	return script;
}

/**
 * src에 해당하는 script가 있으면 생성 x.
 * @returns status = "loading" | "ready" | "error"
 */
export function useScript(src: string): ScriptStatus {
	const [status, setStatus] = useState<ScriptStatus>(src ? "loading" : "idle");

	useEffect(
		() => {
			if (!src) {
				setStatus("idle");
				return;
			}

			const script = createScript(
				src 
				, (event) => setStatus(typeToStatus(event.type))
				, (script) => setStatus(script.getAttribute("data-status") as ScriptStatus || "error")
			);

			return () => script.remove();
		},
		[src]
	);

	return status;
}

export function useScriptAll(src: string | Array<string>, callback?: Function): ScriptStatus {
	const [status, setStatus] = useState<ScriptStatus>(src ? "loading" : "idle");

	useEffect(
		() => {
			if (!src) {
				setStatus("idle");
				return;
			}

			const scriptList = Array.isArray(src) ? src : [src];
			const children = new Array<HTMLScriptElement>();

			const injectStack = () => {
				let nextScript = scriptList.shift();
				if(nextScript) {
					const script = createScript(
						nextScript
						, () => scriptList.length <= 1 ? setStatus('ready') : injectStack()
						, injectStack
					);
						// .catch((script) => {
						// 	children.current.push(script);
						// 	injectStack();
						// })
					children.push(script);
				} else {
					const uncompletedSciprt = children.find(script => script.getAttribute(ATTR_NAME) !== "ready");
					setStatus(uncompletedSciprt ? "error" : "ready");
				}
			};

			injectStack();

			return () => children.forEach(script => script.remove());
		},
		[src]
	);

	return status;
}