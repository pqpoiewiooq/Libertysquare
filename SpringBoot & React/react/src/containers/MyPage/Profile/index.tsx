import styles from './Profile.module.scss';
import { Button, ImageUploader, Label } from 'components/atoms';
import { InputField } from 'components/molecules';
import { useSelector, useDispatch } from 'react-redux';
import { useRefState } from 'hooks';
import { updateProfileRequest, updatePasswordRequest } from 'store/reducers/member';

const editProfileButtonStyle = { marginTop: "20px" };

const Profile = () => {
	const memberInfo = useSelector((state) => state.member.memberInfo)!;
	const dispatch = useDispatch();

	const [nickname, setNickname] = useRefState();
	const [profilePath, setProfilePath] = useRefState(memberInfo.profilePath);
	const onEditProfile = () => {
		if(!nickname.current) {
			alert('닉네임을 입력해 주세요.');
		} else if(nickname.current === memberInfo.nickname && profilePath.current === memberInfo.profilePath) {
			alert('변경 사항이 없습니다.');
		} else {
			dispatch(updateProfileRequest({
				nickname: nickname.current,
				profilePath: profilePath.current
			}));
		}
	};

	const [newPassword1, setNewPassword1] = useRefState();
	const [newPassword2, setNewPassword2] = useRefState();
	const [currentPassword, setCurrentPassword] = useRefState();
	const onEditPassword = () => {
		if(!newPassword1.current) {
			alert('새로운 비밀번호를 입력해 주세요.');
		} else if(!newPassword2.current) {
			alert('새로운 비밀번호를 동일하게 한 번 더 입력해 주세요.');
		} else if(!currentPassword.current) {
			alert('현재 비밀번호를 입력해 주세요.');
		} else if(newPassword1.current !== newPassword2.current) {
			alert('새로운 비밀번호가 서로 일치하지 않습니다.');
		} else {
			dispatch(updatePasswordRequest({
				newPw: newPassword1.current,
				currentPw: currentPassword.current
			}));
		}
	};

	return (
		<>
			<section className={styles.section}>
				<h1 className={styles.header}>기본 정보</h1>
				<form>
					<InputField 
						title="닉네임"
						name="nickname"
						defaultValue={memberInfo.nickname}
						maxLength={14}
						onValidate={setNickname}
						required/>

					<Label text="프로필 이미지"/>
					<ImageUploader
						aspectRatio={1}
						width={150}
						height={150}
						shape="circle"
						description="4MB이하의 이미지만 업로드 되며 이미지를 눌러 변경할 수 있습니다."
						path={memberInfo.profilePath}
						onUpload={setProfilePath} />

					<Button buttonStyle="confirm" text="수정하기" onClick={onEditProfile} style={editProfileButtonStyle}/>
				</form>
			</section>

			<section className={styles.section}>
				<h1 className={styles.header}>비밀번호 변경</h1>
				<form>
					<InputField
						title="새로운 비밀번호"
						name="password"
						type="password"
						autoComplete="new-password"
						onValidate={setNewPassword1}
						empty />
					<InputField
						title="동일하게 재입력"
						name="_password"
						type="password"
						autoComplete="new-password"
						onValidate={setNewPassword2}
						empty />
					<InputField
						title="현재 비밀번호"
						name="current_password"
						type="password"
						onValidate={setCurrentPassword}
						empty />
					<Button buttonStyle="confirm" text="변경하기" onClick={onEditPassword}/>
				</form>
			</section>

			<section className={styles.section}>
				<h1 className={styles.header}>회원 탈퇴</h1>
				<form>
					<Button buttonStyle="form" style={{ width: "auto" }} color="secondary" text="탈퇴요청"/>
				</form>
			</section>
		</>
	);
};

export default Profile;