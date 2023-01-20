package servlet.restapi;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonObject;

import account.User;
import dao.AttendantDAO;
import dao.DAOFactory;
import dao.EventDAO;
import dao.HostDAO;
import dao.PaymentDAO;
import dao.TicketDAO;
import dao.UserDAO;
import data.Attendant;
import data.Event;
import data.Host;
import data.PaymentData;
import data.Ticket;
import exception.MyServletException;
import net.FirebaseMessage;
import net.FirebaseSender;
import servlet.common.MyHttpServlet;
import servlet.common.ServletStatus;
import servlet.util.RequestParser;
import servlet.util.ServletHelper;
import util.CryptoHelper;
import util.DateUtil;
import util.JsonUtil;

public class PaymentAPI extends MyHttpServlet {
	private static final long serialVersionUID = 5108251870187898704L;
	
	private static final ArrayList<PaymentData> paymentList = new ArrayList<>();
	private static final int REQUEST_LIMIT = 1000 * 60 * 10;// 10분
	private static final String SECRET_KEY = "live_sk_jkYG57Eba3GbGdOK4Rw8pWDOxmA1";//"test_sk_4vZnjEJeQVxPRmmkEmdVPmOoBN0k";

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String uri = request.getRequestURI();
		
		switch(uri) {
		case "/toss/payment-data":
			sendPaymentData(request, response);
			break;
		case "/toss/success":
			confirmPayment(request, response);
			break;
		case "/toss/fail":
			failPayment(request, response);
			break;
		}
	}
	
	@Override
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		cancelPayment(request, response);
	}
	
	// 아래 함수 사용하여 필터링
	private PaymentData searchData(String orderId) {
		long ctime = System.currentTimeMillis();
		PaymentData result = null;
		
		Iterator<PaymentData> it = paymentList.iterator();
		while(it.hasNext()) {
			PaymentData data = it.next();
			if((ctime - data.getRequestTime()) > REQUEST_LIMIT) {
				it.remove();
			} else if(data.getOrderId().equals(orderId)) {
				result = data;
			}
		}
		return result;
	}
	
	private String createOrderId() {
		String uuid = UUID.randomUUID().toString().replaceAll("-", "");
		if(searchData(uuid) != null) return createOrderId();
		return uuid;
	}
	
	private void sendPaymentData(HttpServletRequest request, HttpServletResponse response) throws IOException {
		long requestTime = System.currentTimeMillis();
		
		User user = getUser(request);
		
		long ticketId = RequestParser.getLong(request, "ticketID");
		int amount = RequestParser.getInt(request, "amount");
		if(amount < 0) throw new MyServletException("티켓은 0개 이상 구매 가능합니다.");
		
		processDAO(TicketDAO.class, dao -> {
			Ticket ticket = dao.get(ticketId);
			if(ticket == null) throw new MyServletException(ServletStatus.NOT_FOUND, "ticket");
			if(DateUtil.wasExpired(ticket.getEndDate())) throw new MyServletException(ServletStatus.UNPROCESSABLE_ENTITY, "판매 기간이 종료된 티켓입니다.");
			
			AttendantDAO adao = DAOFactory.convert(dao, AttendantDAO.class);
			int purchasedAmount = adao.count(user.getUUID(), ticket.getID());
			if(purchasedAmount < 0) throw new MyServletException(ServletStatus.NOT_FOUND, "구매 정보를 찾지 못하였습니다."); 
			if((purchasedAmount + amount) > ticket.getPurchaseLimit()) throw new MyServletException(ServletStatus.UNPROCESSABLE_ENTITY, "1인당 구매 가능 개수를 초과하였습니다.\n구매 개능 개수 : " + (ticket.getPurchaseLimit() - purchasedAmount));
			
			EventDAO edao = DAOFactory.convert(dao, EventDAO.class);
			Event event = edao.getEventFromTicketID(ticket.getID());
			if(event == null) throw new MyServletException(ServletStatus.NOT_FOUND, "행사 정보를 찾지 못하였습니다.");
			if(event.getStatus() == Event.Status.DELETED) throw new MyServletException(ServletStatus.UNPROCESSABLE_ENTITY, "삭제된 행사의 티켓입니다.");
			if(DateUtil.wasExpired(event.getDateTimeEnd())) throw new MyServletException(ServletStatus.UNPROCESSABLE_ENTITY, "이미 종료된 행사입니다.");
			
			String uuid = createOrderId();
			int price = ticket.getPrice() * amount;
			String orderName = amount > 1 ? ticket.getName() + " " + amount + "매" : ticket.getName();
			
			PaymentData data = new PaymentData();
			data.setOrderId(uuid);
			data.setAmount(price);
			data.setOrderName(orderName);
			data.setUser(user);
			data.setRequestTime(requestTime);
			data.setTicket(ticket);
			data.setTicketAmount(amount);
			data.setEventID(event.getID());
			data.setHostID(event.getHost());
			
			paymentList.add(data);
			
			print(response, data.toJson());
		});
	}

	private synchronized void confirmPayment(HttpServletRequest request, HttpServletResponse response) throws IOException {
		User user = getUser(request);
		
		String param = request.getParameter("_");
		if(param == null) {
			String paymentKey = RequestParser.get(request, "paymentKey");
			String orderId = RequestParser.get(request, "orderId");
			int amount = RequestParser.getInt(request, "amount");
			
			PaymentData data = searchData(orderId);
			if(data == null) throw new MyServletException(ServletStatus.NOT_ACCEPTABLE);
			if(!data.compare(user, orderId, amount)) throw MyServletException.FORBIDDEN;
			
			BufferedWriter bw = null;
			try {
				URL url = new URL("https://api.tosspayments.com/v1/payments/" + paymentKey);
				HttpURLConnection conn = (HttpURLConnection) url.openConnection();
				conn.setRequestMethod("POST");
				conn.setUseCaches(false);
				conn.setRequestProperty("Authorization", "Basic " + Base64.getEncoder().encodeToString((SECRET_KEY + ":").getBytes()));
				conn.setRequestProperty("Content-Type", "application/json; utf-8");
				conn.setDoInput(true);
				conn.setDoOutput(true);
	
				bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
				bw.write("{\"orderId\":\"" + orderId + "\",\"amount\":" + amount + "}");
				bw.flush();
	
				int responseCode = conn.getResponseCode();
				JsonObject responseObject;
				
				if(responseCode == HttpURLConnection.HTTP_OK) {
					responseObject = JsonUtil.parseJsonObject(conn.getInputStream());
					//String sOrderId = responseObject.get("orderId").getAsString();
					//String secret = responseObject.get("secret").getAsString();
					data.setPaymentKey(paymentKey);
					insertConfirmData(request, response, data);
				} else {
					responseObject = JsonUtil.parseJsonObject(conn.getErrorStream());
					String message = responseObject.get("message").getAsString();
					//String code = responseObject.get("code").getAsString();
					ServletHelper.alert(response.getWriter(), message, "/");
				}
			} catch(IOException e) {
				throw new MyServletException(HttpServletResponse.SC_BAD_GATEWAY, "Payment server communication error");
			} finally {
				try {
					if(bw != null) bw.close();
				} catch(Exception e) {}
			}
		} else {// 무료 - 바로 DB 작업
			PaymentData data = searchData(param);
			if(data == null) throw new MyServletException(ServletStatus.NOT_ACCEPTABLE);
			
			if(!data.compare(user, param, 0)) throw MyServletException.FORBIDDEN;
			
			insertConfirmData(request, response, data);
			return;
		}
	}
	
	private void insertConfirmData(HttpServletRequest request, HttpServletResponse response, PaymentData data) throws IOException {
		data.setApprovedTime(DateUtil.defaultFormat(System.currentTimeMillis()));
		paymentList.remove(data);
		
		processDAO(PaymentDAO.class, dao -> {
			try {
				dao.setAutoCommit(false);
				
				long paymentID = dao.insert(data);
				if(paymentID == -1) throw new MyServletException(ServletStatus.DB_ERROR, "insert payment(" + data.getOrderId() + ")");
				
				AttendantDAO adao = DAOFactory.convert(dao, AttendantDAO.class);
				for(int i = 0; i < data.getTicketAmount(); i++) {
					Attendant attendant = new Attendant();
					Ticket ticket = data.getTicket();
					attendant.setPaymentID(paymentID);
					attendant.setTicket(ticket);
					attendant.setHostID(data.getHostID());
					attendant.setUserUUID(data.getUser().getUUID());
					attendant.setState(ticket.getType() == Ticket.Type.FCFS ? Attendant.State.APPROVE : Attendant.State.WAIT);
					attendant.setPaymentTime(data.getApprovedTime());
					if(adao.insert(attendant) < 0) throw new MyServletException(ServletStatus.DB_ERROR, "insert a-" + i);
				}
				
				dao.commit();
				dao.setAutoCommit(true);
				
				ServletHelper.alert(response.getWriter(), "구매 완료되었습니다.", "/my/tickets");
			} catch(Exception e) {
				ServletHelper.alert(response.getWriter(), "서버 오류입니다.\\n잠시 후 다시 시도해주세요.\\n" + e.getMessage(), "/");
			}
			
			// 알림
			notifyToHost(data.getEventID(), data.getHostID());
		});
	}
	
	private void notifyToHost(long eventId, long hostId) {
		FirebaseSender.execute(() -> {
			try {
				processDAO(EventDAO.class, dao -> {
					String eventTitle = dao.getTitle(eventId);
					
					HostDAO hostDAO = DAOFactory.convert(dao, HostDAO.class);
					Host host = hostDAO.get(hostId);
					
					Set<byte[]> userUuids = new HashSet<>();
					for(String uuidStr : host.getMembers()) {
						userUuids.add(CryptoHelper.hexStringToByteArray(uuidStr));
					}
					
					UserDAO userDAO = DAOFactory.convert(dao, UserDAO.class);
					
					Set<String> tokens = userDAO.getFcmTokenAll(userUuids);
					FirebaseSender.send(FirebaseMessage
							.buyTicket(eventTitle, eventId)
							.registration_ids(tokens)
							.build());
				});
			} catch (IOException e) {
				e.printStackTrace();
			}
		});
	}
	
	private void failPayment(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String code = request.getParameter("code");
		String message = request.getParameter("message");
		if(code == null || message == null) {
			ServletHelper.alert(response.getWriter(), "잘못된 접근입니다.", "/");
			return;
		}
		
		ServletHelper.alert(response.getWriter(), message, "/");
	}
	
	private void cancelPayment(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String cancelTime = DateUtil.defaultFormat(System.currentTimeMillis());
		
		User user = getUser(request);
		
		long paymentId = RequestParser.getLong(request, "paymentID");
		
		processDAO(PaymentDAO.class, dao -> {
			PaymentData data = dao.get(paymentId);
			if(data == null) throw new MyServletException(ServletStatus.NOT_FOUND, "data");
			
			String cancelReason = null;
			if(user.getUUID().equals(data.getUser().getUUID())) {
				// 유저는 ticket 환불일 전에만 환불 가능
				TicketDAO tdao = DAOFactory.convert(dao, TicketDAO.class);
				Ticket ticket = tdao.get(data.getTicket().getID());
				if(DateUtil.wasExpired(ticket.getRefundDeadline())) {
					throw new MyServletException(ServletStatus.UNPROCESSABLE_ENTITY, "The refund date has passed");
				}
				cancelReason = "유저 요청";
			} else {
				HostDAO hdao = DAOFactory.convert(dao, HostDAO.class);
				Host host = hdao.get(data.getHostID());
				if(host == null) throw new MyServletException(ServletStatus.NOT_FOUND, "host");
				
				if(host.containMember(user.getUUID())) {
					// 관리자는 행사 종료 전까지 환불 가능
					EventDAO edao = DAOFactory.convert(dao, EventDAO.class);
					Event event = edao.get(data.getEventID());
					if(DateUtil.wasExpired(event.getDateTimeEnd())) {
						throw new MyServletException(ServletStatus.UNPROCESSABLE_ENTITY, "The refundable date has passed");
					}
					cancelReason = "관리자 : [" + user.getUUID() + "] 요청";
				} else {
					throw MyServletException.FORBIDDEN;
				}
			}

			// DB에도 적용 필수이므로, autoCommit을 false로 해두고, 먼저 DB 작업 진행.
			dao.setAutoCommit(false);
			
			if(!dao.refundPayment(data.getID(), cancelTime)) {
				throw new MyServletException(ServletStatus.DB_ERROR, "update refund data");
			}
			
			AttendantDAO adao = DAOFactory.convert(dao, AttendantDAO.class);
			ArrayList<Attendant> list = adao.getAttendantListFromPaymentID(paymentId);
			for(Attendant attendant : list) {
				Attendant.State state = attendant.getState();
				if(state == Attendant.State.ATTEND) {
					throw new MyServletException(ServletStatus.UNPROCESSABLE_ENTITY, "non-refundable payment. ticket has already been attended");
				} else if(state == Attendant.State.REFUND) {
					throw new MyServletException(ServletStatus.UNPROCESSABLE_ENTITY, "non-refundable payment. ticket has already been refunded");
				}
			}
			
			for(Attendant attendant : list) {
				if(!adao.updateState(attendant.getID(), Attendant.State.REFUND)) {
					throw new MyServletException(ServletStatus.DB_ERROR, "update attendant");
				}
			}
			
			if(data.getAmount() == 0) {
				dao.commit();
				dao.setAutoCommit(true);
				return;
			}
			
			BufferedWriter bw = null;
			try {
				URL url = new URL("https://api.tosspayments.com/v1/payments/" + data.getPaymentKey() + "/cancel");
				HttpURLConnection conn = (HttpURLConnection) url.openConnection();
				conn.setRequestMethod("POST");
				conn.setUseCaches(false);
				conn.setRequestProperty("Authorization", "Basic " + Base64.getEncoder().encodeToString((SECRET_KEY + ":").getBytes()));
				conn.setRequestProperty("Content-Type", "application/json; utf-8");
				conn.setDoInput(true);
				conn.setDoOutput(true);

				bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
				bw.write("{\"cancelReason\":\"" + cancelReason + "\"}");
				bw.flush();

				int responseCode = conn.getResponseCode();
				JsonObject responseObject;
				
				if(responseCode == HttpURLConnection.HTTP_OK) {
					dao.commit();
					dao.setAutoCommit(true);
				} else {
					dao.rollback();
					dao.setAutoCommit(true);
					responseObject = JsonUtil.parseJsonObject(conn.getErrorStream());
					String message = responseObject.get("message").getAsString();
					ServletHelper.alert(response.getWriter(), message, "/");
				}
			} catch(IOException e) {
				throw new MyServletException(HttpServletResponse.SC_BAD_GATEWAY, "Payment server communication error");
			} finally {
				try {
					if(bw != null) bw.close();
				} catch(Exception e) {}
			}
		});
	}
}
