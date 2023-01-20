import React, { memo, useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import styles from './TicketBuilder.module.scss';
import { PreviewButton, SelectableItem, CheckBox, Svg } from 'components/atoms';
import { Slot, PreviewWrapper, InputField, DateTimeField } from 'components/molecules';
import ic_fcfs from 'assets/icon/ic_ticket_fcfs.svg';
import ic_selection from 'assets/icon/ic_ticket_selection.svg';
import { useRefState } from 'hooks';
import { DateTime } from 'utils/DateUtil';

type TicketBuilderProps = {
	onChange?: (_key: number, ticket?: EventTicket) => void;
	onRemove?: (_key: number) => void;
	_key: number;
};

export type TicketRef = {
	parse: () => EventTicket | undefined;
	element: HTMLDivElement | null;
} | null;

const MAX_QUANTITY = 6;

const TicketBuilder = forwardRef<TicketRef, TicketBuilderProps>(({ onChange, onRemove, _key }, ref) => {
	const [type, setType] = useState<TicketType>("FCFS");
	const [name, setName] = useRefState();
	const [description, setDescription] = useRefState();
	const [price, setPrice] = useRefState<number>();
	const [quantity, setQuantity] = useRefState<number>();
	const hide = useRef<HTMLInputElement>(null);
	const [purchaseLimit, setPurchaseLimit] = useRefState<number>();
	const [startDateTime, setStartDateTime] = useRefState<DateTime>();
	const [endDateTime, setEndDateTime] = useRefState<DateTime>();
	const [refundDeadline, setRefundDeadline] = useRefState<DateTime>();

	const parseTicket = useCallback(() : EventTicket | undefined => {
		if(!name.current) return;
		if(!price.current) return;
		if(!quantity.current) return;
		if(!hide.current) return;
		if(!purchaseLimit.current) return;
		if(!startDateTime.current) return;
		if(!endDateTime.current) return;
		if(!refundDeadline.current) return;
		
		return {
			type,
			name: name.current,
			description: description.current,
			price: price.current,
			quantity: quantity.current,
			hideStock: hide.current!.checked,
			purchaseLimit: purchaseLimit.current,
			startDateTime: startDateTime.current.toString()!,
			endDateTime: endDateTime.current.toString()!,
			refundDeadline: refundDeadline.current.toString()!
		};
	}, [type]);

	const wrapperRef = useRef<HTMLDivElement>(null);
	useImperativeHandle(ref, () => ({
		parse: parseTicket,
		element: wrapperRef.current
	}), [parseTicket, wrapperRef.current]);

	const callOnChange = useCallback(() => {
		onChange?.(_key, parseTicket());
	}, [parseTicket, onChange, _key]);

	const onChangeFcfs = useCallback(() => {
		setType("FCFS");
		callOnChange();
	}, [callOnChange]);

	const onChangeSelection = useCallback(() => {
		setType("SELECTION");
		callOnChange();
	}, [callOnChange]);

	const onDeleteListener = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		onRemove?.(_key);
	}, [onRemove, _key]);
	
	return (
		<PreviewWrapper mode="page" ref={wrapperRef}>
			<Slot title="티켓 유형" fullMode>
				<div className={styles['selectable-wrapper']}>
					<SelectableItem
						icon={ic_fcfs}
						title="선착순 방식"
						desc="신청한 순서대로 결제됩니다."
						onClick={onChangeFcfs}
						active={type == "FCFS"}/>
					<SelectableItem 
						icon={ic_selection}
						title="주최자 선별 방식"
						desc="신청을 받은 후 주최자가 선택한 신청자만 결제가 진행되고 참가자격이 주어집니다."
						onClick={onChangeSelection}
						active={type == "SELECTION"}/>
				</div>
			</Slot>

			<Slot
				title="티켓 이름"
				desc="한 번 설정한 이름은 수정할 수 없습니다.">
				<InputField
					title="티켓 이름"
					name="ticketName"
					type="text"
					maxLength={32}
					placeholder="일반 입장권"
					mode="NO_WRAPPER"
					onValidate={setName} />
			</Slot>

			<Slot
				title="티켓 설명"
				desc="이 티켓에 대해 상세한 설명이 필요하다면 작성해 주세요.">
				<InputField
					title="티켓 설명"
					name="ticketDescription"
					type="text"
					placeholder="무료 음료를 제공합니다."
					mode="NO_WRAPPER"
					onValidate={setDescription}
					empty />
			</Slot>

			<Slot
				title="가격"
				desc="구매자가 있는 경우 티켓 가격은 수정할 수 없습니다.">
				<InputField
					title="가격"
					name="ticketPrice"
					type="money"
					mode="NO_WRAPPER"
					onValidate={setPrice} />
			</Slot>

			<Slot
				title="티켓 수량"
				desc="판매하고 싶은 최대 수량을 정해 주세요.">
				<InputField
					title="티켓 수량"
					name="ticketQuantity"
					type="num"
					mode="NO_WRAPPER"
					maxLength={MAX_QUANTITY}
					onValidate={setQuantity} />
			</Slot>

			<Slot title="티켓 수량 숨김">
				<CheckBox name="hide" ref={hide} />
			</Slot>

			<Slot
				title="1인당 구매 가능 개수"
				desc="유저 1명이 구입할 수 있는 최대 개수입니다. 온라인 행사의 경우, 1명의 유저는 한 장의 티켓만 구매 가능합니다.">
				<InputField
					title="1인당 구매 가능 개수"
					name="ticketPurchaseLimit"
					type="num"
					mode="NO_WRAPPER"
					maxLength={MAX_QUANTITY}
					onValidate={setPurchaseLimit} />
			</Slot>

			<Slot
				title="판매 기간"
				desc="티켓별로 판매기간을 조정할 수 있습니다.">
				<DateTimeField title="시작" onChange={setStartDateTime} />
				<DateTimeField title="종료" onChange={setEndDateTime} />
			</Slot>

			<Slot
				title="환불 마감 날짜"
				desc="판매 종료일을 설정하면 환불 마감 날짜는 자동으로 이와 동일하게 조정되지만 호스트가 원하는 날짜로 변경할 수도 있습니다.">
				<DateTimeField title="환불 마감일" onChange={setRefundDeadline} />
			</Slot>

			<PreviewButton buttonStyle="delete" onClick={onDeleteListener} style={{width: "150px"}}>
				<Svg viewBox="0 0 448 512" height="1em" width="1em" aria-hidden="true" focusable="false" fill="currentColor"><path fill="currentColor" d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"></path></Svg>
				&nbsp;삭제
			</PreviewButton>
		</PreviewWrapper>
	);
});

export default memo(TicketBuilder);