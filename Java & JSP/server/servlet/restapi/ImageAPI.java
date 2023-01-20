package servlet.restapi;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.FileRenamePolicy;

import exception.MyServletException;
import net.ImageTransfer;
import servlet.common.MyHttpServlet;
import util.JsonUtil;

public class ImageAPI extends MyHttpServlet {
	public static final int MAX_SIZE = 1024 * 1024 * 10; // 10MB
	public static final float DEFAULT_QUALITY = 0.3f;
	
	public static final String WEB_URI = "https://ls2020.cafe24.com/";
	
	private static final String ROOT = "img/";
	
	public static final String SERVER_PATH = "https://img.libertysquare.co.kr/";
	public static final String TEMP_DIR = "temp/";
	
	public static final String HOST_ROOT = "host/";
	public static final int HOST_PROFILE_WIDTH = 170;
	public static final int HOST_PROFILE_HEIGHT = 170;
	public static final int HOST_COVER_WIDTH = 1400;
	public static final int HOST_COVER_HEIGHT = 320;
	public static final int HOST_INTRO_SIZE = 700;
	
	public static final String USER_ROOT = "user/";
	public static final int USER_PROFILE_SIZE = 150;
	private static final String USER_DEFAULT_PROFILE = "default.png";
	
	public static final String EVENT_ROOT = "event/";
	public static final int EVENT_COVER_WIDTH = 675;
	public static final int EVENT_COVER_HEIGHT = 380;
	public static final int EVENT_CONTENT_SIZE = 700;
	
	public static final String SUPPORT_ROOT = "support/";
	public static final int SUPPORT_COVER_WIDTH = 675;
	public static final int SUPPORT_COVER_HEIGHT = 380;
	public static final int SUPPORT_CONTENT_SIZE = 700;
	
	public static final String POST_ROOT = "post/";
	
	private static final long serialVersionUID = -9077907577194446983L;
	
	@Override
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		PrintWriter out = response.getWriter();
		
		String[] pathArray = request.getParameterValues("src");
		for(String path : pathArray) {
			if(!isTemp(path)) {
				out.print(path + " : Passed<br/>");
				continue;
			}
			File file = getImage(request, path);
			if(file.exists()) {
				if(file.delete()) out.print(path + " : Deleted<br/>");
				else out.print(path + " : Access Denied<br/>");
			}else {
				out.print(path + " : Not Found<br/>");
			}
		}
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		MultipartRequest mr = createMultipartRequest(request);
		
		Enumeration<?> fileNames = mr.getFileNames();
		List<String> uploadedFileNames = new ArrayList<>();
		while(fileNames.hasMoreElements()) {
			String item = (String) fileNames.nextElement();
			String savedName = mr.getFilesystemName(item);
			uploadedFileNames.add(SERVER_PATH + TEMP_DIR + savedName);
		}
		
