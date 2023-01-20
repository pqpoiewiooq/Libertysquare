import React from 'react';
import styles from './Imoji.module.scss';

const Imoji = ({ ...props }) => {

	return (
		<span className={styles.imoji}>{props.children}</span>
	);
};


export default React.memo(Imoji);