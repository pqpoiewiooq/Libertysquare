import MyPageStyle from './MyPage.module.scss';
import { Error, ContentCardList } from 'components/organisms';
import { isEmpty } from 'utils/ArrayUtil';
import { fullFormat, toDate } from 'utils/DateUtil';

type TicketsProps = {
	data?: Array<Pick<MyEvent, 'organization' | keyof SimpleMyEvent>>;
};

const Tickets = ({ data } : TicketsProps) => {
	if(isEmpty(data)) {
		return <Error title="행사 티켓을 구매해 보세요." alt="보유한 행사 티켓 없음." titleClassName={MyPageStyle.title}/>;
	}

	const contents = data!.map(d => ({
		to: `/my/ticket/${d.id}`,
		src: d.coverPath,
		extraText: fullFormat(toDate(d.dtStart)),
		title: d.title,
		about: {
			text: d.organization.name,
			to: `/host/${d.organization.id}`
		}
	}));

	return (
		<>
		<h1 className={MyPageStyle.title}>구매 완료한 티켓</h1>
		<ContentCardList
			contents={contents}/>
		</>
	);
};

export default Tickets;