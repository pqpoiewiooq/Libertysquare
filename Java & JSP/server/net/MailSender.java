package net;

import java.io.File;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.Address;
import javax.mail.Authenticator;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.internet.MimeUtility;
import javax.servlet.http.HttpServletResponse;

import exception.MyServletException;

public class MailSender {
	private static final MyServletException EXCEPTION = new MyServletException(HttpServletResponse.SC_BAD_GATEWAY, "Mail server communication error");
	
	private static final String SENDER = "SENDER@gmail.com";
	private static final String RECEIVER = "RECEIVER@gmail.com";
	
	private MailSender() {}
	
//	public static void send(String subject, String content) throws MessagingException, IOException {
//		Properties props = new Properties();
//		props.setProperty("mail.transport.protocol", "smtp");
//		props.setProperty("mail.host", "smtp.gmail.com");
//		props.put("mail.smtp.auth", "true");
//		props.put("mail.smtp.port", "465");
//		props.put("mail.smtp.socketFactory.port", "465");
//		props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
//		props.put("mail.smtp.socketFactory.fallback", "false");
//		props.put("mail.smtp.starttls.enable", "true");
//		props.setProperty("mail.smtp.quitwait", "false");
//		Session session = Session.getInstance(props, new Authenticator() {
//			protected PasswordAuthentication getPasswordAuthentication() {
//				return new PasswordAuthentication("khc981212@gmail.com", "lzlagvupinwntgdv");// Sender 계정 id / pw
//			}
//		});
//		session.setDebug(true);
//
//		MimeMessage message = new MimeMessage(session);
//		message.setFrom(new InternetAddress("khc981212@gmail.com"));// 송신자
//		Address[] addresses = new Address[1];
//		addresses[0] = new InternetAddress("libertysquare.data@gmail.com");// 수신자 주소 변환
//		message.addRecipients(Message.RecipientType.TO, addresses);// 수신자
//		message.addRecipients(Message.RecipientType.CC, addresses);// 참조 수신자
//		message.addRecipients(Message.RecipientType.BCC, addresses);// 숨은 참조 수신자
//
//		message.setSubject(MimeUtility.encodeText(subject, "UTF-8", "B"));// 메일 제목
//
//		// 메일 내용
//		message.setContent(new MimeMultipart());
//		Multipart mp = (Multipart) message.getContent();
//
//		BodyPart mbp = new MimeBodyPart();
//		mbp.setContent(content, "text/html; charset=utf-8");
//		mp.addBodyPart(mbp);
//
//		Transport.send(message);
//	}
	
	public static void send(String subject, String content) throws MyServletException {
		try {
			Multipart mp = new MimeMultipart();
			mp.addBodyPart(createContentPart(content));
			send(subject, mp);
		} catch (Exception e) {
			throw EXCEPTION;
		}
	}
	
	private static BodyPart createContentPart(String content) throws MessagingException {
		BodyPart mbp = new MimeBodyPart();
		mbp.setContent(content, "text/html; charset=utf-8");
		return mbp;
	}
	
	private static BodyPart createFilePart(File file) throws MessagingException {
		FileDataSource fds = new FileDataSource(file);
		BodyPart filePart = new MimeBodyPart();
		filePart.setDataHandler(new DataHandler(fds));
		filePart.setFileName(fds.getName());
		return filePart;
	}
	
	public static void send(String subject, String content, File file) throws MyServletException {		
		try {
			Multipart mp = new MimeMultipart();

			mp.addBodyPart(createContentPart(content));
			if(file != null) mp.addBodyPart(createFilePart(file));
			
			send(subject, mp);
		} catch (Exception e) {
			throw EXCEPTION;
		}
	}
	
	public static void send(String subject, Multipart content) throws MyServletException {
		try {
			Properties props = DefaultProperties.getInstance();
			Session session = Session.getInstance(props, DefaultAuthenticator.getInstance());
			//session.setDebug(true);
	
			MimeMessage message = createMimeMessage(session);
			message.setSubject(MimeUtility.encodeText(subject, "UTF-8", "B"));// 메일 제목
			message.setContent(content);// 메일 내용
	
			Transport.send(message);
		} catch(Exception e) {
			throw EXCEPTION;
		}
	}
	
	private static MimeMessage createMimeMessage(Session session) throws AddressException, MessagingException {
		MimeMessage message = new MimeMessage(session);
		message.setFrom(new InternetAddress(SENDER));// 송신자
		
		Address[] addresses = new Address[] {new InternetAddress(RECEIVER)};// 수신자 주소 변환
		message.addRecipients(Message.RecipientType.TO, addresses);// 수신자
		message.addRecipients(Message.RecipientType.CC, addresses);// 참조 수신자
		message.addRecipients(Message.RecipientType.BCC, addresses);// 숨은 참조 수신자
		
		return message;
	}
	
	
	private static class DefaultProperties {
		private static Properties instance;
		
		private DefaultProperties() {}
		
		private static Properties newInstance() {
			Properties props = new Properties();
			props.setProperty("mail.transport.protocol", "smtp");
			props.setProperty("mail.host", "smtp.gmail.com");
			props.put("mail.smtp.auth", "true");
			props.put("mail.smtp.port", "465");
			props.put("mail.smtp.socketFactory.port", "465");
			props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
			props.put("mail.smtp.socketFactory.fallback", "false");
			props.put("mail.smtp.starttls.enable", "true");
			props.setProperty("mail.smtp.quitwait", "false");
			return props;
		}
		
		public static Properties getInstance() {
			if(instance == null) {
				instance = newInstance();
			}
			return instance;
		}
	}

	private static class DefaultAuthenticator extends Authenticator {
		private static DefaultAuthenticator instance;
		
		private PasswordAuthentication authenticator;
		
		private DefaultAuthenticator() {}
		
		@Override
		protected PasswordAuthentication getPasswordAuthentication() {
			if(authenticator == null) {
				authenticator = new PasswordAuthentication(SENDER, "PW");// Sender 계정 id / pw
			}
			return authenticator;
		}
		
		public static DefaultAuthenticator getInstance() {
			if(instance == null) {
				instance = new DefaultAuthenticator();
			}
			return instance;
		}
	}
}
