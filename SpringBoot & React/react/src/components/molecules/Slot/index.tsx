import { memo } from 'react';
import styles from './Slot.module.scss';

type SlotProps = {
	title: string;
	desc?: string;
	fullMode?: boolean;
	children?: React.ReactNode;
};

const Slot = ({ title, desc, fullMode, children } : SlotProps) => {
	return (
		<article className={ fullMode ? `${styles.container} ${styles.full}` : styles.container }>
			<section className={styles.head}>
				<div className={styles.title}>{title}</div>
				{ desc && <div className={styles.desc}>{desc}</div> }
			</section>
			<section className={styles.body}>
				{ children }
			</section>
		</article>
	);
};

export default memo(Slot);