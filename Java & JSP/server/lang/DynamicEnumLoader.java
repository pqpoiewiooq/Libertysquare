package lang;

public interface DynamicEnumLoader<E extends DynamicEnum<E>> {
	E[] load();
	
	default DynamicEnumPolicy getPolicy() {
		return DynamicEnumPolicy.SMART;
	}
}
