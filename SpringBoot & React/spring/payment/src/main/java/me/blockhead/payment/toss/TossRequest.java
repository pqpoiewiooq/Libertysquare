package me.blockhead.payment.toss;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Builder;
import lombok.Getter;
import me.blockhead.payment.data.AbstractDetailPaymentData;

@Getter
public class TossRequest extends AbstractDetailPaymentData {
	private final String orderId = createOrderId();
	
	private String orderName;
	/**
	 * total price
	 */
	private int amount;
	@JsonIgnore
	private int quantity;
	
	@Builder
	public TossRequest(String orderName, int amount, int quantity) {
		this.orderName = orderName;
		this.amount = amount;
		this.quantity = quantity;
	}

	private static String createOrderId() {
		return UUID.randomUUID().toString().replaceAll("-", "");
	}

	public boolean compare(String orderId, int amount) {
		return this.orderId.equals(orderId) && this.amount == amount;
	}
}
