package util;

import java.util.function.Supplier;

public class Memoization<T> implements Supplier<T> {
    private Supplier<? extends T> supplier;
    private volatile T value;

    private Memoization(Supplier<? extends T> supplier) {
        this.supplier = supplier;
    }

    public static <T> Memoization<T> of(Supplier<? extends T> supplier) {
        return new Memoization<>(supplier);
    }

    @Override
    public T get() {
        T localReference = value;
        if (localReference == null) {
            synchronized (this) {
                localReference = value;
                if (localReference == null) {
                    value = localReference = supplier.get();
                    supplier = null;
                }
            }
        }
        return localReference;
    }
}
