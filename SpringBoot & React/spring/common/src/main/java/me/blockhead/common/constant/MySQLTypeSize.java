package me.blockhead.common.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MySQLTypeSize {
	public static final int TINYTEXT = 255;
	public static final int TEXT = 65535;
	public static final int MEDIUMTEXT = 16777215;
	public static final long LONGTEXT = 4294967295l;
}
