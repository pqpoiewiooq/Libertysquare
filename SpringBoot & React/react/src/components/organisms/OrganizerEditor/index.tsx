import { useCallback, useState, useRef, useMemo } from 'react';
import styles from './OrganizerEditor.module.scss';
import { PreviewButton, Input, ErrorText } from 'components/atoms';
import { PreviewWrapper, PreviewItemList, PreviewItemListType } from 'components/molecules';
import { existsMember } from 'utils/api/MemberApi';
import { isEmpty } from 'utils/ArrayUtil';
import { RootState } from 'store/reducers';
import { useSelector } from 'react-redux';

type OrganizerEditorProps = {
	descriptionClassName: string;
	bodyClassName: string;
	onChange?: (memberList: Array<string>) => void;
	defaultMemberList?: Array<string>;
}

const OrganizerEditor = ({ descriptionClassName, bodyClassName, onChange, defaultMemberList } : OrganizerEditorProps) => {
	const currentMemberId = useSelector((state: RootState) => state.member.memberInfo!.id);

	const defaultState = useMemo(() => defaultMemberList?.map(
		member => ({
			text: member,
			clickable: currentMemberId != member
		})) || [],
		[defaultMemberList]
	);
	const inputRef = useRef<HTMLInputElement>(null);
	const [memberList, setMemberList] = useState<PreviewItemListType>(defaultState);
	const memberText = useRef<string | undefined>();
	const [error, setError] = useState('');

	const setMemberText = useCallback(
		(isValid: boolean, value: string) => {
			memberText.current = '';
			if(value) {
				if(isValid) {
					memberText.current = value;
					setError('');
					return true;
				} else {
					setError('올바른 전화번호 형식이 아닙니다.');
					return false;
				}
			} else {
				setError('');
			}
		}, [memberText]
	);

	const addMember = useCallback(async () => {
		const member = memberText.current;
		if(member) {
			if(memberList.find(m => m.text == member)) {
				setError("이미 추가한 번호입니다.");
				return;
			}

			await existsMember(member)
				.then(() => {
					const add = {
						text: member,
						clickable: currentMemberId != member
					};
					inputRef.current!.value = '';
					memberText.current = '';
					setMemberList([...memberList, add]);
				})
				.catch(() => {
					setError("가입되어 있지 않은 번호입니다.");
				});
		}
	}, [memberText, memberList]);

	const removeMember = useCallback(
		(index: number) => {
			setMemberList(list => {
				const newMemberList = list.slice();
				newMemberList.splice(index, 1);
				return newMemberList;
			});
		}, []
	);

	onChange?.(memberList.map(member => member.text));

	return (
		<PreviewWrapper title="멤버등록" mode="small">
			<div className={descriptionClassName}>전화번호로 회원을 추가 할 수 있습니다. 삭제 하려면 추가된 멤버의 아이콘을 눌러주면 됩니다.</div>
			<div className={bodyClassName}>
				<div className={styles.box}>
					<Input name="member" type="phone" onChange={setMemberText} onEnter={addMember} ref={inputRef} empty/>
					<ErrorText text={error} visibility/>
				</div>
				<PreviewButton buttonStyle="edit" onClick={addMember}>추가</PreviewButton>
			</div>
			<PreviewItemList list={memberList} onClickItem={removeMember}/>
		</PreviewWrapper>
	)
}

export default OrganizerEditor;