package me.blockhead.payment.data;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import me.blockhead.common.domain.BaseIdEntity;
import me.blockhead.common.user.domain.User;

@Setter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class PaymentData {
	@Getter
	@JsonIgnore
	private User payer;
	
//	@JsonIgnore
//	private PaymentEntity paymentEntity;
	
	@Getter
	@JsonIgnore
	private long requestTime;
	
	@JsonIgnore
	private BaseIdEntity item;
	
	private AbstractDetailPaymentData data;
	
	public <T> T getItem(Class<T> clazz, String errorMessage) {
		if(!clazz.isInstance(this.data)) throw new IllegalStateException(errorMessage);
		return clazz.cast(this.data);
	}
	
	public <T> T getData(Class<T> clazz) {
		if(!clazz.isInstance(this.data)) throw new IllegalStateException("결제 정보를 찾지 못했습니다.");
		return clazz.cast(this.data);
	}
	
	/**
	 * UUID - payer 가 같은지 확인.
	 * 한 유저가 동시에 여러개의 결제 요청을 막기 위함.
	 */
	@Override
	public boolean equals(Object object) {
		if(this == object) return true;
		
		if(object instanceof PaymentData) {
			PaymentData data = (PaymentData) object;
			try {
				return data.payer.getUuid().equals(this.payer.getUuid());
			} catch(NullPointerException npe) {
				return data.payer == null && this.payer == null;
			}
		}
		
		return false;
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(payer);
	}
}