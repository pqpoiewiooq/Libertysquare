import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import styles from './Payment.module.scss';
import { Svg } from 'components/atoms';
import { term, toDate, wasExpired } from 'utils/DateUtil';
import { useEffect } from 'react';

type TicketId = NonNullable<EventTicket['id']>;
type ItemProps = {
	ticket: EventTicket;
	onChange: (id: TicketId) => void;
}
export type ItemRef = {
	id: TicketId;
	select: VoidFunction;
	deselect: VoidFunction;
	getQuantity: () => number;
}
const Item = forwardRef<ItemRef, ItemProps>(({ ticket, onChange }, ref) => {
	const itemRef = useRef<HTMLLabelElement>(null);
	const chkboxRef = useRef<HTMLInputElement>(null);
	const quantityRef = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;
	const plusRef = useRef<HTMLButtonElement>(null) as React.MutableRefObject<HTMLButtonElement>;
	const minusRef = useRef<HTMLButtonElement>(null) as React.MutableRefObject<HTMLButtonElement>;

	useImperativeHandle(ref, () => ({
		id: ticket.id!,
		select: () => {
			itemRef.current?.classList.add(styles.selected);
			if(chkboxRef.current) chkboxRef.current.checked = true;
		},
		deselect: () => {
			itemRef.current?.classList.remove(styles.selected);
			if(chkboxRef.current) chkboxRef.current.checked = false;
		},
		getQuantity: () => {
			return quantityRef.current ? parseInt(quantityRef.current.value) : 1;
		}
	}));

	const onMinus = () => {
		quantityRef.current.value = (+quantityRef.current.value - 1) + '';
		if(quantityRef.current.value <= '1') {
			minusRef.current.disabled = true;
		}
		if(quantityRef.current.value < ticket.purchaseLimit + '') {
			plusRef.current.disabled = false;
		}
	};

	const onPlus = () => {
		quantityRef.current.value = (+quantityRef.current.value + 1) + '';
		if(quantityRef.current.value > '1') {
			minusRef.current.disabled = false;
		}
		if(quantityRef.current.value >= ticket.purchaseLimit + '') {
			plusRef.current.disabled = true;
		}
	};

	const onCheckedChange = () => {
		onChange(ticket.id!);
	}


	const endDate = toDate(ticket.endDateTime);
	let ticketClass = `${styles['ticket-item']} ${styles.expired}`;
	let _term;
	let wasExpiredTicket = wasExpired(endDate)
	if(wasExpiredTicket) {
		_term = "판매 기간이 종료되었습니다.";
	} else {
		if(ticket.purchaseLimit > 0) {
			ticketClass = styles['ticket-item'];
		}
		_term = `${term(endDate)}일 후에 판매마감`;
	}

	useEffect(() => {
		minusRef.current.disabled = true;
	}, []);

	return (
	<>
		<label className={ticketClass} ref={itemRef}>
			<div className={styles['ticket-item-inner']}>
				<p className={styles['ticket-item-name']}>{ticket.name}</p>
				<div className={styles['ticket-item-price']}>{ticket.price}</div>
				<p className={styles['ticket-item-desc']}>{ticket.description}</p>
				<div>
					<Svg viewBox="0 0 576 512" height="0.75em" width="0.75em" aria-hidden="true" focusable="false" fill="currentColor"><path fill="currentColor" d="M128 160h320v192H128V160zm400 96c0 26.51 21.49 48 48 48v96c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48v-96c26.51 0 48-21.49 48-48s-21.49-48-48-48v-96c0-26.51 21.49-48 48-48h480c26.51 0 48 21.49 48 48v96c-26.51 0-48 21.49-48 48zm-48-104c0-13.255-10.745-24-24-24H120c-13.255 0-24 10.745-24 24v208c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24V152z"></path></Svg>
					<span className={styles['ticket-item-date']}>{_term}</span>
				</div>
			</div>
			<input className={styles['ticket-item-chkbox']} type="checkbox" ref={chkboxRef} onChange={onCheckedChange}/>
		</label>
		{
		!wasExpiredTicket && ticket.purchaseLimit > 1
		&&
		<div className={`${styles['ticket-item']} ${styles.option}`}>
			<div className={styles['ticket-option-label']}>수량</div>
			<div className={styles['ticket-option-text']}>최대 {ticket.purchaseLimit}개 구매 가능</div>
			<div className={styles['counter-container']}>
				<button className={`${styles['counter-button']} ${styles.left}`} ref={minusRef} onClick={onMinus}><svg viewBox="0 0 320 512" height="1em" width="1em" aria-hidden="true" focusable="false" fill="currentColor"><path fill="currentColor" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path></svg></button>
				<input className={styles['counter-input']} defaultValue={1} readOnly ref={quantityRef}/>
				<button className={`${styles['counter-button']} ${styles.right}`} ref={plusRef} onClick={onPlus}><svg viewBox="0 0 320 512" height="1em" width="1em" aria-hidden="true" focusable="false" fill="currentColor"><path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path></svg></button>
			</div>
		</div>
		}
	</>
	)
});

type TicketListProps = {
	tickets: Array<EventTicket>;
	onChange: (item: ItemRef) => void;
}
const TicketList = ({ tickets, onChange }: TicketListProps) => {
	const itemRef = useRef<Array<ItemRef>>([]);

	const onChangeItem = (id: TicketId) => {
		let selected;
		itemRef.current.forEach(item => {
			if(item.id === id) {
				selected = item;
				item.select();
			} else item.deselect();
		});

		if(selected) onChange(selected);
	};

	const rendered = (() => {
		const array = [];
		for(let i = 0; i < tickets.length; i++) {
			array.push(<Item ticket={tickets[i]} key={tickets[i].id} ref={ref => itemRef.current.push(ref!)} onChange={onChangeItem}/>);
		}
		return array;
	})();

	return (
		<article>
			{rendered}
		</article>
	)
};

export default TicketList;