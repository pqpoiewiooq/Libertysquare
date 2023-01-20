import React, { forwardRef, useState, useCallback, useMemo, useRef } from 'react';
import styles from './Input.module.scss';
import { ValidatorType, Validator, mapToValidator } from 'utils/TextUtil';
import { useKeyFilter, useEnter, useForwardedRef } from 'hooks';
import { useEffect } from 'react';

export type InputProps = {
	name: string;
	type?: ValidatorType | Validator;
	confirmAccent?: boolean;

	autoComplete?: string;
	placeholder?: string;

	value?: string;
	defaultValue?: string;

	maxLength?: number;

	autoFocus?: boolean;
	disabled?: boolean;

	onChange?: (isValid: boolean, value: string) => boolean | void;
	onEnter?: EnterEventHandler;
	onInputEnd?: (value: string) => Promise<boolean>;

	empty?: Function | boolean;
	//state?: "normal" | "confirm" | "error" | "disabled";
};

const getClassName = (confirm? : boolean) => `${styles.input} ${confirm === true ? styles.confirm : confirm === false ? styles.error : ''}`;

const Input = forwardRef<HTMLInputElement, InputProps>(({name, type, confirmAccent, autoComplete, placeholder, value, defaultValue, maxLength, autoFocus, disabled, onChange, onInputEnd, onEnter, empty} : InputProps, ref) => {
	const inputRef = useForwardedRef<HTMLInputElement>(ref);
	const text = useRef(value ? value : '');
	const [isValid, setValid] = useState<boolean | undefined>();
	
	const validator : Validator = useMemo(() => typeof type == "object" ? type : mapToValidator(type), [type]);
	const className = getClassName(isValid === true ? confirmAccent ? isValid : undefined : isValid);
	
	useKeyFilter(inputRef, validator.filter);
	useEnter(inputRef, onEnter);

	if(!maxLength) maxLength = validator.maxLength;
	const hookDepth = [text, validator, onChange, empty, maxLength];

	const _changeHandler = useCallback(
		(input: HTMLInputElement) => {
			let value = input.value;

			if(validator.before) {
				value = validator.before(value);
			}

			const length = value.length;

			if(maxLength && length > maxLength) {
				input.value = text.current;
				return;
			}

			let valid = validator.validate(value);
			if(!value) {
				if(empty instanceof Function) {
					empty();
				} else if(empty) valid = true;
			}
			const changed = onChange?.(valid, value);

			if(validator.after) {
				input.value = validator.after(value);
			}

			text.current = value;
			setValid(changed || (changed === undefined ? valid : changed));
		}, hookDepth
	);

	const changeHandler = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			_changeHandler(event.target);
		}, [_changeHandler]
	);

	const inputEndCallback = useCallback(
		async () => {
			if(isValid && text.current && onInputEnd) {
				const result = await onInputEnd(text.current);
				setValid(result);
			}
		}, [onInputEnd, text, isValid]
	);

	useEffect(() => {
		if(inputRef.current) {
			_changeHandler(inputRef.current);
		}
	}, hookDepth);
	
	return (
		<input
			name={name}
			type={validator.type || "text"}
			onChange={changeHandler}
			autoComplete={autoComplete}
			placeholder={placeholder}
			value={value}
			defaultValue={defaultValue}
			className={className}
			autoFocus={autoFocus}
			disabled={disabled}
			onBlur={inputEndCallback}
			// money, num의 경우, Validator.after로 인해 쉼표가 붙어서 일부러 이렇게 설정
			maxLength={(maxLength && (type == "money" || type =="num")) ? maxLength + Math.round(maxLength / 3) - 1 : maxLength}
			ref={inputRef}>
		</input>
	);
});

Input.defaultProps = {
	type: "text",
	autoComplete: "off"
};
export default Input;