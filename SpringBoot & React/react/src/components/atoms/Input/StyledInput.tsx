import React, { forwardRef } from 'react';
import styles from './Input.module.scss';

type StyledInputProps = {
	confirm?: boolean;
} & React.HTMLProps<HTMLInputElement>;

const getClassName = (confirm? : boolean) => `${styles.input} ${styles.styled} ${confirm === true ? styles.confirm : confirm === false ? styles.error : ''}`;

const StyledInput = forwardRef<HTMLInputElement, StyledInputProps>((props, ref) => {
	const className = props.className ? `${getClassName(props.confirm)} ${props.className}` : getClassName(props.confirm);
	return (
		<input className={className} ref={ref} />
	);
});

export default React.memo(StyledInput);