import React, { useState, useRef, useCallback } from 'react';
import { ErrorText } from 'components/atoms';
import { InputField } from 'components/molecules';

type ContactFieldProps = {
	onChange?: (contact?: { tel: string, email: string }) => void;
};

const ContactField = React.forwardRef<HTMLInputElement, ContactFieldProps>(({ onChange }, ref) => {
	const [error, setError] = useState<string>();

	const tel = useRef({isValid: false, value: ''});
	const email = useRef({isValid: false, value: ''});
	const onContactChange = useCallback(() => {
		const isEmptyTel = !tel.current.value;
		const isEmptyEmail = !email.current.value;
		if(isEmptyEmail && isEmptyTel) {
			setError("연락처는 최소 한 개 이상 입력해야 합니다.");
		} else {
			const emailFlag = !email.current.isValid;
			const telFlag = !tel.current.isValid;
			if(!isEmptyEmail && !isEmptyTel) {
				if(emailFlag && telFlag) {
					setError("정확한 이메일과 전화번호를 입력해 주세요");
				} else if(emailFlag) {
					setError("정확한 이메일을 입력해 주세요");
				} else if(telFlag) {
					setError("정확한 전화번호를 입력해 주세요");
				} else {
					setError(undefined);
					onChange?.({ tel: tel.current.value, email: email.current.value });
					return;
				}
			} else if(isEmptyEmail && telFlag) {
				setError("정확한 전화번호를 입력해 주세요");
			} else if(isEmptyTel && emailFlag) {
				setError("정확한 이메일을 입력해 주세요");
			} else {
				setError(undefined);
				onChange?.({ tel: tel.current.value, email: email.current.value });
				return;
			}
		}
		onChange?.();
	}, [tel, email]);
	const onTelChange = useCallback((isValid: boolean, value: string) => {
		tel.current = { isValid, value };
		onContactChange();
		return isValid;
	}, [tel, onContactChange]);
	const onEmailChange = useCallback((isValid: boolean, value: string) => {
		email.current = { isValid, value };
		onContactChange();
		return isValid;
	}, [email, onContactChange]);
	
	const empty = (tel.current.value || email.current.value) ? true : false;
	
	return (
		<>
			<InputField
				title="이메일"
				name="email"
				type="email"
				placeholder="이메일 주소를 입력해 주세요."
				onChange={onEmailChange}
				empty={empty}
				mode="NO_ERROR"
				inputRef={ref as React.RefObject<HTMLInputElement>}/>
			<InputField
				title="전화번호"
				name="tel"
				type="tel"
				placeholder="전화번호를 입력해 주세요."
				onChange={onTelChange}
				empty={empty}
				mode="NO_ERROR"/>
			<ErrorText text={error} visibility/>
		</>
	)
});

export default React.memo(ContactField);