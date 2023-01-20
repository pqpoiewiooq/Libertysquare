package net;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import account.User;

@SuppressWarnings("rawtypes")
public class NiceHelper {
	private static final String sSiteCode = "BV054";
	private static final String sSitePassword = "0F7x0T6jOroK";

	private static final String CUSTOMIZE_WEB = "";
	private static final String CUSTOMIZE_MOBILE = "Mobile";

	private static final String REQ_SEQ = "REQ_SEQ";
	
	public static final String ATTR_DATA = "checkplus-data";

	/**
	 * 요청 URL + param(uri)
	 */
	public static final NiceData createRequestData(HttpServletRequest request, String successUri, String errorUri) {
		NiceID.Check.CPClient niceCheck = new NiceID.Check.CPClient();

		String sRequestNumber = niceCheck.getRequestNO(sSiteCode);
		request.getSession().setAttribute(REQ_SEQ, sRequestNumber);

		String sAuthType = "M"; // 없으면 기본 선택화면, M(휴대폰), X(인증서공통), U(공동인증서), F(금융인증서), S(PASS인증서), C(신용카드)
		String customize = getCustomize(request); // 없으면 기본 웹페이지 / Mobile : 모바일페이지

		String origin = "https://" + request.getServerName();
		String sReturnUrl = origin + successUri; // 성공시 이동될 URL
		String sErrorUrl = origin + errorUri; // 실패시 이동될 URL

		// 입력될 plain 데이타를 만든다.
		String sPlainData = "7:REQ_SEQ" + sRequestNumber.getBytes().length + ":" + sRequestNumber +
							"8:SITECODE" + sSiteCode.getBytes().length + ":" + sSiteCode +
							"9:AUTH_TYPE" + sAuthType.getBytes().length + ":" + sAuthType +
							"7:RTN_URL" + sReturnUrl.getBytes().length + ":" + sReturnUrl +
							"7:ERR_URL" + sErrorUrl.getBytes().length + ":" + sErrorUrl +
							"9:CUSTOMIZE" + customize.getBytes().length + ":" + customize;

		NiceData data = new NiceData();

		int iReturn = niceCheck.fnEncode(sSiteCode, sSitePassword, sPlainData);
		switch (iReturn) {
		case 0:
			data.encData = niceCheck.getCipherData();
			break;
		case -1:
			data.msg = "암호화 시스템 에러입니다.";
			break;
		case -2:
			data.msg = "암호화 처리오류입니다.";
			break;
		case -3:
			data.msg = "암호화 데이터 오류입니다.";
			break;
		case -9:
			data.msg = "입력 데이터 오류입니다.";
			break;
		default:
			data.msg = "알수 없는 에러 입니다. errorCode : " + iReturn;
		}

		return data;
	}

	public static final NiceData getResultData(HttpServletRequest request) {
		NiceID.Check.CPClient niceCheck = new NiceID.Check.CPClient();

		String sEncodeData = requestReplace(request.getParameter("EncodeData"), "encodeData");

		int iReturn = niceCheck.fnDecode(sSiteCode, sSitePassword, sEncodeData);

		NiceData data = new NiceData();
		if (iReturn == 0) {
			String sPlainData = niceCheck.getPlainData();
			// sCipherTime = niceCheck.getCipherDateTime(); // 복호화한 시간

			// 데이타를 추출합니다.\
			HashMap mapresult = niceCheck.fnParse(sPlainData);

			String sRequestNumber = (String) mapresult.get("REQ_SEQ");// 요청 번호

			HttpSession session = request.getSession();
			String session_sRequestNumber = (String) session.getAttribute(REQ_SEQ);
			if (sRequestNumber.equals(session_sRequestNumber)) {
				try {
					data.userData = parseUser(mapresult);
				} catch(Exception e) {
					data.msg = "정보를 가져오는데 실패하였습니다. err : " + e.getMessage();
				}
			} else {
				data.msg = "세션값 불일치 오류입니다.";
			}
		} else if (iReturn == -1) {
			data.msg = "복호화 시스템 오류입니다.";
		} else if (iReturn == -4) {
			data.msg = "복호화 처리 오류입니다.";
		} else if (iReturn == -5) {
			data.msg = "복호화 해쉬 오류입니다.";
		} else if (iReturn == -6) {
			data.msg = "복호화 데이터 오류입니다.";
		} else if (iReturn == -9) {
			data.msg = "입력 데이터 오류입니다.";
		} else if (iReturn == -12) {
			data.msg = "사이트 패스워드 오류입니다.";
		} else {
			data.msg = "알수 없는 에러 입니다. errorCode : " + iReturn;
		}

		return data;
	}

