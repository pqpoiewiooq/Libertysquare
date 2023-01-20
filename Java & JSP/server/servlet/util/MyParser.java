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

public class MyParser {
	protected HttpServletRequest request;
	private boolean nullable = false; 
	
	public MyParser(HttpServletRequest request) {
		this.request = request;
	}
	
	public MyParser(HttpServletRequest request, boolean nullable) {
		this.request = request;
		this.nullable = nullable;
	}
	
	public void setNullable(boolean nullable) { 
		this.nullable = nullable;
	}
	
	public String get(String param) throws MyServletException {
		return get(param, null, this.nullable);
	}
	
	public String get(String param, Integer lengthLimit) throws MyServletException {
		return get(param, lengthLimit, this.nullable);
	}
	
	public String get(String param, boolean nullable) throws MyServletException {
		return get(param, null, nullable);
	}
	
	public String get(String param, Integer lengthLimit, boolean nullable) throws MyServletException {
		String value = this.request.getParameter(param);
		if(value == null) {
			if(!nullable) throw new MyServletException(ServletStatus.NOT_FOUND_PARAMETER, param);
			return null;
		}
		if(lengthLimit != null) {
			int length = value.length();
			if(lengthLimit > 0 && length > lengthLimit) throw new MyServletException(ServletStatus.INVALID_PARAMETER, param + " too long : " + length + " > " + lengthLimit);
		}
		return value;
	}
	
	
	
	public String getMatches(String param, String regex) throws MyServletException {
		return getMatches(param, regex, this.nullable);
	}
	
	public String getMatches(String param, String regex, boolean nullable) throws MyServletException {
		String value = get(param, nullable);
		
		if(value == null) {
			if(!nullable) throw new MyServletException(ServletStatus.NOT_FOUND_PARAMETER, param);
			return null;
		}
		
		if(!Pattern.matches(regex, value)) {
			throw new MyServletException(ServletStatus.INVALID_PARAMETER, param);
		}
		
		return value;
	}
	
	
	public String getRSA(String param) throws MyServletException {
		String encrypted = get(param, false);
		
		HttpSession session = request.getSession(false);
		if(session == null) throw new MyServletException(ServletStatus.UNAUTHORIZED);
		
		PrivateKey privateKey = (PrivateKey) session.getAttribute(CryptoHelper.PRIVATE_KEY);
		if(privateKey == null) throw new MyServletException(ServletStatus.NOT_ACCEPTABLE);
		//session.removeAttribute(CryptoHelper.PRIVATE_KEY);
		
		String decrypt = CryptoHelper.decryptRSA(encrypted, privateKey);
		if(decrypt == null) throw new MyServletException(ServletStatus.CRYPTO_ERROR, "1");
		
		return decrypt;
	}
	
	public byte[] getCryptoParameter(String param, String salt) throws MyServletException {
		String plain = getRSA(param);
		byte[] sha512 = CryptoHelper.encryptSHA512(plain, salt);
		if(sha512 == null) throw new MyServletException(ServletStatus.CRYPTO_ERROR, "2");
		
		return sha512;
	}

	
	public List<String> getImageList(String param) throws MyServletException {
		return getImageList(param, this.nullable);
	}
	
	public List<String> getImageList(String param, Boolean nullable) throws MyServletException {
		List<String> list = new ArrayList<>();
		
		String[] contentImages = getValues(param, nullable);
		if(contentImages != null) {
			for(int i = 0; i < contentImages.length; i++) {
				if(!ImageAPI.isTemp(contentImages[i])) throw new MyServletException(ServletStatus.INVALID_PARAMETER, param + "=" + contentImages[i]);
				list.add(contentImages[i]);
			}
		}
		
		return list;
	}
	
	
	
	public String getHexColor(String param) throws MyServletException {
		return getHexColor(param, this.nullable);
	}
	
	public String getHexColor(String param, boolean nullable) throws MyServletException {
		String color = get(param, nullable);
		if(nullable && color == null) return null;
		try {
			Color.decode("#" + color);
		} catch (NumberFormatException e) {
			throw new MyServletException(ServletStatus.INVALID_PARAMETER, param);
		}
		return color;
	}
	
	
	
