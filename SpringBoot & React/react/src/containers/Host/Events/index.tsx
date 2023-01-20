import styles from './Events.module.scss';
import { ContentCardWide } from 'components/molecules';
import { isEmpty } from 'utils/ArrayUtil';
import { toDate, simpleFormat } from 'utils/DateUtil';
import { prettyTicket, priceFormat } from 'utils/EventUtil';
import { Loading } from 'components/atoms';
import { useDispatch, useSelector } from 'react-redux';
import { loadHostedEventRequest } from 'store/reducers/organization';

const Events = () => {
	const data = useSelector((state) => state.organization.hostedEvent);
	const dispatch = useDispatch();

	if(data === null) {
		dispatch(loadHostedEventRequest());
		return <Loading />;
	}
	if(isEmpty(data)) {
		return <article className={styles['no-content-container']}>아직 행사가 없습니다. 기대해주세요 👀</article>;
	}

	return (
		<article className={styles.container}>
			{data.map(d => {
				let { personnel, minPrice, maxPrice } = prettyTicket(d.ticket);
				let price = priceFormat(minPrice, maxPrice);
				
				return <ContentCardWide 
					to={`/event/${d.id}`}
					src={d.coverPath}
					extraText={simpleFormat(toDate(d.dtStart))}
					title={d.title}
					provider={d.organization.name}
					personnel={personnel}
					price={price}
					key={d.id}/>
			})}
		</article>
	)
}

export default Events;