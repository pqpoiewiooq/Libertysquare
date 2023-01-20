import styles from './DetailEvent.module.scss';
import { Svg } from 'components/atoms';
import { term, toDate, wasExpired } from 'utils/DateUtil';
import { currency } from 'utils/TextUtil';

type TicketInfoProps = {
	tickets: Array<EventTicket>;
};

const TicketInfo = ({ tickets } : TicketInfoProps) => {
	return(
	<>
		<div className={styles['ticket-label']}>티켓</div>
		{tickets.map(ticket => {
			const endDate = toDate(ticket.endDateTime);
			let ticketWrapperClass;
			let _term;
			if(wasExpired(endDate)) {
				ticketWrapperClass = `${styles['ticket-wrapper']} ${styles.expired}`;
				_term = "판매 기간이 종료되었습니다.";
			} else {
				ticketWrapperClass = styles['ticket-wrapper'];
				_term = `${term(endDate)}일 후에 판매마감`;
			}

			return (
				<div className={ticketWrapperClass} key={ticket.id}>
					<div className={styles['ticket-price']}>{currency(ticket.price)}</div>
					<div className={styles['ticket-name']}>{ticket.name}</div>
					<div className={styles['ticket-desc']}>{ticket.description}</div>

					{ !ticket.hideStock
					&& 
						<div className={styles['fsize0']}>
							<Svg viewBox="0 0 576 512" height="0.75em" width="0.75em" aria-hidden="true" focusable="false" fill="currentColor" style={{ transform: "rotate(135deg)" }}>
								<path fill="currentColor" d="M128 160h320v192H128V160zm400 96c0 26.51 21.49 48 48 48v96c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48v-96c26.51 0 48-21.49 48-48s-21.49-48-48-48v-96c0-26.51 21.49-48 48-48h480c26.51 0 48 21.49 48 48v96c-26.51 0-48 21.49-48 48zm-48-104c0-13.255-10.745-24-24-24H120c-13.255 0-24 10.745-24 24v208c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24V152z"></path>
							</Svg>
							<span className={styles['ticket-text']}>{ticket.stock}명 남음</span>
						</div>
					}

					<div className={styles['fsize0']}>
						<Svg viewBox="0 0 576 512" height="0.75em" width="0.75em" aria-hidden="true" focusable="false" fill="currentColor">
							<path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
						</Svg>
						<span className={styles['ticket-text']}>1인당 {ticket.purchaseLimit}개 구입가능</span>
					</div>
					<div className={styles['fsize0']}>
						<Svg viewBox="0 0 576 512" height="0.75em" width="0.75em" aria-hidden="true" focusable="false" fill="currentColor">
							<path fill="currentColor" d="M148 288h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm108-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 96v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96-260v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"></path>
						</Svg>
						<span className={styles['ticket-text']}>{_term}</span>
					</div>
				</div>
			)
		})}
	</>
	)
}

export default TicketInfo;