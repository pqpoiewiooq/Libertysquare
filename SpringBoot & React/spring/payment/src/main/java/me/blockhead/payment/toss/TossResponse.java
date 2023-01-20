package me.blockhead.payment.toss;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class TossResponse {
	@NotBlank
	private String paymentKey;
	
	@NotBlank
	private String orderId;
	
	@NotNull
	@Positive
	private int amount;
}
