package me.blockhead.web.payment.presentation;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import javax.validation.constraints.Positive;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import me.blockhead.common.annotation.user.Login;
import me.blockhead.common.user.presentation.UserDTO;
import me.blockhead.common.util.JsonUtils;
import me.blockhead.payment.toss.TossRequest;
import me.blockhead.payment.toss.TossResponse;
import me.blockhead.web.payment.service.TicketPaymentService;

@RestController
@RequestMapping("/payment")
public class TicketPaymentController {
	@Autowired
	private TicketPaymentService ticketPaymentService;
	
	/**
	 * @return
	 * 201 CREATED - 무료 티켓인 경우. 자동으로 결제 프로세스를 완료.<br>
	 * 202 ACCEPTED - 유료 티켓인 경우. 토스 결제 정보를 return
	 */
	@Login
	@GetMapping("/ticket")
	public String requestBuyTicket(
			HttpServletResponse response,
			@RequestParam("id") @Positive long id,
			@RequestParam("quantity") @Positive int quantity,
			UserDTO user) {
		TossRequest request = ticketPaymentService.prepareTicketPayment(user.getUuid(), id, quantity);
		response.setStatus(request == null ? HttpServletResponse.SC_CREATED : HttpServletResponse.SC_ACCEPTED);
		return JsonUtils.toJson(request);
	}
	
	@Login
	@PostMapping("/ticket")
	@ResponseStatus(HttpStatus.CREATED)
	public void requestConfirmTicket(@RequestBody @Valid TossResponse response, UserDTO user) {
		ticketPaymentService.buyTicket(user.getUuid(), response);
	}
	
	@Login
	@DeleteMapping("/failure")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void requestConfirmTicket(UserDTO user) {
		ticketPaymentService.failure(user.getUuid());
	}
	
	@InitBinder
	public void initBinder(WebDataBinder webDataBinder){
	    webDataBinder.setDisallowedFields("id");// id 값을 자동 바인딩하는걸 막아줌(UserDTO#id 에 바인딩 되는 문제때문에 설정)
	}
}
