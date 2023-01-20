package servlet.common;

import javax.servlet.http.HttpServletResponse;
public enum ServletStatus {
	NOT_FOUND_PARAMETER(HttpServletResponse.SC_BAD_REQUEST, "Not Found Parameter"), // 파라미터가 null인 경우
	INVALID_PARAMETER(HttpServletResponse.SC_BAD_REQUEST, "Invalid Parameter"),// 잘못된 파라미터 - 숫자여야하는데 문자이거나 하는 등
	CRYPTO_ERROR(HttpServletResponse.SC_BAD_REQUEST, "Crypto Error"),
	NOT_FOUND(HttpServletResponse.SC_NOT_FOUND, "Not Found"), // DB 쿼리에서 받은 값이 없는 경우.
	UNAUTHORIZED(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized"),// 세션이 없거나 로그인 되지 않은 상태
	NOT_ACCEPTABLE(HttpServletResponse.SC_NOT_ACCEPTABLE, "Not Acceptable"), // 받아들일 수 없음 - Payment에서 Data가 없을 경우 사용하기로 결정 + 회원가입시, data가 없을 경우에도 사용
	FORBIDDEN(HttpServletResponse.SC_FORBIDDEN, "Forbidden"), // 권한 없음
	//public static final int SC_UNPROCESSABLE_ENTITY = 422;
	UNPROCESSABLE_ENTITY(422, "Unprocessable Entity"),// 요청 수행 거절(A를 B로 바꾸는것을 거절한다!)
	CONFLICT(HttpServletResponse.SC_CONFLICT, "Conflict"), // 이미 처리된 값인 경우. (A -> A로 변경 요청한 경우)
	IMAGE_UPLOAD_FAILED(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Image Upload Failed"),// 이미지 이동(생성) 실패
	DB_CONNECTION_FAILED(HttpServletResponse.SC_SERVICE_UNAVAILABLE, "DB Connection Failed"),// DB 연결 실패
	DB_ERROR(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "DB Query Error");// DB 작업 실패

	private int status;
	private String msg;

	ServletStatus(int status, String msg) {
		this.status = status;
		this.msg = msg;
	}

	public int getStatus() {
		return this.status;
	}
	
	public String getMessage() {
		return this.msg;
	}
}