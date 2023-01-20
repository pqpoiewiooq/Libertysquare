package com.libertysquare.common.util;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.Closeable;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.Charset;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;

import com.libertysquare.common.util.SimpleHttpsResponse.SimpleHttpsResponseBuilder;

import lombok.Builder;

@Builder
public class SimpleHttpsRequest {
	@Builder.Default
	private Charset charset = Charset.defaultCharset();

	private String url;
	private Map<String, String> requestProperties;
	
	@Builder.Default
	private boolean doInput = true;

	/**
	 * {@link HttpURLConnection#HTTP_OK} 만 허용
	 */
	public SimpleHttpsResponse send(String output) throws IOException {
		HttpsURLConnection conn = null;
		BufferedOutputStream bos = null;
		BufferedReader reader = null;
		URL url = new URL(this.url);
		try {
			URLConnection connection = conn = (HttpsURLConnection) url.openConnection();
			if (requestProperties != null) {
				requestProperties.forEach((key, value) -> {
					connection.setRequestProperty(key, value);
				});
			}
	
			conn.setDoOutput(true);
			if (doInput) conn.setDoInput(doInput);
	
			conn.connect();
	
			bos = new BufferedOutputStream(conn.getOutputStream());
	
			bos.write(output.getBytes(charset));
	
			bos.flush();
			close(bos);
	
			int responseCode = conn.getResponseCode();
			SimpleHttpsResponseBuilder responseBuilder = new SimpleHttpsResponseBuilder()
					.status(responseCode);
			if (doInput && responseCode == HttpURLConnection.HTTP_OK) {
				StringBuffer buffer = new StringBuffer();
				reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), charset));
				String temp = null;
				while ((temp = reader.readLine()) != null) {
					buffer.append(temp);
				}
				buffer.toString();
				responseBuilder.data(buffer.toString());
			}
			return responseBuilder.build();
		} catch(IOException e) {
			throw e;
		} finally {
			close(reader);
			close(bos);
			conn.disconnect();
		}
	}

	private void close(Closeable closeable) {
		if (closeable == null)
			return;
		try {
			closeable.close();
		} catch (Exception e) {
		}
	}
	
	public static class SimpleHttpsRequestBuilder {
		public SimpleHttpsRequestBuilder() {}
	}
}