	public static final NiceData getFailData(HttpServletRequest request) {
		NiceID.Check.CPClient niceCheck = new NiceID.Check.CPClient();

		String sEncodeData = requestReplace(request.getParameter("EncodeData"), "encodeData");

		int iReturn = niceCheck.fnDecode(sSiteCode, sSitePassword, sEncodeData);

		NiceData data = new NiceData();
		if (iReturn == 0) {
			String sPlainData = niceCheck.getPlainData();
			// String sCipherTime = niceCheck.getCipherDateTime();

			// 데이타를 추출합니다.
			HashMap mapresult = niceCheck.fnParse(sPlainData);

			// String sRequestNumber = (String) mapresult.get("REQ_SEQ");
			String sErrorCode = (String) mapresult.get("ERR_CODE");
			// String sAuthType = (String) mapresult.get("AUTH_TYPE");
			
			data.msg = "본인인증에 실패하였습니다. errorCode : " + sErrorCode;
		} else if (iReturn == -1) {
			data.msg = "복호화 시스템 에러입니다.";
		} else if (iReturn == -4) {
			data.msg = "복호화 처리오류입니다.";
		} else if (iReturn == -5) {
			data.msg = "복호화 해쉬 오류입니다.";
		} else if (iReturn == -6) {
			data.msg = "복호화 데이터 오류입니다.";
		} else if (iReturn == -9) {
			data.msg = "입력 데이터 오류입니다.";
		} else if (iReturn == -12) {
			data.msg = "사이트 패스워드 오류입니다.";
		} else {
			data.msg = "알수 없는 에러 입니다. iReturn : " + iReturn;
		}
		
		return data;
	}
	
	
	private static final User parseUser(HashMap mapresult) throws UnsupportedEncodingException {
		User user = new User();
		
		String sName = (String) mapresult.get("UTF8_NAME");// 50 Byte, URL 인코딩 돼있음
		sName = URLDecoder.decode(sName, "UTF-8");
		String sBirthDate = (String) mapresult.get("BIRTHDATE");// 생년월일(YYYYMMDD)
		int birth = Integer.parseInt(sBirthDate.substring(2));
		String sGender = (String) mapresult.get("GENDER");// 성별(0: 여성, 1: 남성)
		boolean male = Integer.parseInt(sGender) == 1;
		String sNationalInfo = (String) mapresult.get("NATIONALINFO");// 내/외국인정보(0: 내국인, 1: 외국인)
		User.National national = User.National.values()[Integer.parseInt(sNationalInfo)];
		String sDupInfo = (String) mapresult.get("DI");// 중복가입 확인값(DI_64 byte)
		String sMobileNo = (String) mapresult.get("MOBILE_NO");// 전화번호
		String sMobileCo = (String) mapresult.get("MOBILE_CO");// 통신사(3 byte)
		
		user.setName(sName);
		user.setNickname(sName.length() > 14 ? sName.substring(0, 14) : sName);
		user.setBirth(birth);
		user.setGender(User.parseGender(birth, male, national));
		user.setNational(national);
		user.setDI(sDupInfo);
		user.setID(sMobileNo);
		user.setMobileCorp(sMobileCo);
		
		return user;
	}

	private static final String requestReplace(String paramValue, String gubun) {
		String result = "";

		if (paramValue != null) {
			paramValue = paramValue.replaceAll("<", "&lt;").replaceAll(">", "&gt;");

			paramValue = paramValue.replaceAll("\\*", "");
			paramValue = paramValue.replaceAll("\\?", "");
			paramValue = paramValue.replaceAll("\\[", "");
			paramValue = paramValue.replaceAll("\\{", "");
			paramValue = paramValue.replaceAll("\\(", "");
			paramValue = paramValue.replaceAll("\\)", "");
			paramValue = paramValue.replaceAll("\\^", "");
			paramValue = paramValue.replaceAll("\\$", "");
			paramValue = paramValue.replaceAll("'", "");
			paramValue = paramValue.replaceAll("@", "");
			paramValue = paramValue.replaceAll("%", "");
			paramValue = paramValue.replaceAll(";", "");
			paramValue = paramValue.replaceAll(":", "");
			paramValue = paramValue.replaceAll("-", "");
			paramValue = paramValue.replaceAll("#", "");
			paramValue = paramValue.replaceAll("--", "");
			paramValue = paramValue.replaceAll("-", "");
			paramValue = paramValue.replaceAll(",", "");

			if (gubun != "encodeData") {
				paramValue = paramValue.replaceAll("\\+", "");
				paramValue = paramValue.replaceAll("/", "");
				paramValue = paramValue.replaceAll("=", "");
			}

			result = paramValue;

		}
		return result;
	}

	private static final String getCustomize(HttpServletRequest request) {
		String agent = request.getHeader("USER-AGENT");

		String[] mobileos = { "iPhone", "iPod", "Android", "BlackBerry", "Windows CE", "Nokia", "Webos", "Opera Mini", "SonyEricsson", "Opera Mobi", "IEMobile" };
		for (int i = 0, j = -1; i < mobileos.length; i++) {
			j = agent.indexOf(mobileos[i]);
			if (j > -1) {
				return CUSTOMIZE_MOBILE;
			}
		}
		return CUSTOMIZE_WEB;
	}
}
