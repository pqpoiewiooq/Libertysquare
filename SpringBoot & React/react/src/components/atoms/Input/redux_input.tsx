import React, { useState, useCallback } from 'react';
import styles from './Input.module.scss';
import { useDispatch } from 'react-redux';


export type InputProps = {
	name: string;
	action: Function;
	autoComplete?: string;
	placeholder?: string;

	min?: number;
	max?: number;

	autoFocus?: boolean;
	disabled?: boolean;
	//state?: "normal" | "confirm" | "error" | "disabled";
};

const Input = ({name, action, autoComplete, placeholder, autoFocus, disabled} : InputProps) => {
	const dispatch = useDispatch();
	const [text, setInputValue] = useState('');

	const onChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			e.preventDefault();
			const result = dispatch(action(e.target.value));
			if(result.changed) setInputValue(result.text);
		},
		[text]
	);

	return (
		<input
			name={name}
			onChange={onChange}
			autoComplete={autoComplete}
			placeholder={placeholder}
			className={styles.input}
			autoFocus={autoFocus}
			disabled={disabled}>
		</input>
	);
};

Input.defaultProps = {
	type: "text",
	state: "normal"
};

export default React.memo(Input);








