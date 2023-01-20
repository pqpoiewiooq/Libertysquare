import React from 'react';
import styles from './ContentCardWide.module.scss';
import { Link } from 'react-router-dom';
import { Svg } from 'components/atoms';
import { currency } from 'utils/TextUtil';

export type ContentCardWideProps = {
	to: string;
	src: string;
	extraText?: string;
	title: string;
	provider: string;

	personnel: number;
	price: string;
};

const ContentCardWide = ({ to, src, extraText, title, provider, personnel, price } : ContentCardWideProps) => {
	const imgStyle = {
		background: `background: url(${src}) center center / cover no-repeat"`
	};
	return (
		<Link className={styles.item} to={to}>
			<div className={styles.head}>
				<div className={styles.img} style={imgStyle}></div>
				<div className={styles.cover}>
					<div className={styles['cover-inner']}>
						<span className={styles['cover-text']}>
							<svg viewBox="0 0 640 512" height="1.33em" width="1.33em" aria-hidden="true" focusable="false" fill="currentColor" style={{verticalAlign: "-0.3em"}}>
								<path fill="currentColor" d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path>
							</svg>
							<span>&nbsp;{personnel}</span>
						</span>
						<span className={styles['cover-text']} style={{ marginLeft: "auto" }}>{price}</span>
					</div>
				</div>
			</div>
			<div className={styles.body}>
				<div className={styles.extra}>{extraText}</div>
				<div className={styles.title}>{title}</div>
				<span className={styles.provider}>{provider}</span>
			</div>
		</Link>
	);
};

export default React.memo(ContentCardWide);