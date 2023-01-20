package com.libertysquare.common.config.cassandra.converter;

import java.nio.ByteBuffer;

import org.springframework.core.convert.converter.Converter;

import com.datastax.oss.driver.internal.core.type.codec.SimpleBlobCodec;
import com.datastax.oss.protocol.internal.util.Bytes;

public class ByteBufferToByteArrayConverter implements Converter<ByteBuffer, byte[]> {
	/**
	 * {@link ByteBuffer#array()} 사용시 이상한 값이 나옴.
	 * 따라서, {@link SimpleBlobCodec} 을 참고하여
	 * {@link Bytes#getArray(ByteBuffer)} 사용
	 */
	@Override
	public byte[] convert(ByteBuffer source) {
		
		return Bytes.getArray(source);
	}
}