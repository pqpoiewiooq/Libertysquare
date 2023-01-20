import React from 'react';
import styles from './PreviewWrapper.module.scss';

type PreviewWrapperProps = {
	title?: string;
	desc?: string;
	mode?: "small" | "page";
	children?: React.ReactNode;
};

const PreviewWrapper = React.forwardRef<HTMLDivElement, PreviewWrapperProps>(({ title, desc, mode, children }, ref) => {
	return (
		<div className={mode ? `${styles.wrapper} ${styles[mode]}` : styles.wrapper} ref={ref}>
			{ title && <div className={styles.title}>{title}</div> }
			{ desc && <div className={styles.desc}>{desc}</div> }
			{ children }
		</div>
	);
});

export default React.memo(PreviewWrapper);