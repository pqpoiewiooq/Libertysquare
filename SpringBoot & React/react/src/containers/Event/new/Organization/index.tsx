import { useCallback, useState } from 'react';
import styles from './Organization.module.scss';
import { PreviewButton } from 'components/atoms';
import { PreviewWrapper, InputField } from 'components/molecules';
import { OrganizerEditor } from 'components/organisms';
import { EventBuildPage } from 'components/templates';
import { usePreventNavigate, useRefState } from 'hooks';
import { existsOrganization, createOrganization } from 'utils/api/OrganizationApi';

const Organization = () => {
	const back = usePreventNavigate("..");
	const [loading, setLoading] = useState(false);

	const [name, setName] = useRefState();
	const onNameCheck = async (value: string) => {
		return await existsOrganization(value);
	};

	const [simpleIntroduce, setSimpleIntroduce] = useRefState();
	const [memberList, setMemberList] = useRefState<Array<string>>([]);
	
	const onClickConfirm = useCallback(
		() => {
			setLoading(true);
			createOrganization({
				organizer: memberList.current,
				name: name.current!,
				simpleIntroduce: simpleIntroduce.current
			}).then(() => {
				back();
			}).catch((error) => {
				alert("호스트 추가에 실패하였습니다.\n" + error.response.data);
			}).finally(() => setLoading(false));
		}, [back, memberList, name, simpleIntroduce]
	);

	return (
		<EventBuildPage step={0}>
			<PreviewWrapper title="이름" mode="small">
				<div className={styles['input-wrapper']}>
					<InputField
						title="이름"
						name="name"
						maxLength={55}
						mode="NO_WRAPPER"
						onValidate={setName}
						autoFocus
						onInputEnd={onNameCheck}/>
				</div>
			</PreviewWrapper>

			<PreviewWrapper title="간단소개" mode="small">
				<div className={styles['input-wrapper']}>
					<InputField
						title="간단소개"
						name="introduceSimple"
						maxLength={255}
						mode="NO_WRAPPER"
						onValidate={setSimpleIntroduce}/>
				</div>
			</PreviewWrapper>

			<OrganizerEditor
				descriptionClassName={styles['sub-title']}
				bodyClassName={styles['input-wrapper']}
				onChange={setMemberList}/>

			<PreviewWrapper mode="small">
				<div className={styles['btn-field']}>
					<PreviewButton buttonStyle="edit" onClick={back}>취소</PreviewButton>
					<PreviewButton buttonStyle="confirm" disabled={loading} onClick={onClickConfirm}>확인</PreviewButton>
				</div>
			</PreviewWrapper>
		</EventBuildPage>
	)
};


export default Organization;
