import React, { useCallback } from 'react';
import styles from './HashtagItem.module.scss';

type HashtagItemProps = {
	value: string;
	onClick?: (value: string) => void;
}

const HashtagItem = ({ value, onClick } : HashtagItemProps) => {

	const onClickListener = useCallback(
		(event: React.MouseEvent<HTMLSpanElement>) => {
			event.preventDefault();

			onClick?.(value);
		}, [value, onClick]
	);

	return (
		<span className={styles.hashtag} onClick={onClickListener}>{value}</span>
	);
};

export default React.memo(HashtagItem);