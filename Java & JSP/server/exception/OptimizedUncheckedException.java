package exception;

import java.io.PrintStream;
import java.io.PrintWriter;

public class OptimizedUncheckedException extends RuntimeException {
	private static final long serialVersionUID = -3292500481835614759L;

	public OptimizedUncheckedException(String msg) {
		super(msg);
	}
	
	@Override
    public synchronized Throwable getCause() {
        return this;
    }

	@Override
    public synchronized Throwable initCause(Throwable cause) {
        return this;
    }

    @Override
    public void printStackTrace() {}

    @Override
    public void printStackTrace(PrintStream s) {}

    @Override
    public void printStackTrace(PrintWriter s) {}

    @Override
    public synchronized Throwable fillInStackTrace() {
        return this;
    }
    
    @Override
    public void setStackTrace(StackTraceElement[] stackTrace) {}
}
