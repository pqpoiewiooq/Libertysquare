package me.blockhead.payment.net;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.Closeable;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URL;
import java.nio.charset.Charset;

import javax.net.ssl.HttpsURLConnection;

public class HttpsConnection implements Closeable {
	private HttpsURLConnection conn;
	private Charset cs;

	public HttpsConnection(URL url, String authorization) throws IOException {
		this(url, authorization, Charset.defaultCharset());
	}

	public HttpsConnection(URL url, String authorization, Charset cs) throws IOException {
		this.conn = (HttpsURLConnection) url.openConnection();
		this.cs = cs == null ? Charset.defaultCharset() : cs;

		initConnection(authorization);
	}

	public HttpsURLConnection getHttpsURLConnection() {
		return conn;
	}

	private void initConnection(String authorization) throws IOException {
		conn.setRequestMethod("POST");

		conn.setRequestProperty("Content-Type", "application/json; charset=utf-8");
		conn.setRequestProperty("Authorization", authorization);
		conn.setRequestProperty("cache-control", "no-cache");
		conn.setUseCaches(false);

		conn.setDoOutput(true);
		conn.setDoInput(true);

		conn.connect();
	}

	public int write(String msg) throws IOException {
		return write(msg, cs);
	}

	public int write(String msg, Charset cs) throws IOException {
		if (cs == null) cs = Charset.defaultCharset();

		try (BufferedOutputStream bos = new BufferedOutputStream(conn.getOutputStream())) {
			bos.write(msg.getBytes(cs));
			bos.flush();
		}

		return conn.getResponseCode();
	}

	public String read() throws IOException {
		return read(cs);
	}

	public String read(Charset cs) throws IOException {
		if (cs == null) cs = Charset.defaultCharset();

		StringBuffer buffer = null;
		try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), cs))) {
			buffer = new StringBuffer();
			String temp = null;
			while ((temp = reader.readLine()) != null) {
				buffer.append(temp);
			}
		}

		return buffer.toString();
	}

	public OutputStream getOutputStream() throws IOException {
		return conn.getOutputStream();
	}

	public InputStream getInputStream() throws IOException {
		return conn.getInputStream();
	}

	public InputStream getErrorStream() throws IOException {
		return conn.getErrorStream();
	}

	@Override
	public void close() throws IOException {
		conn.disconnect();
	}

}
