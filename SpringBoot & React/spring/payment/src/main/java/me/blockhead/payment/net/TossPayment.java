package me.blockhead.payment.net;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

import com.fasterxml.jackson.databind.JsonNode;

import lombok.RequiredArgsConstructor;
import me.blockhead.common.util.JsonUtils;
import me.blockhead.payment.exception.PaymentException;
import me.blockhead.payment.toss.TossConfig;

@RequiredArgsConstructor
public class TossPayment {
	private final TossConfig config;
	
	private final String API_URL = "https://api.tosspayments.com/v1/payments/";
	
	private URL createURL(String path) {
		try {
			return new URL(API_URL + path);
		} catch(IOException e) {
			throw new PaymentException(e.getMessage());
		}
	}

	public String confirm(String paymentKey, String orderId, int amount) {
		URL url = createURL(paymentKey);
		String payload = "{\"orderId\":\"" + orderId + "\",\"amount\":" + amount + "}";
		request(url, payload);

		return paymentKey;
	}

	public void cancel(String paymentKey, String reason) {
		URL url = createURL(paymentKey + "/cancel");
		String payload = "{\"cancelReason\":\"" + reason + "\"}";
		request(url, payload);
	}

	private void request(URL url, String payload) {
		try (HttpsConnection conn = new HttpsConnection(url, config.getKey(), config.getCharset())) {
			int responseCode = conn.write(payload);

			if (responseCode != HttpURLConnection.HTTP_OK) {
				throw new PaymentException(parseErrorMessage(conn));
			}
		} catch (IOException e) {
			throw new PaymentException(e.getMessage());
		}
	}

	private String parseErrorMessage(HttpsConnection conn) throws IOException {
		JsonNode response = JsonUtils.parseJsonObject(conn.getErrorStream());
		// String code = response.get("code").asText();
		return response.get("message").asText();
	}
}
