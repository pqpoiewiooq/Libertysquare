import styles from './Label.module.scss';

type LabelProps = {
	text: string;
	required?: boolean;
};

const Label = ({ text, required } : LabelProps) => {
	return (
		<div className={required ? `${styles.default} ${styles.required}` : styles.default}>{text}</div>
	);
};

export default Label;