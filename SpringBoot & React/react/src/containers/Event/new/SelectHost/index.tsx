import { useState, useEffect } from 'react';
import styles from './SelectHost.module.scss';
import commonStyle from '../common.module.scss';
import { SelectableAddButton, SelectableItem, Button, PreviewButton} from 'components/atoms';
import { PreviewWrapper, PreviewItemList } from 'components/molecules';
import { EventBuildPage } from 'components/templates';
import { usePreventNavigate } from 'hooks';
import { getMyOrganizations, getOrganization } from 'utils/api/OrganizationApi';

const SelectHost = () => {
	const [organization, setOrganization] = useState<Organization>();

	const onClickAdd = usePreventNavigate("/event/new/organization");
	const onClickNextButton = usePreventNavigate("/event/new/select-type", { state: { organization } });
	const onClickEdit = usePreventNavigate("/host/" + organization?.id);
	const onClickPageOpen = usePreventNavigate("/host/" + organization?.id);

	const [list, setList] = useState<Array<SimpleOrganization>>([]);

	useEffect(() => {
		getMyOrganizations().then(response => setList(response.data));
	}, []);

	return (
		<EventBuildPage step={0}>
			<article>
				<div className={styles.title}>주최할 호스트 선택</div>
				<div className={styles.desc}>행사를 주최할 호스트를 선택해 주세요. 내가 속한 호스트를 선택할 수 있으며, 호스트 내 멤버들은 모두 행사를 수정하고, 관리할 수 있습니다.</div>
				<div className={commonStyle['selectable-wrapper']}>
					<SelectableAddButton onClick={onClickAdd} />
					{list.map(item => <SelectableItem
							title={item.name}
							desc={item.simpleIntroduce || ""}
							onClick={() => getOrganization(item.id).then(response=>setOrganization(response.data))}
							key={item.name}
							/>
					)}
				</div>
			</article>

			{
				organization
				&&
				<article className={styles['info-container']}>
					<div className={styles.title}>선택된 호스트</div>
					<div className={styles.desc}>함께 행사를 만들어나갈 호스트와 멤버들입니다.</div>
					<PreviewWrapper title={organization.name} desc={organization.simpleIntroduce}>
						{ // organization.organizer가 무조건 있는 상황이어서 ! 써도 되지만, 혹시 모를 상황 대비하여 이렇게 작성
							organization.organizer
							&&
							<PreviewItemList list={ organization.organizer.map(o => ({ text: o.id, clickable: false })) }/>
						}
						<PreviewButton size="small" buttonStyle="edit" onClick={onClickEdit}>수정</PreviewButton>
						<PreviewButton size="small" onClick={onClickPageOpen}>페이지 열기</PreviewButton>
					</PreviewWrapper>
				</article>
			}
			
			<Button type="button" withContainer="right" buttonStyle="confirm" color="primary" text="행사 주최하기" onClick={onClickNextButton} disabled={!organization}/>
			
		</EventBuildPage>
	)
};


export default SelectHost;
