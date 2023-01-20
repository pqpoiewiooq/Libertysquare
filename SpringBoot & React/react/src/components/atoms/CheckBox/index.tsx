import React, { forwardRef } from 'react';
import styles from './CheckBox.module.scss';

type CheckBoxProps = {
	name: string;
	tabIndex?: number;
	checked?: boolean;
	defaultChecked?: boolean;
	disabled?: boolean;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const CheckBox = forwardRef<HTMLInputElement, CheckBoxProps>(({name, tabIndex, checked, defaultChecked, disabled, onChange} : CheckBoxProps, ref) => {
	return (
		<input 
			type="checkbox"
			name={name}
			className={styles.checkbox}
			onChange={onChange}
			checked={checked}
			defaultChecked={defaultChecked}
			tabIndex={tabIndex}
			disabled={disabled}
			ref={ref}>
		</input>
	)
});

export default React.memo(CheckBox);