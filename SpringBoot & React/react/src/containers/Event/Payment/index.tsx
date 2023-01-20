import { useRef, useEffect } from 'react';
import styles from './Payment.module.scss';
import DetailEventStyle from '../DetailEvent/DetailEvent.module.scss';
import { Button, Step } from 'components/atoms';
import { Error404 } from 'components/organisms';
import TicketList, { ItemRef } from './Ticket';
import { getEvent } from 'utils/api/EventApi';
import { requestTicketPayment, sendFailure } from 'utils/api/PaymentApi';
import { termFormat, toDate } from 'utils/DateUtil';
import { withAxios, withBaseComponents } from 'components/HOC';
import { useParams } from 'react-router';
import { loadJs } from 'utils/DomUtil';

type PaymentProps = {
	data: DetailEvent;
};

const Payment = ({ data } : PaymentProps) => {
	const buttonRef = useRef<HTMLButtonElement>(null) as React.MutableRefObject<HTMLButtonElement>;
	const selectedTicket = useRef<ItemRef>();

	const onSelected = (item: ItemRef) => {
		selectedTicket.current = item;
		buttonRef.current.disabled = false;
	};

	const clientKey = 'test_ck_7DLJOpm5QrlWP6llDpPVPNdxbWnY';
	let tossPayments: any;
	function requestTossPayment(data: any) {
		if(tossPayments === undefined) {
			loadJs("https://js.tosspayments.com/v1", function() {
				tossPayments = TossPayments(clientKey);
				requestTossPayment(data);
			});
		} else {
			data["successUrl"] = window.location.origin + '/toss/success';
			data["failUrl"] = window.location.origin + '/toss/fail';
			tossPayments.requestPayment('카드', data);
		}
	}
	const onClickButton = () => {
		if(selectedTicket.current) {
			buttonRef.current.disabled = true;
			requestTicketPayment({
				id: selectedTicket.current.id,
				quantity: selectedTicket.current.getQuantity()
			}).then((response) => {
				if(response.status === 201) {
					alert("구매 완료되었습니다.");
					buttonRef.current.disabled = true;
				} else {
					requestTossPayment(response.data);
				}
			}).catch((error: AxiosError) => {
				error.alert('결제 정보를 불러오는데 실패하였습니다.');
				buttonRef.current.disabled = false;
				sendFailure();
			})
		}
	}

	useEffect(() => {
		buttonRef.current.disabled = true;
	}, []);

	return (
		<div className={styles.container}>
			<section className={styles['step-wrapper']}>
				<Step text="1. 티켓 선택" current/>
				<Step text="2. 결제" current/>
			</section>

			<section className={styles['ticket-container']}>
				<h1 className={styles['ticket-header']}>Tickets</h1>

				<TicketList tickets={data.ticket} onChange={onSelected} />

				<Button buttonStyle="confirm" text="선택 완료" onClick={onClickButton} ref={buttonRef} withContainer/>
			</section>

			<section className={styles['event-container']}>
				<img className={styles['event-img']} src={data.event.coverPath} alt="event-cover"/>
				<article className={styles['event-inner']}>
					<h1 className={styles['primary-title']}>{data.event.title}</h1>

					<div className={styles['event-info-wrapper']}>
						<div className={styles['event-info-box']}>
							<div className={DetailEventStyle['meta-title']}>일시</div>
							<div className={DetailEventStyle['meta-text']}>{termFormat(toDate(data.event.dtStart), toDate(data.event.dtEnd))}</div>
						</div>
						<div className={styles['event-info-box']}>
							<div className={DetailEventStyle['meta-title']}>주최</div>
							<div className={DetailEventStyle['meta-text']}>{data.organization.name}</div>
						</div>
					</div>

					{
					data.event.isOnline
					&&
					<></>
					// <div className={styles.event-map-wrapper">
					// 	<iframe style="width: 100%; height: 100%; border: 0;" loading="lazy" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBvGKFCLL6khttyoTqy_7haBhgoA2pPR6Q&q=<%=event.getVenue()%>" allowfullscreen></iframe>
					// </div>
					}

					<div className={styles['event-info-wrapper']}>
						<div className={styles['event-info-box']}>
							{
							data.event.isOnline
							?
							<div className={DetailEventStyle['meta-title']}>온라인 플랫폼</div>
							:
							<>
								<div className={DetailEventStyle['meta-title']}>장소</div>
								<div className={DetailEventStyle['meta-title']}>{data.event.venue}</div>
							</>
							}
							<div className={DetailEventStyle['meta-title']}>{data.event.detailVenue}</div>
							{ data.event.venueDescription && <div className={DetailEventStyle['meta-text']}>{data.event.venueDescription}</div> }
						</div>
					</div>
				</article>
			</section>
		</div>
	)
}

export default function PaymentWrapper() {
	const params = useParams();
	const id = params.id;
	
	return (
		id
		?
		withAxios({
			axios: getEvent,
			payload: id as number | string,
			Success: withBaseComponents(Payment),
			Error: <Error404 />
		})
		:
		<Error404 />
	);
}