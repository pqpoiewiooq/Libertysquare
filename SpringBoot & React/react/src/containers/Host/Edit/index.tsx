import { useCallback, useEffect, useRef, useState } from 'react';

import styles from './Edit.module.scss';
import parentStyle from '../Host.module.scss';

import { useSelector, useDispatch } from 'react-redux';
import { changeThemeColorRequest } from 'store/reducers/organization';

import { PreviewWrapper, InputField, ContentField, Palette } from 'components/molecules';
import { OrganizerEditor } from 'components/organisms';
import { useRefState } from 'hooks';
import { existsOrganization, updateOrganization } from 'utils/api/OrganizationApi';
import { DatePicker, ImageUploader, PreviewButton } from 'components/atoms';
import { sinceFormat, toDate, format } from 'utils/DateUtil';
import ArrayUtil from 'utils/ArrayUtil';


const Edit = () => {
	const organization = useSelector((state) => state.organization.organization)!;
	const [baseThemeColor, setBaseThemeColor] = useState(organization.themeColor);
	const dispatch = useDispatch();

	// 이름
	const [name, setName] = useRefState();
	const onNameCheck = useCallback(async (value: string) => {
		if(organization.name == value) return true;
		return await existsOrganization(value);
	}, [organization.name]);

	// 간단 소개
	const [simpleIntroduce, setSimpleIntroduce] = useRefState();

	// since
	const [since, setSince] = useRefState<Date>();

	// 프로필
	// 커버


	// 테마 컬러
	const onColorChange = useCallback((color: string) => {
		dispatch(changeThemeColorRequest(color));
	}, []);

	// 상세 소개
	const contentEditor = useRef<TinymceEditor>() as React.MutableRefObject<TinymceEditor>;
	const onInitEditor = useCallback((editor: TinymceEditor) => {
		contentEditor.current = editor;
	}, []);

	// 멤버
	const memberRef = useRefState<string[]>();
	const memberList = memberRef[0] as React.MutableRefObject<string[]>;
	const setMemberList = memberRef[1];

	// 수정사항 반영 버튼
	const onClickConfirm = useCallback(() => {
		type RequestType = Parameters<typeof updateOrganization>[0];
		const request: RequestType = { id: organization.id };
		let wasChanged = false;
		function add<Prop extends keyof RequestType, Param extends RequestType[Prop]>(prop: Prop, lhs: Param, rhs: Param, equalityFn?: (lhs: Param, rhs: Param) => boolean) {
			if(equalityFn ? equalityFn(lhs, rhs) : lhs !== rhs) {
				wasChanged = true;
				request[prop] = lhs;
			}
		}
		add('name', name.current, organization.name);
		add('simpleIntroduce', simpleIntroduce.current, organization.simpleIntroduce);
		add('since', format(since.current!, 'yyyy-MM-dd'), organization.since);
		//profile
		//cover
		add('themeColor', organization.themeColor, baseThemeColor);
		add('introduce', contentEditor.current.getContent(), organization.introduce || '');
		add('organizer', memberList.current, organization.organizer.map(o => o.id), ArrayUtil.equals);

		if(!wasChanged) {
			return alert("변경 사항이 없습니다.");
		}

		updateOrganization(request);
	}, [organization]);

	// 페이지 나갈 때, 원래의 ThemeColor로 설정.
	useEffect(() => {
		return () => {
			dispatch(changeThemeColorRequest(baseThemeColor));
		}
	}, []);

	return (
	<>
		<style>
			{`#${parentStyle.content} { background: rgb(248, 248, 250); paading: 43px 20px 45px;}`}
		</style>
		
		<PreviewWrapper title="이름" mode="small">
			<div className={styles.body}>
				<InputField
					title="이름"
					name="name"
					maxLength={55}
					mode="NO_WRAPPER"
					onValidate={setName}
					autoFocus
					onInputEnd={onNameCheck}
					defaultValue={organization.name}/>
			</div>
		</PreviewWrapper>
	
		<PreviewWrapper title="간단 소개" mode="small">
			<div className={styles.body}>
				<InputField
					title="간단 소개"
					name="introduceSimple"
					maxLength={255}
					mode="NO_WRAPPER"
					onValidate={setSimpleIntroduce}
					defaultValue={organization.simpleIntroduce}
					empty />
			</div>
		</PreviewWrapper>

		<PreviewWrapper title="시작일" mode="small">
			<div className={`${styles.body} ${styles.since}`}>
				<DatePicker className={styles.datepickr} onChange={setSince} defaultDate={toDate(organization.since)}/>
				<div className={styles['since-text']}>{sinceFormat(toDate(organization.since))}</div>
			</div>
		</PreviewWrapper>

		<PreviewWrapper title="프로필 이미지" mode="small">
			<ImageUploader
				aspectRatio={1}
				width={170}
				height={170}
				shape="circle"
				description="4MB이하의 이미지만 업로드 되며 이미지를 눌러 변경할 수 있습니다."
				path={organization.profilePath}/>
		</PreviewWrapper>

		<PreviewWrapper title="커버 이미지" mode="small">
			<ImageUploader
				aspectRatio={0.267}
				width={600}
				shape="rectangle"
				description="이미지를 눌러 변경할 수 있으며 이미지 선택 후에는 선택영역을 지정해주세요."
				path={organization.coverPath}/>
		</PreviewWrapper>

		<PreviewWrapper title="호스트 테마 컬러" mode="small">
			<div className={styles.body}>
				<Palette onChange={onColorChange} defaultValue={organization.themeColor}/>
			</div>
		</PreviewWrapper>

		<PreviewWrapper title="상세 소개" mode="small">
			<div className={styles.body}>
				<ContentField onInit={onInitEditor} defaultValue={organization.introduce} />
			</div>
		</PreviewWrapper>
	
		<OrganizerEditor
			descriptionClassName={styles.description}
			bodyClassName={styles.body}
			onChange={setMemberList}
			defaultMemberList={organization.organizer.map(organizer => organizer.id)}/>

		<PreviewWrapper mode="small">
			<PreviewButton buttonStyle="confirm" style={{display: "block", marginLeft: "auto"}} onClick={onClickConfirm}>수정사항 반영하기</PreviewButton>
		</PreviewWrapper>
	</>
	);
};

export default Edit;