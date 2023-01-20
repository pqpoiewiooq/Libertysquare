package net;

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

import util.JsonUtil;

public class FirebaseSender {
	private static final String URL = "https://fcm.googleapis.com/fcm/send";
	private static final String AUTHORIZATION = "key=FIREBASEKEY";
	private static final String ENC = "UTF-8";
	
	private static ExecutorService executor = Executors.newSingleThreadExecutor();
	
	private FirebaseSender() {}
	
	public static void send(Iterable<String> registration_ids, Notification notification) {
		if(registration_ids == null) return;
		
		send(FirebaseMessage.builder()
				.registration_ids(registration_ids)
				.notification(notification)
				.build());
	}
	
	public static void send(String to, Notification notification) {
		if(to == null) return;
		
		send(FirebaseMessage.builder()
				.to(to)
				.notification(notification)
				.build());
	}
	
	public static <T> void execute(Runnable runnable) {
		executor.execute(runnable);
	}
	
	public static void send(FirebaseMessage msg) {
		send(JsonUtil.toJson(msg));
	}
	
	private static void send(String output) {
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
		    System.out.println(responseCode);
		    conn.disconnect();
		} catch (IOException e) {
		    e.printStackTrace();
		} finally {
			close(reader);
			close(bos);
			conn.disconnect();
		}
	}
	
	private static void close(Closeable closeable) {
		if(closeable == null) return;
		try {
			closeable.close();
		} catch(Exception e) {}
	}
	
	public static void destroy() {
		executor.shutdown();
		executor = null;
	}
}
