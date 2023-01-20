import React, { useCallback } from 'react';
import { ReactHelmet } from 'components/organisms';
import { Auth } from 'components/templates';
import { InputField } from 'components/molecules';
import { Button } from 'components/atoms';
import { useRefState } from 'hooks';
import { existsMember } from 'utils/api/MemberApi';
import { useNavigate } from 'react-router-dom';

const Sign = () => {
	const [idRef, setId] = useRefState();
	const navigate = useNavigate();

	const onSubmit = useCallback(
		(e?: React.FormEvent) => {
			e?.preventDefault();

			if(!idRef.current) {
				alert("휴대폰 번호를 입력해 주세요.");
			} else {
				existsMember(idRef.current)
					.then(() => {
						navigate("/signin", { state: { id: idRef.current } });
					})
					.catch(() => {
						navigate("/signup-pw", { state: { id: idRef.current } });
					});
			}
		},
		[idRef, navigate]
	);

	const onClick = useCallback(() => {
			navigate("/signup", { state: { id: idRef.current } });
		}, [idRef, navigate]
	);

	return (
		<Auth>
			<ReactHelmet title="가입 혹은 로그인"/>

			<form method="post" onSubmit={onSubmit}>
				<InputField title="휴대폰 번호" name="id" type="phone" autoFocus={true} onValidate={setId} onEnter={onSubmit}/>
				
				<Button type="submit" color="secondary" buttonStyle="form" text="로그인" />
				<Button buttonStyle="form" text="회원가입" onClick={onClick} />
			</form>
		</Auth>
	);
};

export default React.memo(Sign);