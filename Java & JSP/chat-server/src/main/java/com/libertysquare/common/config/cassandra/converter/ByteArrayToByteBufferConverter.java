package com.libertysquare.common.config.cassandra.converter;

import java.nio.ByteBuffer;

import org.springframework.core.convert.converter.Converter;

import com.libertysquare.common.util.JsonUtils;

public class ByteArrayToByteBufferConverter implements Converter<byte[], ByteBuffer> {
	@Override
	public ByteBuffer convert(byte[] source) {
		System.out.println("byte[] -> ByteBuffer : " + JsonUtils.toJson(source));
		return ByteBuffer.wrap(source);
	}
}