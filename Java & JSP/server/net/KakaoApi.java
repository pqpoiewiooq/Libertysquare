package net;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class KakaoApi {
	private static final String CID = "TC0ONETIME";//테스트용 CID
	private static final String ADMIN_KEY = "ffe87c7479e306ec45e08340a518485b";
	
	public static final int APP = 1;
	public static final int PC = 2;
	public static final int MOBILE = 3;
	
	public static synchronized Map<String, String> requestPayment(String userID, String orderID, int platform, String item_name, String item_code, String quantity, String total_amount, boolean tax) {
		String redirect = "";
		try {
			Map<String, String> params = new HashMap<String, String>();
			params.put("cid", CID);
			params.put("partner_order_id", orderID);
			params.put("partner_user_id", userID);
			params.put("item_name", "자유광장 후원");
			params.put("item_code", item_code);
			params.put("quantity", quantity);
			params.put("total_amount", total_amount);
			params.put("tax_free_amount", tax ? "0" : "0");//일단 이래나 저래나 비과세는 0원으로 대충 설정
			params.put("approval_url", "https://support.libertysquare.co.kr/payment/kakao/approve");
			params.put("cancel_url", "https://support.libertysquare.co.kr/payment/kakao/cancel");
			params.put("fail_url", "https://support.libertysquare.co.kr/payment/kakao/fail");
			
			JsonObject obj = request("https://kapi.kakao.com/v1/payment/ready", "POST", params);
			switch(platform) {
			case APP:
				redirect = obj.get("next_redirect_app_url").getAsString();
				break;
			case PC:
				redirect = obj.get("next_redirect_pc_url").getAsString();
				break;
			case MOBILE:
				redirect = obj.get("next_redirect_mobile_url").getAsString();
				break;
			}
			
			Map<String, String> result = new HashMap<String, String>();
			result.put("redirect", redirect);
			result.put("tid", obj.get("tid").getAsString());
			return result;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	
	public static synchronized JsonObject requestPaymentApprove(String tid, String userID, String orderID, String pgToken, String totalAmount) {
		try {
			Map<String, String> params = new HashMap<String, String>();
			params.put("cid", CID);
			params.put("tid", tid);
			params.put("partner_order_id", orderID);
			params.put("partner_user_id", userID);
			params.put("pg_token", pgToken);
			params.put("total_amount", totalAmount);
			
			
			JsonObject obj = request("https://kapi.kakao.com/v1/payment/approve", "POST", params);
			return obj;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	
	private static JsonObject request(String apiUrl, String method, Map<String, String> params) throws Exception {
		try {
			URL url = new URL(apiUrl);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod(method);
			conn.setRequestProperty("Authorization", "KakaoAK " + ADMIN_KEY);
			conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
			conn.setDoInput(true);
			conn.setDoOutput(true);
			
			StringBuffer s_params = new StringBuffer();
			for(Map.Entry<String, String> element : params.entrySet()) {
				s_params.append(element.getKey()).append("=").append(element.getValue()).append("&");
			}
			
			BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
			bw.write(s_params.toString());
			bw.flush();
			
			int responseCode = conn.getResponseCode();
			
			if(responseCode != 200) throw new Exception("request failed");
			
			BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			JsonObject obj = (JsonObject) JsonParser.parseReader(in);
			
			return obj;
		} catch (Exception e) {
			throw e;
		}
	}
}
