import { memo } from 'react';
import styles from './Step.module.scss';

type StepProps = {
	text: string;
	current?: boolean;
};

const Step = ({ text, current } : StepProps) => {
	let cname = styles.step;
	if(current) cname += ` ${styles.current}`;
	return (
		<span className={cname}>{text}</span>
	);
};

export default memo(Step);