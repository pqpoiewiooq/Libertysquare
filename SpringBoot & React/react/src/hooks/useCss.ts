import { useEffect } from "react";


/**
 * href에 해당하는 link가 있으면 생성 x.
 * 
 * ===============================
 * 특정 상황에 기존 css는 없어졌으나 ref에 남아있어서 불러오지 못하는 현상 발견.
 * 따라서 임시적으로 중복체크 코드 주석 처리
 */
function useCss(href: string) {
	// const counter = useRef<Array<{href: String, count: number}>>([]);

	useEffect(
		() => {
			// 중복 체크
			let link : HTMLLinkElement | null = document.querySelector(`link[href="${href}"]`);

			if (!link) {
				link = document.createElement("link");
				link.href = href;
				link.rel = "stylesheet";
				link.type = "text/css";
				document.body.appendChild(link);
			}
			// const find = counter.current.findIndex((item) => item.href == href);
			// if(find >= 0) counter.current[find].count++;
			// else counter.current.push({ href, count: 1 });

			return () => {
				// const find = counter.current.findIndex((item) => item.href == href);
				// if(find)
				// link?.remove();
			};
		},
		[href]
	);
}

export { useCss };