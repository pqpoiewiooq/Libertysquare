import React from 'react';
import styles from './ContentCard.module.scss';
import { Link } from 'react-router-dom';
import { Img } from 'components/atoms';

export type ContentCardProps = {
	to: string;
	src: string;
	extraText?: string;
	title: string;

	about: {
		text: string;
		to: string;
	}
};

const ContentCard = ({ to, src, extraText, title, about } : ContentCardProps) => {
	return (
		<Link className={styles.card} to={to}>
			<div className={styles.inner}>
				<div className={styles.head}>
					<Img className={styles.img} src={src}/>
				</div>
				<div className={styles.body}>
					{ extraText && <span className={styles.extra}>{extraText}</span> }
					<h3 className={styles.title}>{title}</h3>
					<Link className={styles.link} to={about.to}>{about.text}</Link>
				</div>
			</div>
		</Link>
	);
};

export default React.memo(ContentCard);