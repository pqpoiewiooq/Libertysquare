package exception;

import javax.servlet.http.HttpServletResponse;

import servlet.common.ServletStatus;

public class MyServletException extends OptimizedUncheckedException {
	private static final long serialVersionUID = -5249335322497636751L;
	
//	public static final String MSG_NO_SESSION = "no session";
//	public static final String MSG_NO_ACCOUNT = "no access";
//	public static final String MSG_AUTHORIZATION_NOT_AVAILABLE = "Authorization not available";
//	public static final String MSG_DB_CONNECTION_FAILED = "DB connection failed";
	
	public static final MyServletException UNAUTHORIZED = new MyServletException(ServletStatus.UNAUTHORIZED);
	public static final MyServletException FORBIDDEN = new MyServletException(ServletStatus.FORBIDDEN);
	public static final MyServletException DB_CONNECTION_FAILED = new MyServletException(ServletStatus.DB_CONNECTION_FAILED);
	public static final MyServletException DB_ERROR = new MyServletException(ServletStatus.DB_ERROR);
	public static final MyServletException NOT_IMPLEMENTED = new MyServletException(HttpServletResponse.SC_NOT_IMPLEMENTED, "");
	public static final MyServletException NOT_FOUND = new MyServletException(ServletStatus.NOT_FOUND);
	public static final MyServletException CONFLICT = new MyServletException(ServletStatus.CONFLICT);
	public static final MyServletException UNPROCESSABLE_ENTITY = new MyServletException(ServletStatus.UNPROCESSABLE_ENTITY);
	
	private int status;
	
	public MyServletException(int status, String msg) {
		super(msg);
		this.status = status;
	}
	
	public MyServletException(String msg) {
		super(msg);
		this.status = HttpServletResponse.SC_BAD_REQUEST;
	}
	
	public MyServletException(ServletStatus status) {
		super(status.getMessage());
		this.status = status.getStatus();
	}
	
	public MyServletException(ServletStatus status, String value) {
		super(status.getMessage() + " : " + value);
		this.status = status.getStatus();
	}
	
	public int getStatus() {
		return this.status;
	}
}