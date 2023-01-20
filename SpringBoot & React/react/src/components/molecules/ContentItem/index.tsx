import React from 'react';
import styles from './ContentItem.module.scss';
import { Link } from 'react-router-dom';
import { Img } from 'components/atoms';

export type ContentItemProps = {
	to: string;
	src: string;
	extraText: string;
	title: string;
	tag?: string;

	expired?: boolean;
};

const ContentItem = ({ to, src, extraText, title, tag, expired } : ContentItemProps) => {
	return (
		<Link className={expired ? `${styles.box} ${styles.expired}` : styles.box} to={to}>
			<div className={styles['img-wrapper']}>
				<Img className={styles.img} src={src}/>
			</div>
			<div className={styles.body}>
				<div className={styles['extra-text']}>{extraText}</div>
				<div className={styles.title}>{title}</div>
				<div className={styles.tag}>{tag}</div>
			</div>
		</Link>
	);
};

export default React.memo(ContentItem);