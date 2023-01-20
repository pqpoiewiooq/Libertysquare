package net;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.UUID;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;

import exception.MyServletException;
import servlet.common.ServletStatus;

public class ImageTransfer {
	private static ImageTransfer instance = null;
	private static final String IP = "ls2020.cafe24.com";
	private static final int PORT = 21;// Commons-net은 SFTP(3822) 미지원
	private static final String ID = "ls2020";
	private static final String PW = "LibertySqaure1!";
	
	private static final int SO_TIMEOUT = 60 * 5;// 5분
	private static final long KEEP_ALIVE_TIMEOUT = SO_TIMEOUT - 60;// 4분

	private ImageTransfer() {}

	public synchronized static ImageTransfer getInstance() {
		if (instance == null) {
			instance = new ImageTransfer();
			instance.connect(IP, PORT, ID, PW);
		}

		return instance;
	}

	private FTPClient ftpClient;

	private void connect(String ip, int port, String id, String pw) {
		synchronized (this) {
			try {
				if(ftpClient != null) {
					try {
						ftpClient.abort();
					} catch(Exception e) {}
					ftpClient.disconnect();
				}
				
				ftpClient = new FTPClient();
				ftpClient.connect(ip, port);
				ftpClient.setControlEncoding("UTF-8");
	
				if (!FTPReply.isPositiveCompletion(ftpClient.getReplyCode())) {
					ftpClient.disconnect();
					throw new MyServletException("Image Server Connection Failed");
				}
	
				if (!ftpClient.login(id, pw)) {
					ftpClient.logout();
					ftpClient.disconnect();
					throw new Exception("Image Server Login Failed");
				}
	
				ftpClient.setSoTimeout(SO_TIMEOUT);
				ftpClient.setKeepAlive(true);
				ftpClient.setControlKeepAliveTimeout(KEEP_ALIVE_TIMEOUT);
				
				ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
				ftpClient.enterLocalPassiveMode();
			} catch (Exception e) {
				if (e instanceof MyServletException) {
					throw (MyServletException) e;
				} else if (e.getMessage().indexOf("refused") != -1) {
					throw new MyServletException("Image Server Refueed");
				}
				throw new MyServletException(e.getMessage());
			}
		}
	}

//	public boolean move(String dir) {
//		synchronized (this) {
//			try {
//				return ftpClient.changeWorkingDirectory(dir);
//			} catch (IOException e) {
//				throw new MyServletException("changeWorkingDirectory() failed");
//			}
//		}
//	}
	
	private void _store(String saveFilePath, File file) {
		try {
			if (!ftpClient.storeFile(saveFilePath, new FileInputStream(file))) {
				throw new MyServletException("Image Upload Failed");
			}
		} catch(FileNotFoundException e) {
			throw new MyServletException(ServletStatus.NOT_FOUND, file.getName());
		} catch(IOException e) {
			if (e.getMessage().indexOf("not open") != -1) {
				throw new MyServletException("Image Server Not Connected");
			}
			throw new MyServletException(e.getMessage());
		} catch(Exception e) {
			throw new MyServletException("store() failed : " + e.getMessage());
		}
	}
	
	private static final int RETRY_COUNT = 2;
	public void store(String saveFilePath, File file) {
		synchronized (this) {
			int retry = 0;
			while(true) {
				try {
					_store(saveFilePath, file);
					break;
				} catch(Exception e) {
					e.printStackTrace();
					if(retry++ < RETRY_COUNT) {
						connect(IP, PORT, ID, PW);
						continue;
					}
					
					throw e;
				}
			}
		}
	}
	
	public String storeNewName(String dir, File file) {
		synchronized (this) {
			String newName = createFileName() + extractExtension(file.getName());
			store(dir + newName, file);
			return dir + newName;
		}
	}
	
	public void delete(String fileName) {
		synchronized (this) {
			try {
				if (!ftpClient.deleteFile(fileName)) {
					throw new MyServletException("Image Delete Failed");
				}
			} catch (Exception e) {
				if (e.getMessage().indexOf("not open") != -1) {
					throw new MyServletException("Image Server Not Connected");
				}
				throw new MyServletException("delete() failed");
			}
		}
	}
	
	
	
	private static final String extractExtension(String fname) {
		if(fname == null) return "";
		int point = fname.lastIndexOf(".");
		return (point == -1 ? "" : fname.substring(point));
	}
	
	private static String createFileName() {
		return UUID.randomUUID().toString();
	}
}
