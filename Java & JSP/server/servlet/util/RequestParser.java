package servlet.util;

import java.awt.Color;
import java.security.PrivateKey;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Function;
import java.util.function.IntFunction;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import exception.MyServletException;
import servlet.common.ServletStatus;
import servlet.restapi.ImageAPI;
import util.CryptoHelper;
import util.HtmlTagUtil;

public class RequestParser {
	protected static final boolean defaultNullable = false;
	
	public static String get(HttpServletRequest request, String param) throws MyServletException {
		return get(request, param, null, defaultNullable);
	}
	
	public static String get(HttpServletRequest request, String param, Integer lengthLimit) throws MyServletException {
		return get(request, param, lengthLimit, defaultNullable);
	}
	
	public static String get(HttpServletRequest request, String param, boolean nullable) throws MyServletException {
		return get(request, param, null, nullable);
	}
	
	public static String get(HttpServletRequest request, String param, Integer lengthLimit, boolean nullable) throws MyServletException {
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
	
	
	
	public static String getMatches(HttpServletRequest request, String param, String regex) throws MyServletException {
		return getMatches(request, param, regex, defaultNullable);
	}
	
	public static String getMatches(HttpServletRequest request, String param, String regex, boolean nullable) throws MyServletException {
		String value = get(request, param, defaultNullable);
		
		if(value == null) {
			if(!nullable) throw new MyServletException(ServletStatus.NOT_FOUND_PARAMETER, param);
			return null;
		}
		
		if(!Pattern.matches(regex, value)) {
			throw new MyServletException(ServletStatus.INVALID_PARAMETER, param);
		}
		
		return value;
	}
	
	
	
	public static String getRSA(HttpServletRequest request, String param) throws MyServletException {
		String encrypted = get(request, param, false);
		
		HttpSession session = request.getSession(false);
		if(session == null) throw new MyServletException(ServletStatus.UNAUTHORIZED);
		
		PrivateKey privateKey = (PrivateKey) session.getAttribute(CryptoHelper.PRIVATE_KEY);
		if(privateKey == null) throw new MyServletException(ServletStatus.NOT_ACCEPTABLE);
		//session.removeAttribute(CryptoHelper.PRIVATE_KEY);
		
		String decrypt = CryptoHelper.decryptRSA(encrypted, privateKey);
		if(decrypt == null) throw new MyServletException(ServletStatus.CRYPTO_ERROR, "1");
		
		return decrypt;
	}
	
	public static byte[] getCryptoParameter(HttpServletRequest request, String param, String salt) throws MyServletException {
		String plain = getRSA(request, param);
		byte[] sha512 = CryptoHelper.encryptSHA512(plain, salt);
		if(sha512 == null) throw new MyServletException(ServletStatus.CRYPTO_ERROR, "2");
		
		return sha512;
	}
	
	
	
	public static String getHexColor(HttpServletRequest request, String param) throws MyServletException {
		return getHexColor(request, param, defaultNullable);
	}
	
	public static String getHexColor(HttpServletRequest request, String param, boolean nullable) throws MyServletException {
		String color = get(request, param, defaultNullable);
		if(nullable && color == null) return null;
		try {
			Color.decode("#" + color);
		} catch (NumberFormatException e) {
			throw new MyServletException(ServletStatus.INVALID_PARAMETER, param);
		}
		return color;
	}
	
	
	
	public static int getInt(HttpServletRequest request, String param) throws MyServletException {
		return getInt(request, param, null);
	}
	
	public static int getInt(HttpServletRequest request, String param, Integer max) throws MyServletException {
		return getInt(request, param, max, false);
	}
	
	public static int getInt(HttpServletRequest request, String param, Integer max, boolean nullable) throws MyServletException {
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
	
	
	public static long getLong(HttpServletRequest request, String param) throws MyServletException {
		return getLong(request, param, null);
	}
	
	public static long getLong(HttpServletRequest request, String param, Long max) throws MyServletException {
		return getLong(request, param, max, false);
	}
	
	public static long getLong(HttpServletRequest request, String param, Long max, boolean nullable) throws MyServletException {
		String value = get(request, param, null, nullable);
		if(nullable && value == null) return 0;
		try {
			long longValue = Long.parseLong(value);
			if(max != null && longValue > max) throw new MyServletException(ServletStatus.INVALID_PARAMETER, param);
			return longValue;
		} catch(NumberFormatException npe) {
			throw new MyServletException(ServletStatus.INVALID_PARAMETER, param);
		}
	}
	
	
	
	
	public static Boolean getBoolean(HttpServletRequest request, String param) throws MyServletException {
		return getBoolean(request, param, defaultNullable);
	}
	
	/**
	 * @param nullable <br>
	 * NULL : false<br>
	 * FALSE : {@link MyServletException}<br>
	 * TRUE : NULL
	 */
	public static Boolean getBoolean(HttpServletRequest request, String param, Boolean nullable) throws MyServletException {
		String value = request.getParameter(param);
		if(value == null) {
			if(nullable == null) return false;
			else if(!nullable) throw new MyServletException(ServletStatus.NOT_FOUND_PARAMETER, param);
			return null;
		}
		
		return Boolean.valueOf(value);
	}
	
	
	
	
	public static <A> A getTo(HttpServletRequest request, String param, Function<? super String, ? extends A> mapper) throws MyServletException {
		return getTo(request, param, mapper, defaultNullable);
	}
	
	public static <A> A getTo(HttpServletRequest request, String param, Function<? super String, ? extends A> mapper, boolean nullable) throws MyServletException {
		String value = get(request, param, defaultNullable);
		
		if(value == null) {
			if(!nullable) throw new MyServletException(ServletStatus.NOT_FOUND_PARAMETER, param);
			return null;
		}
		
		A a = null;
		try {
			a = mapper.apply(value);
		} catch(IllegalArgumentException e) {
			throw new MyServletException(ServletStatus.INVALID_PARAMETER, param);
		}
		
		return a;
	}
	
	
	
	
	public static String[] getValues(HttpServletRequest request, String param) throws MyServletException {
		return getValues(request, param, null, defaultNullable);
	} 
	
	public static String[] getValues(HttpServletRequest request, String param, boolean nullable) throws MyServletException {
		return getValues(request, param, null, nullable);
	}
	
	public static String[] getValues(HttpServletRequest request, String param, Integer paramLimit, boolean nullable) throws MyServletException {
		String[] values = request.getParameterValues(param);
		if(values == null) {
			if(!nullable) throw new MyServletException(ServletStatus.NOT_FOUND_PARAMETER, param);
			return null;
		}
		
		if(paramLimit != null) {
			int length = values.length;
			if(paramLimit > 0 && length > paramLimit) throw new MyServletException(ServletStatus.INVALID_PARAMETER, param + " too many : " + length + " > " + paramLimit);
		}
		
		return values;
	}
	
	
	
	
	public static <A> A[] getArray(HttpServletRequest request, String param, Function<? super String, ? extends A> mapper, IntFunction<A[]> generator) throws MyServletException {
		return getArray(request, param, mapper, generator, null, defaultNullable);
	}
	
	public static <A> A[] getArray(HttpServletRequest request, String param, Function<? super String, ? extends A> mapper, IntFunction<A[]> generator, boolean nullable) throws MyServletException {
		return getArray(request, param, mapper, generator, null, defaultNullable);
	}
	
	public static <A> A[] getArray(HttpServletRequest request, String param, Function<? super String, ? extends A> mapper, IntFunction<A[]> generator, Integer paramLimit) throws MyServletException {
		return getArray(request, param, mapper, generator, paramLimit, defaultNullable);
	}
	
	public static <A> A[] getArray(HttpServletRequest request, String param, Function<? super String, ? extends A> mapper, IntFunction<A[]> generator, Integer paramLimit, boolean nullable) throws MyServletException {
		String[] values = getValues(request, param, paramLimit, nullable);
		
		if(values == null) {
			if(!nullable) throw new MyServletException(ServletStatus.NOT_FOUND_PARAMETER, param);
			return null;
		}
		
		if(paramLimit != null) {
			int length = values.length;
			if(paramLimit > 0 && length > paramLimit) throw new MyServletException(ServletStatus.INVALID_PARAMETER, param + " too many : " + length + " > " + paramLimit);
		}
		
		A[] array = null;
		try {
			array = Arrays.stream(values).map(mapper).toArray(generator);
		} catch(IllegalArgumentException e) {
			throw new MyServletException(ServletStatus.INVALID_PARAMETER, e.getMessage());
		}
		
		for(int i = 0; i < array.length; i++) {
			if(array[i] == null) throw new MyServletException(ServletStatus.INVALID_PARAMETER, param + "=" + array[i]);
		}
		return array;
	}
	
	public static boolean has(HttpServletRequest request, String param) {
		String value = request.getParameter(param);
		return !(value == null);
	}
	
	public static String getHTML(HttpServletRequest request, String param) throws MyServletException {
		return getHTML(request, param, null);
	}
	
	public static String getHTML(HttpServletRequest request, String param, Integer lengthLimit) throws MyServletException {
		String html = get(request, param, lengthLimit);
		return HtmlTagUtil.clean(html);
	}
	
	public List<String> getImageList(HttpServletRequest request, String param) throws MyServletException {
		return getImageList(request, param, true);
	}
	
	public List<String> getImageList(HttpServletRequest request, String param, Boolean nullable) throws MyServletException {
		List<String> list = new ArrayList<>();
		
		String[] contentImages = getValues(request, param, nullable);
		if(contentImages != null) {
			for(int i = 0; i < contentImages.length; i++) {
				if(!ImageAPI.isTemp(contentImages[i])) throw new MyServletException(ServletStatus.INVALID_PARAMETER, param + "=" + contentImages[i]);
				list.add(contentImages[i]);
			}
		}
		
		return list;
	}
}
