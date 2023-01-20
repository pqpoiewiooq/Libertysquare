package me.blockhead.common.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;

import javax.servlet.ServletContext;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ImageUtil {
	public File find(String path) {
		File file = new File(path);
		return file.exists() ? file : null;
	}

	public File randomSelect(String dirName) {
		File dir = new File(dirName);
		File[] files = dir.listFiles();
		int index = (int) (Math.random() * files.length - 1);
		return files[index];
	}

	public synchronized String randomCopy(String selectDir, String copyDir) {
		String path = null;
		try {
			File origin = randomSelect(selectDir);
			File copy = null;
			do {
				path = copyDir + createFileName() + extractExtension(origin.getName());
				copy = new File(path);
			} while (copy.exists());

			copy(origin, copy);
		} catch (Exception e) {
			path = null;
		}

		return path;
	}

	/**
	 * 새로운 이름으로 파일 이동
	 * <blockquote><pre>
	 * 	Example:
	 * 		File file = new File("C://example.txt");
	 * 		String newFileName = move(file, "D://");
	 * 		
	 * 		newFileName equals "D://{@link #createFileName()}.txt"
	 * </pre></blockquote>
	 * 
	 */
	public synchronized String move(File file, String moveDir) {
		File copy = createNewFile(moveDir, extractExtension(file.getName()));

		copy(file, copy);
		file.delete();

		return moveDir + copy.getName();
	}

	public final void copy(File origin, File copy) {
		try {
			copy.createNewFile();
	
			FileInputStream fis = new FileInputStream(origin);
			FileOutputStream fos = new FileOutputStream(copy);
	
			int buffer = 0;
			while ((buffer = fis.read()) != -1) {
				fos.write(buffer);
			}
	
			fis.close();
			fos.close();
		} catch(FileNotFoundException e) {
			throw new RuntimeException("파일을 찾지 못하였습니다 : " + e.getMessage());
		} catch(IOException e) {
			throw new RuntimeException("IOException : " + e.getMessage());
		}
	}

	/**
	 * 확장자 추출
	 * 
	 * Exmaple: "fname.extension" => ".extension";
	 */
	public final String extractExtension(String fname) {
		if (fname == null)
			return "";
		int point = fname.lastIndexOf(".");
		return (point == -1 ? "" : fname.substring(point));
	}

	/**
	 * 확장자명 추출
	 * 
	 * Exmaple: "fname.extension" => "extension";
	 */
	public final String extractExtensionName(String fname) {
		if (fname == null)
			return "";
		int point = fname.lastIndexOf(".");
		return (point == -1 ? "" : fname.substring(point + 1));
	}

	public String createFileName() {
		return UUID.randomUUID().toString();
	}
	
	public String createFileName(String originFileName) {
		return UUID.randomUUID().toString() + extractExtension(originFileName);
	}

	/**
	 * Exmaple: createNewFile('C://', '.txt') => C://{@link #createFileName()}.txt
	 * 
	 * @param root 생성될 파일의 dir root
	 * @param extension 생성될 파일의 확장자
	 */
	public File createNewFile(String root, String extension) {
		File file = null;
		do {
			file = new File(root + createFileName() + extension);
		} while (file.exists());
		return file;
	}
	
	public boolean delete(File file) {
		if(file == null || !file.exists()) {
			// Log.e('파일을 찾지 못함');
			return false;
		} else {
			return file.delete();
		}
	}
	
	public void deleteAll(String[] pathArray) throws IOException {
		for (String path : pathArray) {
			File file = find(path);
			delete(file);
		}
	}
	
	
	
	
	
	
	
	private final ServletContext context;
	
	public static final int MAX_SIZE = 1024 * 1024 * 4; // 4MB
	
	private static final String WEB_URI = "https://localhost/";
	
	private static final String ROOT = "/img/";//테스트 환경입니다. 추후 제일 앞 / 은 제거
	
	public static final String TEMP_ROOT = "temp/";
	
	public static final String HOST_ROOT = "host/";
	public static final String HOST_BASE_COVER_DIR_NAME = "cover";
	public static final String HOST_BASE_PROFILE_DIR_NAME = "profile";
	
	public static final String USER_ROOT = "user/";
	public static final int USER_PROFILE_SIZE = 150;
	private static final String USER_DEFAULT_PROFILE = "default.png";
	
	public static final String EVENT_ROOT = "event/";
	public static final int EVENT_COVER_WIDTH = 675;
	public static final int EVENT_COVER_HEIGHT = 380;
	public static final int EVENT_CONTENT_SIZE = 700;
	
	private static final String REAL_PATH_ROOT = "webapps/";
	
	public String getRealPath(String path) {
		path = path.replaceAll("\\\\", "/")
			.replaceAll("^(?:\\.{2}/)+", "")
			.replaceAll(WEB_URI, "");
		String abp = context.getRealPath("");
		int index = abp.lastIndexOf(REAL_PATH_ROOT);
		return abp.substring(0, index + REAL_PATH_ROOT.length()) + ROOT + path;
	}
	
	public String getWebPath(String path) {
		String abp = context.getRealPath("");
		int index = abp.lastIndexOf(REAL_PATH_ROOT);
		return WEB_URI + path.replace(abp.substring(0, index + REAL_PATH_ROOT.length()) + ROOT, "");
	}
	
	
	
	public String create(MultipartFile multipartFile) throws IOException {
		if(multipartFile.isEmpty()) return null;

		String newFileName = createFileName(multipartFile.getOriginalFilename());
		File file = new File(getRealPath(TEMP_ROOT) + newFileName);
		file.mkdirs();
		
		multipartFile.transferTo(file);
		
		return TEMP_ROOT + newFileName;
	}
	
	
	public String getDefaultUserProfile() {
		return getRealPath(USER_ROOT + USER_DEFAULT_PROFILE);
	}
}
