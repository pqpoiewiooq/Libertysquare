import React, { useRef, useState, useMemo, useCallback } from 'react';
import styles from './StarRating.module.scss';
import { Star } from 'components/atoms';

const amount = 5;

type StarRateProps = {
	onChange?: Function;
};

function renderStarRatePart(s: number) {
	let result = [];
	for(let i = 0; i < amount; i++) {
		let check = (i + 1) * 2;
		result.push(<Star rating={(s >= check) ? 100 : ((s >= check - 1) ? 50 : 0)} key={i}/>);
	}
	return result;
}

const StarRate = ({ onChange } : StarRateProps) => {
	const wrapper = useRef<HTMLDivElement>(null);

	const score = useRef(0);
	const [tempScore, setTempScore] = useState(score.current);
	
	const find = useCallback((x : number) => {
		if(wrapper?.current) {
			let clientRect = wrapper.current.getBoundingClientRect();
			let left = clientRect.left;
			let divider = clientRect.width / 10;
			let mlist = [];
			for(let i=0;i<10;i++) mlist.push(left + ( divider * i));
			
			for(let i = 9 ; i >= 0 ; i--){
				if(x >= mlist[i])
					return i + 1;
			}
		}
		
		return 0;
	}, []);

	const setStarRate = useCallback((current : number, keep? : boolean) => {
		setTempScore(current);
		
		if(keep === true) {
			score.current = current;
			if(onChange) onChange(score.current);
		}
	}, []);

	const mouseHandler = useCallback((event : React.MouseEvent, keep? : boolean) => {
		const x = event.pageX | event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		
		setStarRate(find(x), keep);
	}, []);

	const starRateParts = useMemo(() => {
		return renderStarRatePart(tempScore);
	}, [tempScore]);

	return (
		<div className={styles.wrapper} ref={wrapper} onMouseMove={useCallback((e) => mouseHandler(e, false), [])} onMouseLeave={useCallback(() => setStarRate(score.current), [])} onClick={useCallback((e) => mouseHandler(e, true), [])}>
			{starRateParts}
		</div>
	);
};

export default React.memo(StarRate);