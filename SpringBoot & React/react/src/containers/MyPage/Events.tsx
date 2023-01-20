import MyPageStyle from './MyPage.module.scss';
import { Error, ContentCardList } from 'components/organisms';
import { isEmpty } from 'utils/ArrayUtil';
import { fullFormat, toDate } from 'utils/DateUtil';

type EventsProps = {
	data: AffiliatedOrganizationEventList;
};

const Events = ({ data } : EventsProps) => {
	if(isEmpty(data)) {
		return <Error title="행사를 주최해 보세요." alt="주최한 행사 없음." titleClassName={MyPageStyle.title}/>;
	}

	return (
		<>{
			data.map(d => {
				if(isEmpty(d.event)) return '';
				const about = {
					text: d.organization.name,
					to: `/host/${d.organization.id}`
				};

				return (
					<>
						<h1 className={MyPageStyle.title}>{d.organization.name}</h1>
						<ContentCardList
							contents={d.event!.map((event) => ({
								to: `/event/${event.id}`,
								src: event.coverPath,
								extraText: fullFormat(toDate(event.dtStart)),
								title: event.title,
								about: about
							}))}/>
					</>
				);
			})
		}</>
	);
};

export default Events;