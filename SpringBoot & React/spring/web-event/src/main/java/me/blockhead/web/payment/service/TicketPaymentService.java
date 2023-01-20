package me.blockhead.web.payment.service;

import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import me.blockhead.common.exception.DataNotFoundException;
import me.blockhead.common.exception.DuplicateException;
import me.blockhead.common.exception.ForbiddenException;
import me.blockhead.common.user.domain.User;
import me.blockhead.payment.data.PaymentData;
import me.blockhead.payment.domain.Payment;
import me.blockhead.payment.domain.PaymentMethod;
import me.blockhead.payment.domain.PaymentRepository;
import me.blockhead.payment.domain.PaymentStatus;
import me.blockhead.payment.domain.PaymentType;
import me.blockhead.payment.net.TossPayment;
import me.blockhead.payment.service.PaymentDataService;
import me.blockhead.payment.toss.TossRequest;
import me.blockhead.payment.toss.TossResponse;
import me.blockhead.web.attendant.domain.Attendant;
import me.blockhead.web.attendant.domain.AttendantRepository;
import me.blockhead.web.ticket.domain.EventTicket;
import me.blockhead.web.ticket.domain.EventTicketRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketPaymentService {
	private final PaymentRepository paymentRepository;
	private final EventTicketRepository eventTicketRepository;
	private final AttendantRepository attendantRepository;
	
	private final PaymentDataService paymentDataService;
	private final TossPayment tossPayment;

	/**
	 * @return
	 * 	NULL - 무료 티켓. 바로 결제 승인 작업까지 진행 완료함.<br>
	 * 	{@link TossRequest} - 유료 티켓. 결제를 위한 정보 반환
	 */
	public TossRequest prepareTicketPayment(UUID payerUuid, long ticketId, int quantity) {
		if (paymentDataService.find(payerUuid) != null) throw new DuplicateException("결제 대기중인 데이터가 존재합니다.");

		EventTicket ticket = eventTicketRepository.findById(ticketId)
				.orElseThrow(() -> new DataNotFoundException("티켓 정보를 찾지 못하였습니다."));
		ticket.verifyAvailable();

		User payer = tempUser(payerUuid);
		long purchasedQuantity = attendantRepository.countByAttendantAndTicket(payer, ticket);
		
		if ((purchasedQuantity + quantity) > ticket.getPurchaseLimit()) throw new ForbiddenException("1인당 구매 가능 개수를 초과하였습니다.\n구매 개능 개수 : " + (ticket.getPurchaseLimit() - purchasedQuantity));

		if(ticket.isFree()) {
			Payment paymentEntity = Payment.builder()
					.payer(payer)
					.type(PaymentType.FREE)
					.paymentMethod(PaymentMethod.SYSTEM)
					.amount(0)
					.status(PaymentStatus.DONE)
					.build();
			paymentRepository.save(paymentEntity);
			repeatSaveAttendant(paymentEntity, ticket, quantity);
			
			return null;
		} else {
			TossRequest tossRequest = createTossRequest(ticket, quantity);
			PaymentData data = PaymentData.builder()
					.payer(payer)
					.item(ticket)
					.data(tossRequest)
					.requestTime(System.currentTimeMillis())
					.build();

			paymentDataService.add(data);

			return tossRequest;
		}
	}

	private synchronized Payment confirm(PaymentData data, TossResponse response) {
		TossRequest tossRequest = data.getData(TossRequest.class);
		
		if(!tossRequest.compare(response.getOrderId(), response.getAmount())) {
			throw new IllegalStateException("결제 정보가 일치하지 않습니다.");
		}
		
		tossPayment.confirm(response.getPaymentKey(), response.getOrderId(), response.getAmount());
		
		Payment paymentEntity = Payment.builder()
				.payer(data.getPayer())
				.type(PaymentType.NORMAL)
				.paymentMethod(PaymentMethod.TOSS)
				.amount(response.getAmount())
				.status(PaymentStatus.DONE)
				.build();
		paymentRepository.save(paymentEntity);

		return paymentEntity;
	}
	
	public void buyTicket(UUID payerUuid, TossResponse response) {
		PaymentData data = paymentDataService.find(payerUuid);
		if(data == null) throw new IllegalStateException("결제 정보를 찾지 못했습니다.");
		
		EventTicket ticket = data.getItem(EventTicket.class, "결제할 티켓 정보를 찾지 못했습니다.");
		
		Payment payment = confirm(data, response);
		TossRequest request = data.getData(TossRequest.class);
		repeatSaveAttendant(payment, ticket, request.getQuantity());
	}
	
	/**
	 * 해당 유저의 결제 대기 정보를 서버 메모리에서 삭제
	 */
	public void failure(UUID payer) {
		paymentDataService.remove(payer);
	}
	
	private TossRequest createTossRequest(EventTicket ticket, int quantity) {
		String orderName = quantity > 1
				? ticket.getName() + " " + quantity + "매"
				: ticket.getName();
		int totalAmount = ticket.getPrice() * quantity;
		
		return new TossRequest(orderName, totalAmount, quantity);
	}
	
	private void repeatSaveAttendant(Payment payment, EventTicket ticket, int repeat) {
		for(int i = 0; i < repeat; i++) {
			Attendant attendant = Attendant.builder()
					.attendant(payment.getPayer())
					.payment(payment)
					.ticket(ticket)
					.build();
			attendantRepository.save(attendant);
		}
	}
	
	/**
	 * Create a temporary user entity for DB operations
	 */
	private User tempUser(UUID uuid) {
		return User.builder().uuid(uuid).build();
	}
}
