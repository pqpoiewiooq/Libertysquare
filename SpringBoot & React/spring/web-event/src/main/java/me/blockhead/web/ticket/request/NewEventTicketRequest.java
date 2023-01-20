package me.blockhead.web.ticket.request;

import java.time.LocalDateTime;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import me.blockhead.common.annotation.validation.Price;
import me.blockhead.common.constant.TemporalConfig;
import me.blockhead.web.ticket.domain.EventTicket;
import me.blockhead.web.ticket.domain.EventTicketType;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NewEventTicketRequest {
	@NotNull
	private EventTicketType type;

	@NotBlank
	@Size(max = EventTicket.Limit.NAME)
	private String name;

	@Size(max = EventTicket.Limit.DESCRIPTION)
	private String description;

	@Price
	private int price;

	@PositiveOrZero
	@Digits(integer = EventTicket.Limit.QUANTITY, fraction = 0)
	private int quantity;

	private boolean hideStock;

	@PositiveOrZero
	@Digits(integer = EventTicket.Limit.QUANTITY, fraction = 0)
	private int purchaseLimit;

	@NotNull
	@JsonFormat(pattern = TemporalConfig.DATE_TIME_FORMAT)
	private LocalDateTime startDateTime;

	@NotNull
	@JsonFormat(pattern = TemporalConfig.DATE_TIME_FORMAT)
	private LocalDateTime endDateTime;

	@NotNull
	@JsonFormat(pattern = TemporalConfig.DATE_TIME_FORMAT)
	private LocalDateTime refundDeadline;
}