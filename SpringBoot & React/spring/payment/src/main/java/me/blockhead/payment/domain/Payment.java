package me.blockhead.payment.domain;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import me.blockhead.common.annotation.validation.Price;
import me.blockhead.common.domain.BaseEntity;
import me.blockhead.common.user.domain.User;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Payment extends BaseEntity {
	@NotBlank
	@Id
	private String id;
	
	@NotNull
	@JoinColumn
	@ManyToOne
	private User payer;
	
	@NotNull
	@Size(max = 7)
	@Enumerated(EnumType.STRING)
	private PaymentType type;
	
	@NotNull
	@Column(length = 24)
	@Enumerated(EnumType.STRING)
	private PaymentMethod paymentMethod;
	
	/**
	 * total price
	 */
	@Price
	@Column(nullable = false)
	private int amount;
	
	@NotNull
	@Column(length = 8, nullable = false)
	@Enumerated(EnumType.STRING)
	private PaymentStatus status;
}