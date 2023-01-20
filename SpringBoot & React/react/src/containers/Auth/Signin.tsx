import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import { ReactHelmet } from 'components/organisms';
import { loginRequest } from 'store/reducers/member';
import { Auth } from 'components/templates';
import { InputField } from 'components/molecules';
import { Button } from 'components/atoms';
import { useRefState, useLocationState } from 'hooks';
import { Navigate } from 'react-router';

const Signin = () => {
	const { loading, memberInfo } = useSelector((state: RootState) => state.member);

	const initId = useLocationState("id");
	const [idRef, setId] = useRefState(initId);
	const [pwRef, setPw] = useRefState();
	const dispatch = useDispatch();

	const onSubmit = useCallback(
		(e?: React.FormEvent) => {
			e?.preventDefault();

			if(!idRef.current) {
				alert("휴대폰 번호를 입력해 주세요.");
			} else if(!pwRef.current) {
				alert("비밀번호를 입력해 주세요.");
			} else {
				dispatch(loginRequest({
					id: idRef.current,
					pw: pwRef.current
				}));
			}
		},
		[idRef, pwRef, dispatch]
	);

	return (
		memberInfo
		? 
		<Navigate to="/" />
		:
		<Auth title="다시 만나서 정말 반가워요!">
			<ReactHelmet title="로그인"/>

			<form method="post" onSubmit={onSubmit}>
				<InputField title="휴대폰 번호" name="id" type="phone" onValidate={setId} value={initId} disabled={initId} autoFocus={!initId} />
				<InputField title="비밀번호" required={true} name="pw" type="password" onValidate={setPw} onEnter={onSubmit} autoFocus={initId} />

				<Button type="submit" color="secondary" buttonStyle="form" text="로그인" disabled={loading.login}/>
			</form>
		</Auth>
	);
};

export default React.memo(Signin);