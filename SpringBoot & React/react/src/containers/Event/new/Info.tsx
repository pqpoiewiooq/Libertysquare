
import { Navigate } from 'react-router';
import { Slot, PreviewWrapper, PreviewItemList } from 'components/molecules';
import { EventBuildPage, EventBuildForm } from 'components/templates';
import { useLocationState } from 'hooks';

const Info = () => {
	const organization = useLocationState("organization") as Organization;
	const eventType = useLocationState("eventType");
	
	return (
		(organization && eventType)
		?
			<EventBuildPage step={2}>
				<Slot title="주최 호스트" fullMode>
					<PreviewWrapper title={organization.name} desc={organization.simpleIntroduce}>
						{ // organization.organizer가 무조건 있는 상황이어서 ! 써도 되지만, 혹시 모를 상황 대비하여 이렇게 작성
							organization.organizer
							&&
							<PreviewItemList list={ organization.organizer.map(o => ({ text: o.id, clickable: false })) }/>
						}
					</PreviewWrapper>
				</Slot>
				<EventBuildForm organization={organization} eventType={eventType} />
			</EventBuildPage>
		:
			<Navigate to=".."/>
	)
};


export default Info;
