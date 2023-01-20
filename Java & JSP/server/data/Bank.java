package data;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

// 은행 코드 참조 - https://exeter.tistory.com/311
public enum Bank {
	HANA("하나은행", 1),
	KDB("산업은행", 2),
	IBK("기업은행", 3),
	KB("국민은행", 4),
	SH("수협은행", 7),
	NH("농협은행", 11),
	WB("우리은행", 20),
	SC("제일은행", 23),
	CITY("시티은행", 27),
	DGB("대구은행", 31),
	BNK_BUSAN("부산은행", 32),
	BNK_KN("경남은행", 39),
	MG("새마을금고", 45),
	CU("신협", 48),
	POST("우체국", 71),
	SHINHAN("신한은행", 88),
	K("케이뱅크", 89),
	KAKAO("카카오뱅크", 90),
	TOSS("토스뱅크", 92);
	
	private String ko;
	private int code;
	
	Bank(String ko, int code) {
		this.ko = ko;
		this.code = code;
	}
	
	@Override
	public String toString() {
		return this.ko;
	}
	
	public int code() {
		return this.code;
	}
	
	private static final Map<Integer, Bank> codeMap = Collections.unmodifiableMap(Stream.of(values()).collect(Collectors.toMap(Bank::code, Function.identity())));
	public static Bank from(int code) {
		return Optional.ofNullable(codeMap.get(code)).orElse(null);
	}
	
	private static final Map<String, Bank> koMap = Collections.unmodifiableMap(Stream.of(values()).collect(Collectors.toMap(Bank::toString, Function.identity())));
	public static Bank from(String ko) {
		return Optional.ofNullable(koMap.get(ko)).orElse(null);
	}
	
	
//	지방 - 경남은행 / 광주은행 / 대구은행 / 부산은행 / 전북은행 / 제주은행 |||||
}
