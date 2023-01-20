package me.blockhead.web.attendant.domain;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import me.blockhead.common.domain.BaseIdEntity;
import me.blockhead.common.exception.UnprocessableException;
import me.blockhead.common.user.domain.User;
import me.blockhead.payment.domain.Payment;
import me.blockhead.web.ticket.domain.EventTicket;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Attendant extends BaseIdEntity {
	@NotNull
	@ManyToOne
	@JoinColumn
	private User attendant;

	@NotNull
	@ManyToOne
	@JoinColumn
	private EventTicket ticket;
	
	@NotNull
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn
	private Payment payment;

	@NotNull
	@Enumerated(EnumType.STRING)
    private AttendantStatus status;
	
	public void updateStatus(AttendantStatus status) {
		if(this.status.equals(status)) throw new UnprocessableException("이미 처리된 요청입니다.");
		switch(this.status) {
			case ATTEND:
				if(status != AttendantStatus.APPROVE) {
					throw new UnprocessableException("");
				}
				break;
			case APPROVE:
				if(!(status == AttendantStatus.WAIT || status == AttendantStatus.ATTEND)) {
					throw new UnprocessableException("");
				}
				break;
			case WAIT:
				if(status != AttendantStatus.APPROVE) {
					throw new UnprocessableException("");
				}
				break;
			default:
				throw new UnprocessableException("");
		}
	}
}
