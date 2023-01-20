import React, { useCallback } from 'react';
import { ReactHelmet } from 'components/organisms';
import { Auth } from 'components/templates';
import { InputField } from 'components/molecules';
import { Button, Disclaimer } from 'components/atoms';
import { Navigate } from 'react-router-dom';
import { useRefState, useLocationState } from 'hooks';
import { signup } from 'utils/api/MemberApi';

const SignupPw = () => {
	const id = useLocationState("id");

	const [pwRef, setPw] = useRefState();

	const onSubmit = useCallback(
		(e?: React.FormEvent) => {
			e?.preventDefault();
			
			if(!pwRef.current) {
				alert("비밀번호를 입력해 주세요.");
			} else {
				signup({
					id: id,
					pw: pwRef.current,
					name: 'name',
					birth: '1998-12-12',
					gender: '1',
					national: 'DOMESTIC',
					di: 'di2',
					mobileCorp: 'KT'
				}).then().catch();
			}
		},
		[id, pwRef]
	);

	return (
		<Auth>
			{id ? undefined : <Navigate to="/" replace/> }

			<ReactHelmet title="회원가입"/>

			<form method="post" onSubmit={onSubmit}>
				<input type="hidden" id="m" value="" />
				<input type="hidden" id="e" value="" />

				<InputField title="휴대폰 번호" name="id" type="phone" value={id} disabled={true} required={true}/>
				<InputField title="비밀번호" name="password" type="password" autoFocus={true} required={true} onValidate={setPw} onEnter={onSubmit}/>


				<Disclaimer>
					{process.env.REACT_APP_NAME}에 가입함으로써 <a target="_blank" href="/document/privacy">개인정보 이용약관</a>에 동의합니다.
				</Disclaimer>

				<Button type="submit" buttonStyle="checkplus" color="secondary" text="회원가입"/>
			</form>
		</Auth>
	);
};

export default React.memo(SignupPw);