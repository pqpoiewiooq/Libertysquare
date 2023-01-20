package lang;

import java.io.IOException;
import java.io.InvalidObjectException;
import java.io.ObjectInputStream;
import java.io.ObjectStreamException;
import java.lang.reflect.Array;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @implNote https://megazonedsg.github.io/dyna-enum/
 */
public abstract class DynamicEnum<E extends DynamicEnum<E>> implements Comparable<E> {
	private static Map<Class<? extends DynamicEnum<?>>, Map<String, DynamicEnum<?>>> elements = new ConcurrentHashMap<Class<? extends DynamicEnum<?>>, Map<String, DynamicEnum<?>>>();

	private final String name;

	public final String name() {
		return name;
	}

	private final int ordinal;

	public final int ordinal() {
		return ordinal;
	}

	protected DynamicEnum(String name, int ordinal) {
		this.name = name;
		this.ordinal = ordinal;
	}

	@Override
	public String toString() {
		return name;
	}

	@Override
	public final boolean equals(Object other) {
		return this == other;
	}

	@Override
	public final int hashCode() {
		return super.hashCode();
	}

	@Override
	protected final Object clone() throws CloneNotSupportedException {
		throw new CloneNotSupportedException();
	}

	@Override
	public final int compareTo(E o) {
		DynamicEnum<?> other = (DynamicEnum<?>) o;
		DynamicEnum<E> self = this;
		if (self.getClass() != other.getClass() && self.getDeclaringClass() != other.getDeclaringClass())
			throw new ClassCastException();
		return self.ordinal - other.ordinal;
	}

	@SuppressWarnings("unchecked")
	public final Class<E> getDeclaringClass() {
		Class<?> clazz = getClass();
		Class<?> zuper = clazz.getSuperclass();
		return (Class<E>) ((zuper == Enum.class) ? clazz : zuper);
	}

	@Override
	protected final void finalize() {}
	
	// Serializable
	private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
		throw new InvalidObjectException("can't deserialize enum");
	}

	// Serializable
	@SuppressWarnings("unused")
	private void readObjectNoData() throws ObjectStreamException {
		throw new InvalidObjectException("can't deserialize enum");
	}
	
	
	
	
	
	@SuppressWarnings("unchecked")
	public static <T extends DynamicEnum<T>> T valueOf(Class<T> enumType, String name) {
		T t = (T) getOrElseThrow(enumType).get(name);
		if (t != null) {
			return t;
		}
		throw new IllegalArgumentException("No enum constant " + enumType.getCanonicalName() + "." + name);
	}
	
	@SuppressWarnings("unchecked")
	public static <T extends DynamicEnum<T>> T[] values(Class<T> enumType) {
		Map<String, DynamicEnum<?>> typeElements = getOrElseThrow(enumType);

		Collection<DynamicEnum<?>> values = typeElements.values();
		T[] typedValues = (T[]) Array.newInstance(enumType, values.size());
		int i = 0;
		for (DynamicEnum<?> value : values) {
			Array.set(typedValues, i, value);
			i++;
		}
		return typedValues;
	}

	public static <T extends DynamicEnum<T>> void remove(Class<T> enumType) {
		Map<String, DynamicEnum<?>> typeElements = elements.remove(enumType);
		if (typeElements != null) {
			typeElements.clear();
		}
	}
	
	public static <T extends DynamicEnum<T>> T[] load(Class<T> enumType, DynamicEnumLoader<T> loader) {
		T[] typedValues = loader.load();
		
		@SuppressWarnings("unchecked")
		Map<String, T> typeElements = (Map<String, T>) elements.computeIfAbsent(enumType, k -> new LinkedHashMap<String, DynamicEnum<?>>());
		typeElements.clear();
		loader.getPolicy().evaluate(typeElements, typedValues);
		
		return typedValues;
	}

	private static <T extends DynamicEnum<T>> Map<String, DynamicEnum<?>> getOrElseThrow(Class<T> enumType) {
		Map<String, DynamicEnum<?>> typeElements = elements.get(enumType);
		if(typeElements == null) throw new NullPointerException("call to load(enumType, DynamicEnumLoader) before use");
		
		return typeElements;
	}
	
	
	
	
	public static <E> E valueOf(String name) {
		throw new IllegalStateException("Subclass of DynamicEnum must implement method valueOf()");
	}

	public static <E> E[] values() {
		throw new IllegalStateException("Subclass of DynamicEnum must implement method values()");
	}
}