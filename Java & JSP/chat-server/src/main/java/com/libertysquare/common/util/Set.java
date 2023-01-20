package com.libertysquare.common.util;

import java.util.HashSet;

public class Set {
	/**
	 * {@link java.util.Set#of} 가 java 9 부터 지원해서, 대체용으로 만듦
	 * @return {@link HashSet}
	 */
	@SafeVarargs
	public static <E> java.util.Set<E> of(E... elements) {
		if(elements == null) return null;
		
		HashSet<E> set = new HashSet<>();
		for(E e : elements) {
			set.add(e);
		}
		
		return set;
	}
}
