package lang;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public enum DynamicEnumPolicy {
	STRICT(new DynamicEnumPolice() {
		@Override
		public <E extends DynamicEnum<E>> void evaluate(Map<String, E> map, E[] elements) {
			Map<String, E> strictMap = Arrays.stream(elements)
				.filter(distinctByKey(DynamicEnum::name))
				.filter(distinctByKey(DynamicEnum::ordinal))
				.collect(Collectors.toMap(DynamicEnum::name, Function.identity()));;
			
			map.putAll(strictMap);
		}
		
		private <T> Predicate<T> distinctByKey(Function<? super T, Object> keyExtractor) {
			Map<Object, Boolean> map = new HashMap<>();
			return t -> map.putIfAbsent(keyExtractor.apply(t), Boolean.TRUE) == null;
		}
	}),
	
	/**
	 * - In case of duplicate key, only the first one is allowed.<br>
	 * - Automatically sets the smallest integer in case of duplicate ordinal.<br>
	 */
	SMART(new DynamicEnumPolice() {
		@Override
		public <E extends DynamicEnum<E>> void evaluate(Map<String, E> map, E[] elements) {
			List<Integer> ordinals = new LinkedList<>();
			for(E e : elements) {
				String key = e.name();
				if(map.containsKey(key)) return;
				
				if(ordinals.contains(e.ordinal())) {
					int smallest = findMissingPositive(ordinals);
					forcedChangeOrdinal(e, smallest);
				}
				ordinals.add(e.ordinal());
				
				map.put(key, e);
			}
		}
		
		public int findMissingPositive(List<Integer> nums) {
			Collections.sort(nums);
			
			int i = 0;
			while(nums.contains(i)) i++;
	        return i;
	    }
		
		public void forcedChangeOrdinal(DynamicEnum<?> element, int ordinal) {
			try {
				Field field = element.getDeclaringClass().getDeclaredField("ordinal");
				field.setAccessible(true);
				field.setInt(element, ordinal);
				field.setAccessible(false);
			} catch (Exception e1) {}
		}
	}),
	
	/**
	 * just call {@link Map#put(Object, Object)}
	 */
	LENIENT(new DynamicEnumPolice() {
		@Override
		public <E extends DynamicEnum<E>> void evaluate(Map<String, E> map, E[] elements) {
			for(E e : elements) {
				map.put(e.name(), e);
			}
		}
	});
	
	private final DynamicEnumPolice police;
	
	private DynamicEnumPolicy(DynamicEnumPolice police) {
		this.police = police;
	}
	
	public <E extends DynamicEnum<E>> void evaluate(Map<String, E> map, E[] elements) {
		police.evaluate(map, elements);
	}
	
	@FunctionalInterface
	public interface DynamicEnumPolice {
		<E extends DynamicEnum<E>> void evaluate(Map<String, E> map, E[] elements);
	}
}
