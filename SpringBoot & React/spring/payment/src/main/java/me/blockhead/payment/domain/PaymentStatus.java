package me.blockhead.payment.domain;

public enum PaymentStatus {
	DONE, CANCELED
	
//	READY - 준비됨
//	IN_PROGRESS - 진행중
//	WAITING_FOR_DEPOSIT - 가상계좌 입금 대기 중
//	DONE - 결제 완료됨
//	CANCELED - 결제가 취소됨
//	PARTIAL_CANCELED - 결제가 부분 취소됨
//	ABORTED - 카드 자동결제 혹은 키인 결제를 할 때 결제승인에 실패함
//	EXPIRED - 유효 시간(30분)이 지나 거래가 취소됨
}
