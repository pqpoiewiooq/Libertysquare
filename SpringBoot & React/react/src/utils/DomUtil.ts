import { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';

export function renderToHTMLElement(element: ReactElement) {
	const html = renderToString(element);
	
	const parent = document.createElement("div");
	parent.innerHTML = html;

	return parent.children[0] as HTMLElement;
}

export function loadJs(src: string, onLoad: (ev: HTMLElementEventMap['load']) => any) {
    let js = document.createElement("script");
    js.type = "text/javascript";
    js.src = src;
    if(typeof(onLoad) === "function") {
        js.addEventListener('load', onLoad);
    }
    document.body.appendChild(js);
}

const DomUtil = { renderToHTMLElement, loadJs };
export default DomUtil;