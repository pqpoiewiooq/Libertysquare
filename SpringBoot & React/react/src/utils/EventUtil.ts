/* eslint-disable */
import { currency } from "./TextUtil";
import { wasExpired, toDate } from "./DateUtil";

export function prettyTicket(ticket?: Array<EventTicket>) {
	let personnel = 0;
	let minPrice = 99999999;
	let maxPrice = 0;
	if(ticket) {
		ticket.forEach(t => {
			if(typeof t.personnel === "number") personnel += t.personnel;
			else personnel += t.quantity! - t.stock!;
			
			let price = t.price;
			if(price < minPrice) minPrice = price;
			if(price > maxPrice) maxPrice = price;
		});
	}
	return { personnel, minPrice, maxPrice };
}

export function priceFormat(minPrice: number, maxPrice: number) {
	if(maxPrice > 0) {
		const _min = currency(minPrice);
		return (minPrice == maxPrice ? _min : _min + " ~ " + currency(maxPrice));
	} else return "무료";
}

export function pretty(dirty: DetailEvent) {
	function tagEncode(str: string) {
		if(!str) return "";
		const regex = /^((https?:\/\/|ssh:\/\/|ftp:\/\/|file:\/|www\.|(?:mailto:)?[A-Z0-9._%+\-]+@)(.+)$)/;
		return str.replace(regex, "<a href=\"$1\" target=\"_blank\">$1</a>");
	}

	const { event, organization, ticket } = dirty;// as any;

	const isOutsideEvent = event.type == "OUTSIDE";

	if(event.isOnline) {
		if(event.venue == "zoom") {
			event.detailVenue = "Zoom";
			event.venueDescription = "티켓 구매자들에게 Zoom 접속 방법이 별도로 안내됩니다.";
		}
		event.venue = "온라인 플랫폼";
	}
	event.venue = tagEncode(event.venue);
	event.detailVenue = tagEncode(event.detailVenue);
	if(event.venueDescription) event.venueDescription = tagEncode(event.venueDescription);

	let { personnel, minPrice, maxPrice } = prettyTicket(ticket);

	let buyLink, priceString, buyButtonText;
	const wasExpiredEvent = wasExpired(toDate(event.dtEnd));
	if(isOutsideEvent) {
		buyLink = event.applyLink;
		priceString = "외부 행사";
		buyButtonText = "행사 신청(외부 등록)";
	} else {
		buyLink = "/event/payment/" + event.id;
		if(maxPrice > 0) {
			const _min = currency(minPrice);
			priceString = (minPrice == maxPrice ? _min : _min + " ~ " + currency(maxPrice));
			buyButtonText = "티켓 구입";
		} else {
			priceString = "무료";
			buyButtonText = "등록";
		}
		if(wasExpiredEvent) {
			buyButtonText = "행사 종료";
		}
	}

	return {
		event,
		organization,
		ticket,
		personnel,
		isOutsideEvent,
		wasExpiredEvent,
		buyLink: buyLink!,// 이상하게 이것만 string | undefined로 나와서 직접 무조건 있다고 설정
		priceString,
		buyButtonText
	}
}

const EventUtil = { pretty, prettyTicket, priceFormat };
export default EventUtil;