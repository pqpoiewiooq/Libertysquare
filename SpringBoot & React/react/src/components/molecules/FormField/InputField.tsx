import React, { useState, useMemo, useCallback } from 'react';
import styles from './FormField.module.scss';
import { Label, ErrorText, Input, InputProps } from 'components/atoms';
import { isEndWithConsonant } from 'utils/TextUtil';

type InputField = {
	title: string;
	required?: boolean;
	onValidate?: Function | ((value?: string) => string | void);
	mode?: "NO_WRAPPER" | "NO_ERROR";

	errorTextInvalid?: string;
	onChange?: (isValid: boolean, value: string) => void | string | boolean;

	inputRef?: React.RefObject<HTMLInputElement> | null;
} & Omit<InputProps, "onChange">;

const createEmptyText = (title: string) => {
	return `${title}${isEndWithConsonant(title) ? '을' : '를'} 입력해 주세요.`;
};

const createInvalidText = (title: string) => {
	return `정확한 ${title}${isEndWithConsonant(title) ? '을' : '를'} 입력해 주세요.`;
};

const InputField = ({ ...props } : InputField ) => {
	const [error, setError] = useState('');

	const emptyText = useMemo(() => createEmptyText(props.title), [props.title]);
	const invalidText = useMemo(() => props.errorTextInvalid || createInvalidText(props.title), [props.title, props.errorTextInvalid]);
	const onChange = useCallback((isValid: boolean, text: string) => {
		if(props.onChange) {
			const result = props.onChange(isValid, text);
			if(typeof result == "boolean") {
				if(result) setError('');
				return result;
			} else {
				if(result) {
					setError(result);
					return false;
				} else {
					return true;
				}   
			}   
		} else {
			if(isValid) {
				const result = props.onValidate?.(text);
				if(result) {
					setError(result);
					return false;
				} else {
					setError('');
					return true;
				}
			} else {
				if(text) setError(invalidText);
				props.onValidate?.();
				return false;
			}
		}
	}, [props.onChange, invalidText]);

	const onEmpty = useCallback(() => {
		setError(emptyText);
		props.onValidate?.();
	}, [emptyText]);
	const empty = typeof props.empty == "boolean" ? props.empty : onEmpty;

	
	const inputProps : InputProps = { ...props, empty, onChange };
	
	return (
		props.mode == "NO_WRAPPER"
		?
		<>
			<Input { ...inputProps } ref={props.inputRef}/>
			<ErrorText text={error} visibility/>
		</>
		:
			props.mode == "NO_ERROR"
			?
			<div className={styles.wrapper}>
				<Label text={ props.title } required={ props.required }/>
				<Input { ...inputProps } ref={props.inputRef}/>
			</div>
			:
			<div className={styles.wrapper}>
				<Label text={ props.title } required={ props.required }/>
				<Input { ...inputProps } ref={props.inputRef}/>
				<ErrorText text={error} visibility/>
			</div>
	)
};

InputField.defaultProps = {
	required: false
};

export default React.memo(InputField);