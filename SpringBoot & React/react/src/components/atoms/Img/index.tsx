import React, { useState, useCallback } from 'react';
import styles from './Img.module.scss';

export type ImgProps = {
	className?: string;
	style?: React.CSSProperties;
	src: string;
	alt?: string;
};

const Img = ({ className, style, src, alt } : ImgProps) => {
	const [loaded, setLoaded] = useState(false);

	const onLoad = useCallback(() => {
		setLoaded(true);
	}, [loaded]);

	return <>
		<img className={className} style={style} loading="eager" alt={alt} src={src} onLoad={onLoad} onError={onLoad} />
		{
			loaded
		?
			null
		:
			<div /* className={styles['loading-container']} */ >
				<div className={styles.loader}></div>
			</div>
		}
	</>
};

Img.defaultProps = {
	alt: "이미지"
}

export default React.memo(Img);