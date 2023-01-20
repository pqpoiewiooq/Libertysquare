package util;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.Date;

public class DateUtil {
	public static final String DEFAULT_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
	/*
	 * ./bin/setenv.sh에
	 * #!/bin/bash export
	 * CATALINA_OPTS="$CATALINA_OPTS -Dfile.encoding=UTF8 -Duser.timezone=GMT+9"
	 * 두 줄 추가하여 기본 시간을 한국 시간에 맞춰둠.
	 * 사유는 모르겠으나 TimeZone 설정시, 설정 전에 생성된 Session들은 전부 초기화되는듯해 보임.
	static {//초기화 블록
		Locale.setDefault(Locale.KOREAN);
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
	}
	*/
	
	private static final DateTimeFormatter defaultFormatter = DateTimeFormatter.ofPattern(DEFAULT_DATE_FORMAT);
//	private static final DateTimeFormatter defaultFormatter = new DateTimeFormatterBuilder()//DateTimeFormatter.ofPattern(DEFAULT_DATE_FORMAT)
//			.appendPattern(DEFAULT_DATE_FORMAT).parseLenient().appendFraction(ChronoField.NANO_OF_SECOND, 0, 9, true).toFormatter();
	/**
	 * lhs가 rhs보다 이후인지 확인. 똑같으면 true
	 */
	public static boolean isAfter(String lhs, String rhs) {
		try {
			LocalDateTime lhsDT = defaultFormatter.parse(lhs, LocalDateTime::from);
			LocalDateTime rhsDT = defaultFormatter.parse(rhs, LocalDateTime::from);
			return lhsDT.isEqual(rhsDT) || lhsDT.isAfter(rhsDT);
		} catch(Exception e) {
		}
		return false;
	}
	
	public static String defaultFormat(Date date) {
		try {
			return defaultFormatter.format(date.toInstant().atZone(ZoneId.systemDefault()));
		} catch(Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static boolean evaluateDate(String str) {
		try {
			defaultFormatter.parse(str);
			return true;
		} catch (Exception e) {
			return false;
		}
	}
	
	public static String defaultFormat(long time) {
		SimpleDateFormat format = new SimpleDateFormat(DEFAULT_DATE_FORMAT);
		try {
			return format.format(time);
		} catch(Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	private static final DateTimeFormatter s1 = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 (E) a KK:mm\n- ");
	private static final DateTimeFormatter s2 = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 (E)\na KK:mm - ");
	private static final DateTimeFormatter e1 = DateTimeFormatter.ofPattern("a KK:mm");
	private static final DateTimeFormatter e2 = DateTimeFormatter.ofPattern("dd일 (E) a KK:mm");
	private static final DateTimeFormatter e3 = DateTimeFormatter.ofPattern("MM월 dd일 (E) a KK:mm");
	private static final DateTimeFormatter e4 = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 (E) a KK:mm");
	public static String convert(String start, String end) {
		try {
			LocalDateTime startDate = defaultFormatter.parse(start, LocalDateTime::from);
			LocalDateTime endDate = defaultFormatter.parse(end, LocalDateTime::from);
			
			if(startDate.getYear() == endDate.getYear()) {
				if(startDate.getMonth() == endDate.getMonth()) {
					if(startDate.getDayOfMonth() == endDate.getDayOfMonth()) {
						return s2.format(startDate) + e1.format(endDate);
					} else {
						return s1.format(startDate) + e2.format(endDate);
					}
				} else {
					return s1.format(startDate) + e3.format(endDate);
				}
			} else {
				return s1.format(startDate) + e4.format(endDate);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return null;
	}
	

	private static final DateTimeFormatter simple1 = DateTimeFormatter.ofPattern("MM월 dd일 (E)");
	private static final DateTimeFormatter simple2 = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 (E)");
	public static String simple(String date) {
		try {
			LocalDateTime d = defaultFormatter.parse(date, LocalDateTime::from);
			LocalDateTime now = LocalDateTime.now();
			
			if(d.getYear() == now.getYear()) {
				return simple1.format(d);
			} else {
				return simple2.format(d);
			}
		} catch(Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	

	private static final DateTimeFormatter yyyyMMdd = DateTimeFormatter.ofPattern("yyyy-MM-dd");
	private static final DateTimeFormatter yyyyMMdd_ko = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");
	public static String since(String date) {
		try {
			return "Since " + yyyyMMdd_ko.format(yyyyMMdd.parse(date));
		} catch(Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static long term(String when) {
		try{ 
			LocalDate date = defaultFormatter.parse(when, LocalDate::from);
			LocalDate now = LocalDate.now();
			
			return Math.abs(date.until(now, ChronoUnit.DAYS));
		} catch(Exception e) {
			return -1;
		}
	}
	
	public static boolean wasExpired(String date) {
		try{
			return LocalDateTime.now().isAfter(defaultFormatter.parse(date, LocalDateTime::from));
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	private static final DateTimeFormatter yyMMdd = DateTimeFormatter.ofPattern("yyMMdd");
	public static boolean validateBirth(String birth) {
		try{
			return LocalDateTime.now().isAfter(yyMMdd.parse(birth, LocalDateTime::from));
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	public static Boolean after2000(String yyMMdd) {// datetimeformatter 이용시, 981212 입력하면 2098-12-12로 받아들여서 일단 sdf사용
		try{ 
			SimpleDateFormat format = new SimpleDateFormat("yyMMdd");
			Date date1 = format.parse(yyMMdd);
	        
			Calendar c = Calendar.getInstance();
			c.setTime(date1);
			
			return c.get(Calendar.YEAR) >= 2000;
		} catch(Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	private static final DateTimeFormatter startDateFormat = DateTimeFormatter.ofPattern("yy-MM-dd (E) · ");
	public static String startDate(String start, boolean isOnline) {
		try {
			return startDateFormat.format(defaultFormatter.parse(start)) + (isOnline ? "온라인" : "오프라인");
		} catch (Exception e) {
			return "";
		}
	}

	private static final DateTimeFormatter meridiemFormat = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 a hh:mm");
	public static String meridiem(String date) {
		try {
			return meridiemFormat.format(defaultFormatter.parse(date));
		} catch (Exception e) {
			return "";
		}
	}
}