	public int getInt(String param) throws MyServletException {
		return getInt(param, null);
	}
	
	/**
	 * call {@link #getParameterInt(param, max, nullable)}<br>
	 * nullable default false
	 */
	public int getInt(String param, Integer max) throws MyServletException {
		return getInt(param, max, false);
	}
	
	/**
	 * nullable == true일 때, 값이 없을 경우 0 반환
	 */
	public int getInt(String param, Integer max, boolean nullable) throws MyServletException {
		String value = get(param, null, nullable);
		if(nullable && value == null) return 0;
		try {
			int intValue = Integer.parseInt(value);
			if(max != null && intValue > max) throw new MyServletException(ServletStatus.INVALID_PARAMETER, param);
			return intValue;
		} catch(NumberFormatException npe) {
			throw new MyServletException(ServletStatus.INVALID_PARAMETER, param);
		}
	}
	
	
	public long getLong(String param) throws MyServletException {
		return getLong(param, null);
	}
	
	public long getLong(String param, Long max) throws MyServletException {
		return getLong(param, max, false);
	}
	
	/**
	 * nullable == true일 때, 값이 없을 경우 0 반환
	 */
	public long getLong(String param, Long max, boolean nullable) throws MyServletException {
		String value = get(param, null, nullable);
		if(nullable && value == null) return 0;
		try {
			long longValue = Long.parseLong(value);
			if(max != null && longValue > max) throw new MyServletException(ServletStatus.INVALID_PARAMETER, param);
			return longValue;
		} catch(NumberFormatException npe) {
			throw new MyServletException(ServletStatus.INVALID_PARAMETER, param);
		}
	}
	
	
	
	
	public Boolean getBoolean(String param) throws MyServletException {
		return getBoolean(param, this.nullable);
	}
	
	public Boolean getBoolean(String param, Boolean nullable) throws MyServletException {
		String value = this.request.getParameter(param);
		if(value == null) {
			if(nullable == null) return false;
			else if(!nullable) throw new MyServletException(ServletStatus.NOT_FOUND_PARAMETER, param);
			return null;
		}
		
		return Boolean.valueOf(value);
	}
	
	
	
	
	public <A> A getTo(String param, Function<? super String, ? extends A> mapper) throws MyServletException {
		return getTo(param, mapper, this.nullable);
	}
	
	public <A> A getTo(String param, Function<? super String, ? extends A> mapper, boolean nullable) throws MyServletException {
		String value = get(param, nullable);
		
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
	
	
	
	
	public String[] getValues(String param) throws MyServletException {
		return getValues(param, null, this.nullable);
	} 
	
	public String[] getValues(String param, boolean nullable) throws MyServletException {
		return getValues(param, null, nullable);
	}
	
	public String[] getValues(String param, Integer paramLimit, boolean nullable) throws MyServletException {
		String[] values = this.request.getParameterValues(param);
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
	
	
	
	
	public <A> A[] getArray(String param, Function<? super String, ? extends A> mapper, IntFunction<A[]> generator) throws MyServletException {
		return getArray(param, mapper, generator, null, this.nullable);
	}
	
	public <A> A[] getArray(String param, Function<? super String, ? extends A> mapper, IntFunction<A[]> generator, boolean nullable) throws MyServletException {
		return getArray(param, mapper, generator, null, nullable);
	}
	
	public <A> A[] getArray(String param, Function<? super String, ? extends A> mapper, IntFunction<A[]> generator, Integer paramLimit) throws MyServletException {
		return getArray(param, mapper, generator, paramLimit, this.nullable);
	}
	
	public <A> A[] getArray(String param, Function<? super String, ? extends A> mapper, IntFunction<A[]> generator, Integer paramLimit, boolean nullable) throws MyServletException {
		String[] values = getValues(param, paramLimit, nullable);
		
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
	
	public boolean has(String param) {
		String value = this.request.getParameter(param);
		return !(value == null);
	}
	
	public String getHTML(String param) throws MyServletException {
		return getHTML(param, null);
	}
	
	public String getHTML(String param, Integer lengthLimit) throws MyServletException {
		String html = get(param, lengthLimit);
		return HtmlTagUtil.clean(html);
	}
}
