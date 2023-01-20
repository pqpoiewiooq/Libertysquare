import React from 'react';
import styles from './Disclaimer.module.scss';

const Disclaimer = ({ ...props }) => {
	return (
		<p className={styles.disclaimer}>{props.children}</p>
	)
};

export default React.memo(Disclaimer);