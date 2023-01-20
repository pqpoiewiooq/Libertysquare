package me.blockhead.common.util;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class DateUtils {
//	public static boolean wasExpired(LocalDateTime datetime) {
//		try{ 
//			return datetime.isBefore(LocalDateTime.now());
//		} catch(Exception e) {
//			e.printStackTrace();
//			return false;
//		}
//	}
	
	public static boolean validateBirth(String birth) {
		try{ 
			SimpleDateFormat format = new SimpleDateFormat("yyMMdd");
			Date date1 = format.parse(birth);
			Date date2 = new Date();
	        
			Calendar c = Calendar.getInstance();
			c.setTime(date1);
			if(c.get(Calendar.YEAR) < 1900) return false;
			
			long cal = date1.getTime() - date2.getTime(); 
			
			return (cal < 0);
		} catch(Exception e) {
			e.printStackTrace();
		}
		return false;
	}
	
	public static Boolean after2000(String yyMMdd) {
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
}
