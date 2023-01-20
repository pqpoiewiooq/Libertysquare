import React from 'react';
import { ReactHelmet } from 'components/organisms';
import { Auth } from 'components/templates';
import { InputField } from 'components/molecules';
import { Button, Disclaimer } from 'components/atoms';
import { useRefState, usePreventNavigate, useLocationState } from 'hooks';

const Signup = () => {
	const id = useLocationState("id");
	const [idRef, setId] = useRefState(id);/* eslint-disable-line */
	const onSubmit = usePreventNavigate("/signup-pw");

	return (
		<Auth>
			<ReactHelmet title="회원가입"/>

			<form method="post" onSubmit={onSubmit}>
				<InputField title="휴대폰 번호" name="id" type="phone" autoFocus={true} value={id} disabled={id} required={true} onValidate={setId} />
				
				<Disclaimer>{process.env.REACT_APP_NAME}은 본인인증 대행사인 [NICE평가정보]에서 개인정보를 제공받습니다.</Disclaimer>
				<Button type="submit" buttonStyle="checkplus" color="secondary" text="본인인증" disabled={!id}/>
			</form>
		</Auth>
	);
};

export default React.memo(Signup);