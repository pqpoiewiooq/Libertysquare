package me.blockhead.web.ticket.domain;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;
import javax.validation.constraints.Size;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import me.blockhead.common.annotation.validation.Price;
import me.blockhead.common.constant.MySQLTypeSize;
import me.blockhead.common.domain.BaseIdEntity;
import me.blockhead.web.event.domain.Event;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class EventTicket extends BaseIdEntity {
	public class Limit {
		public static final int NAME = 32;
		public static final int DESCRIPTION = MySQLTypeSize.TINYTEXT;
		/**
		 * max digits
		 */
		public static final int QUANTITY = 6;
	}

	@NotNull
	@Enumerated(EnumType.STRING)
	private EventTicketType type;

	@NotBlank
	@Size(max = Limit.NAME)
	@Column(nullable = false)
	private String name;

	@NotBlank
	@Size(max = Limit.DESCRIPTION)
	@Column(nullable = false)
	private String description;

	@Price
	@Column(nullable = false)
	private int price;

	@Positive
	@Digits(integer = Limit.QUANTITY, fraction = 0)
	@Column(nullable = false)
	private int quantity;

	@PositiveOrZero
	@Digits(integer = Limit.QUANTITY, fraction = 0)
	@Column(nullable = false)
	private int stock;

	@Column(nullable = false)
	private boolean hideStock;

	@PositiveOrZero
	@Digits(integer = Limit.QUANTITY, fraction = 0)
	@Column(nullable = false)
	private int purchaseLimit;

	@NotNull
	private LocalDateTime startDateTime;

	@NotNull
	private LocalDateTime endDateTime;

	@NotNull
	private LocalDateTime refundDeadline;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn
	private Event event;

	/* 비즈니스 로직 */
	
	/**
	 * @return true if and only if the {@link #endDateTime} has passed; false otherwise
	 */
	public boolean isAvailable() {
		return getEndDateTime().isAfter(LocalDateTime.now());
	}
	
	/**
	 * @throws IllegalStateException If the sale has passed
	 */
	public void verifyAvailable() throws IllegalStateException {
		if(!isAvailable()) throw new IllegalStateException("판매 기간이 종료된 티켓입니다.");
	}
	
	public boolean isFree() {
		return price <= 0;
	}

	public int getAttendee() {
		return getQuantity() - getStock();
	}
}
