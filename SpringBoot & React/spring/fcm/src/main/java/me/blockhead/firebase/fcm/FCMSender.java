package me.blockhead.firebase.fcm;

import java.io.Closeable;
import java.io.IOException;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import lombok.RequiredArgsConstructor;
import me.blockhead.firebase.fcm.config.FCMConfig;
import me.blockhead.firebase.fcm.message.Message;
import me.blockhead.firebase.fcm.message.Notification;

@RequiredArgsConstructor
public class FCMSender implements Closeable {
	private final FCMConfig config;

	private static final String URL = "https://fcm.googleapis.com/fcm/send";

	private ExecutorService executor = Executors.newSingleThreadExecutor();

	public void send(Iterable<String> registration_ids, Notification notification) throws IOException {
		if (registration_ids == null) throw new NullPointerException("registration_ids");

		send(
			Message.builder()
				.registration_ids(registration_ids)
				.notification(notification)
				.build()
		);
	}

	public void send(String to, Notification notification) throws IOException {
		if (to == null) throw new NullPointerException("to");

		send(
			Message.builder()
				.to(to)
				.notification(notification)
				.build()
		);
	}

	public <T> void execute(Runnable runnable) {
		executor.execute(runnable);
	}

	public void send(Message msg) throws IOException {
		send(config.getSerializer().serialize(msg));
	}

	private void send(String msg) throws IOException {
		URL url = new URL(URL);
		try (HttpsConnection conn = new HttpsConnection(url, config.getAuthorization(), config.getEnc())) {
			conn.write(msg);
		}
	}

	@Override
	public void close() throws IOException {
		executor.shutdown();
	}
}
