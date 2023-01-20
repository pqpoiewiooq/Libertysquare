import React, { useCallback, useState } from 'react';
import styles from './SelectType.module.scss';
import commonStyle from '../common.module.scss';
import { SelectableItem, Button, CheckBox } from 'components/atoms';
import { EventBuildPage } from 'components/templates';
import { Navigate } from 'react-router';
import { usePreventNavigate, useLocationState } from 'hooks';

const SelectType = () => {
	const [checked, setChecked] = useState(false);
	const [eventType, setType] = useState<MyEventType>("INSIDE");
	const organization = useLocationState("organization");

	const onChangeInside = useCallback(() => {
		setType("INSIDE");
	}, []);

	const onChangeOutside = useCallback(() => {
		setType("OUTSIDE");
	}, []);

	const onClickButton = usePreventNavigate("/event/new/info", { state: { organization, eventType } });

	const onChangeCheckBox = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(event.currentTarget.checked);
	}, []);

	return (
		organization
		?
			<EventBuildPage step={0}>
				<article className={commonStyle['selectable-wrapper']}>
					<SelectableItem
						title={`${process.env.REACT_APP_NAME}에서 행사 주최`}
						desc={`${process.env.REACT_APP_NAME}의 행사 티켓팅, 참가자 관리 등 여러가지 기능들을 사용합니다.`}
						onClick={onChangeInside}
						active={eventType === "INSIDE"}/>
					<SelectableItem 
						title="외부 행사 등록"
						desc={`${process.env.REACT_APP_NAME}의 특별한 기능을 사용하지 않고 행사 정보만 입력합니다.`}
						onClick={onChangeOutside}
						active={eventType === "OUTSIDE"}/>
				</article>

				<article className={styles['terms-container']}>
					<CheckBox name="terms" onChange={onChangeCheckBox} />
					<span className={styles.terms}>
						<a target="_blank" href="/document/help#host">주최자 안내사항</a>을 읽었습니다. 또한 <a target="_blank" href="/document/terms">{process.env.REACT_APP_NAME} 이용약관</a> 및 <a target="_blank" href="/document/code-of-conduct">Code of Conduct</a>를 준수할 것을 동의합니다.
					</span>
				</article>

				<Button text="행사 만들러 가기" buttonStyle="confirm" withContainer disabled={!checked} onClick={onClickButton}/>
			</EventBuildPage>
		:
			<Navigate to=".."/>
	)
};


export default SelectType;
