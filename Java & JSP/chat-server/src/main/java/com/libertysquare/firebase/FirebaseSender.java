package com.libertysquare.firebase;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.Closeable;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.net.ssl.HttpsURLConnection;

import org.springframework.stereotype.Service;

import com.libertysquare.common.util.JsonUtils;

@Service
public class FirebaseSender implements Closeable {
	private static final String URL = "https://fcm.googleapis.com/fcm/send";
	private static final String AUTHORIZATION = "key=AAAAYmO548k:APA91bF0AlE6UxLt8p_ECh_hsMeBg0lPs3-6fQdalkcYTbxatsr2JXhh1hW863TPE1_t9CakqnGV0IwkW8EpWOCVy1dcrV-dUisEb3IfpKye5v1sK41Ln87u1xjYHGtRDIZpEZ-ryFei";
	private static final String ENC = "UTF-8";
	
	private final ExecutorService executor = Executors.newSingleThreadExecutor();
	
	public void send(Iterable<String> registration_ids, Notification notification) {
		if(registration_ids == null) return;
		
		send(FirebaseMessage.builder()
				.registration_ids(registration_ids)
				.notification(notification)
				.build());
	}
	
	public void send(String to, Notification notification) {
		if(to == null) return;
		
		send(FirebaseMessage.builder()
				.to(to)
				.notification(notification)
				.build());
	}
	
	public <T> void execute(Runnable runnable) {
		executor.execute(runnable);
	}
	
	public void send(FirebaseMessage msg) {
		send(JsonUtils.toJson(msg));
	}
	
	private void send(String output) {
		HttpsURLConnection conn = null;
		BufferedOutputStream bos = null;
		BufferedReader reader = null;
		try {
		    URL url = new URL(URL);
		    conn = (HttpsURLConnection) url.openConnection();
		    conn.setRequestProperty("Content-Type", "application/json; charset=utf-8");
		    conn.setRequestProperty("cache-control", "no-cache");
		    conn.setRequestProperty("Authorization", AUTHORIZATION);

		    conn.setDoOutput(true);
		    conn.setDoInput(true);

		    conn.connect();

		    bos = new BufferedOutputStream(conn.getOutputStream());

		    bos.write(output.getBytes(ENC));

		    bos.flush();
		    bos.close();

		    int responseCode = conn.getResponseCode();
		    StringBuffer buffer = null;
		    if (responseCode == HttpURLConnection.HTTP_OK) {

		        buffer = new StringBuffer();
		        reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), ENC));
		        String temp = null;
		        while ((temp = reader.readLine()) != null) {
		            buffer.append(temp);
		        }
		        reader.close();
		    }
		    conn.disconnect();
		} catch (IOException e) {
		    e.printStackTrace();
		} finally {
			close(reader);
			close(bos);
			conn.disconnect();
		}
	}
	
	private void close(Closeable closeable) {
		if(closeable == null) return;
		try {
			closeable.close();
		} catch(Exception e) {}
	}

	@Override
	public void close() throws IOException {
		executor.shutdown();
	}
}
