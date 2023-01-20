import React, { forwardRef } from 'react';
import styles from './RadioButton.module.scss';

type RadioButtonProps = {
	name: string;
	tabIndex?: number;
	checked?: boolean;
	defaultChecked?: boolean;
	disabled?: boolean;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;

	text: string;
};

const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(({name, tabIndex, checked, defaultChecked, disabled, onChange, text} : RadioButtonProps, ref) => {
	return (
		<label className={styles.wrapper}>
			<input 
				type="radio"
				name={name}
				className={styles.radio}
				onChange={onChange}
				checked={checked}
				defaultChecked={defaultChecked}
				tabIndex={tabIndex}
				disabled={disabled}
				ref={ref}>
			</input>
			<span className={styles.label}>{text}</span>
		</label>
	)
});

export default React.memo(RadioButton);