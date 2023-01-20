import { memo } from 'react';
import styles from './ErrorText.module.scss';

type ErrorTextProps = {
	text?: string;
	hidden?: boolean;
	visibility: boolean;
};

const ErrorText = ({ text, hidden, visibility } : ErrorTextProps) => {
	return (
		<div className={hidden ? `${styles.error} ${styles.hidden}` : styles.error }>{visibility && text}</div>
	);
};

ErrorText.defaultProps = {
	hidden: false,
	visibility: true,
};

export default memo(ErrorText);