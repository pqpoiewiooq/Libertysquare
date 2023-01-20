package servlet.util;

import com.oreilly.servlet.MultipartRequest;

import exception.MyServletException;
import servlet.common.ServletStatus;

public class MultipartRequestParser extends RequestParser {
	public static String get(MultipartRequest request, String param) throws MyServletException {
		return get(request, param, null, defaultNullable);
	}
	
	public static String get(MultipartRequest request, String param, Integer lengthLimit) throws MyServletException {
		return get(request, param, lengthLimit, defaultNullable);
	}
	
	public static String get(MultipartRequest request, String param, boolean nullable) throws MyServletException {
		return get(request, param, null, nullable);
	}
	
	public static String get(MultipartRequest request, String param, Integer lengthLimit, boolean nullable) throws MyServletException {
		String value = request.getParameter(param);
		if(value == null || "".equals(value)) {
			if(!nullable) throw new MyServletException(ServletStatus.NOT_FOUND_PARAMETER, param);
			return null;
		}
		if(lengthLimit != null) {
			int length = value.length();
			if(lengthLimit > 0 && length > lengthLimit) throw new MyServletException(ServletStatus.INVALID_PARAMETER, param + " too long : " + length + " > " + lengthLimit);
		}
		return value;
	}
	
	
	public static int getInt(MultipartRequest request, String param) throws MyServletException {
		return getInt(request, param, null);
	}
	
	public static int getInt(MultipartRequest request, String param, Integer max) throws MyServletException {
		return getInt(request, param, max, false);
	}
	
	public static int getInt(MultipartRequest request, String param, Integer max, boolean nullable) throws MyServletException {
		String value = get(request, param, null, nullable);
		if(nullable && value == null) return 0;
		try {
			int intValue = Integer.parseInt(value);
			if(max != null && intValue > max) throw new MyServletException(ServletStatus.INVALID_PARAMETER, param);
			return intValue;
		} catch(NumberFormatException npe) {
			throw new MyServletException(ServletStatus.INVALID_PARAMETER, param);
		}
	}
}