		response.getWriter().print(uploadedFileNames.size() == 1 ? uploadedFileNames.get(0) : JsonUtil.toJson(uploadedFileNames));
	}
	
	public static MultipartRequest createMultipartRequest(HttpServletRequest request) throws IOException {
		String path = getRealPath(request, TEMP_DIR);
		return new MultipartRequest(request, path, MAX_SIZE, "UTF-8", new RenamePolicy());
	}
	
	
	
	
	public static boolean isTemp(String path) {
		return path.startsWith(SERVER_PATH + TEMP_DIR);
	}
	
	public static File getImage(HttpServletRequest request, String path) {
		File file = new File(getRealPath(request, path));
		return file.exists() ? file : null;
	}
	
	public static File randomSelect(String dirName) {
		File dir = new File(dirName);
		File[] files = dir.listFiles();
		int index = (int) (Math.random() * files.length - 1);
		return files[index];
	}
	
	private static final String REAL_PATH_ROOT = "webapps/";
	
	private static String getAbsolutePath(HttpServletRequest request) {
		String abp = request.getServletContext().getRealPath("");
		int index = abp.lastIndexOf(REAL_PATH_ROOT);
		return abp.substring(0, index + REAL_PATH_ROOT.length()) + ROOT;
	}
	
	// protected로 바꿀것
	public static String getRealPath(HttpServletRequest request, String path) {
		path = path.replaceAll("\\\\", "/");
		path = path.replaceAll("^(?:\\.{2}/)+", "");
		path = path.replaceAll(WEB_URI, "");
		path = path.replaceAll(SERVER_PATH, "");
		return getAbsolutePath(request) + path;
	}
	
	public static String getWebPath(HttpServletRequest request, String path) {
		return WEB_URI + path.replace(getAbsolutePath(request), "");
	}
	
	public static String getHostCover() {
		return WEB_URI + HOST_ROOT + "default_cover.jpg";
	}
	
	public static String getHostProfile() {
		return WEB_URI + HOST_ROOT + "default_profile.png";
	}
	
	public static String getUserProfile() {
		return WEB_URI + USER_ROOT + USER_DEFAULT_PROFILE;
	}
	
	public static final String upload(HttpServletRequest request, String dir, String tempPath) {
		String realPath = ImageAPI.getRealPath(request, tempPath);
		File file = new File(realPath);
		return upload(request, dir, file);
	}
	
	public static final String upload(HttpServletRequest request, String dir, File file) {
		if(file == null || !file.exists()) throw new MyServletException("Image Not Found: " + file.getName());
		
		ImageTransfer transfer = ImageTransfer.getInstance();
		String newName = transfer.storeNewName(dir, file);
		file.delete();// 업로드 후 삭제
		return getWebPath(request, newName);
	}
	
	public static final String uploadWith(HttpServletRequest request, String dir, String originText, List<String> tempImageList) {
		if(originText == null || tempImageList == null) return originText;
		
		for(String path : tempImageList) {
			String newPath = upload(request, dir, path);
			originText = originText.replace(path, newPath);
		}
		
		return originText;
	}
	
	/*
	public static final String compress(File file, String saveDir, Float quality, Integer resizeWidth, Integer resizeHeight) throws IOException {
		if (!file.exists()) throw new FileNotFoundException();
		
		String extension = extractExtensionName(file.getName());
		Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName(extension);
		if (!writers.hasNext()) throw new IllegalStateException("No writers found");
		ImageWriter writer = (ImageWriter) writers.next();
		
		BufferedImage image = ImageIO.read(file);
		int width = image.getWidth();
		int height = image.getHeight();
		// Resizing
		if (resizeWidth == null) {
			if(resizeHeight == null) {
				resizeWidth = width;
				resizeHeight = height;
			} else {
				resizeWidth = (resizeHeight * width) / height;
			}
		} else if (resizeHeight == null) {
			resizeHeight = (resizeWidth * height) / width;
		}
		if (resizeWidth == 0 || resizeHeight == 0) throw new IllegalStateException("size = " + resizeWidth + "x" + resizeHeight);
		if (width != resizeWidth || height != resizeHeight) {
			BufferedImage resizedImage = new BufferedImage(resizeWidth, resizeHeight, image.getType());
			Graphics2D graphics2d = resizedImage.createGraphics();
			graphics2d.drawImage(image, 0, 0, resizeWidth, resizeHeight, null);
			graphics2d.dispose();
			
			image = resizedImage;
		}
		
		// Write - compressed
		String compressedFilePath = saveDir + createFileName() + "." + extension;
		File output = new File(compressedFilePath);
		FileOutputStream fos = new FileOutputStream(output);
	    ImageOutputStream ios = ImageIO.createImageOutputStream(fos);
	    writer.setOutput(ios);

	    ImageWriteParam param = writer.getDefaultWriteParam();
	    try {
	    	param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
	    	param.setCompressionQuality(quality == null ? DEFAULT_QUALITY : quality);
	    } catch(UnsupportedOperationException uoe) {
	    	// png : Compression not supported
	    }
	    
	    writer.write(null, new IIOImage(image, null, null), param);
	    fos.close();
	    ios.close();
	    writer.dispose();
	    
	    return compressedFilePath;
	}
	*/
	
	
	public static class RenamePolicy implements FileRenamePolicy {
	    
	    @Override
	    public File rename(File f) {
	    	String fn = f.getName();
	    	int fd = fn.lastIndexOf(".");
	    	String fe = (fd == -1 ? "" : fn.substring(fd));
	    	f = new File(f.getParent(), createFileName() + fe);
	    	
			return f;
	    }
	}
	
	public static final String extractExtension(String fname) {
		if(fname == null) return "";
		int point = fname.lastIndexOf(".");
		return (point == -1 ? "" : fname.substring(point));
	}
	
	public static final String extractExtensionName(String fname) {
		if(fname == null) return "";
		int point = fname.lastIndexOf(".");
		return (point == -1 ? "" : fname.substring(point + 1));
	}
	
	protected static String createFileName() {
		return UUID.randomUUID().toString();
	}
	
	protected static File createNewFile(String root, String extension) {
		File file = null;
		do {
			file = new File(root + createFileName() + extension);
		} while(file.exists());
		return file;
	}
}