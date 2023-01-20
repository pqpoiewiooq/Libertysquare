import React, { useRef, useEffect } from 'react';
import styles from './GoogleMap.module.scss';
import { useScript } from 'hooks';

type GoogleMapProps = {
	inputRef: React.RefObject<HTMLInputElement>;
}

const GoogleMap = ({ inputRef } : GoogleMapProps) => {
	const containerRef = useRef<HTMLElement>(null);
	
	const status = useScript(`${process.env.PUBLIC_URL}/js/googlemaps.js`);

	useEffect(() => {
		if(status === "ready" && containerRef.current && inputRef.current) {
			loadGoogleMap(process.env.REACT_APP_GOOGLE_MAP_KEY!, containerRef.current, inputRef.current);
		}
	});

	return <article id={styles.googleMap} ref={containerRef} />
}

export default React.memo(GoogleMap);// google map api를 불러오는 부분이 있어서 memo 필수