import React, { useCallback } from 'react';
import styles from './PreviewItem.module.scss';

export type PreviewItemProps = {
	text: string;
	clickable?: boolean;
	index?: number;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>, key?: number) => void;
};

const PreviewItem = ({text, clickable, index, onClick} : PreviewItemProps) => {
	const onClickHandler = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			onClick?.(event, index);
		}, [onClick, index]
	);

	return (
		<button 
			type="button"
			className={clickable ? `${styles.item} ${styles.clickable}` : styles.item}
			onClick={onClickHandler}>
				{text}
		</button>
	)
};

export default PreviewItem;