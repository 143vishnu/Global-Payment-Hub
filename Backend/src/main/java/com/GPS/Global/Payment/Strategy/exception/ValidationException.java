package com.GPS.Global.Payment.Strategy.exception;

/**
 * Exception for validation errors
 */
public class ValidationException extends RuntimeException {

    private final String field;
    private final String rejectedValue;

    public ValidationException(String message) {
        super(message);
        this.field = null;
        this.rejectedValue = null;
    }

    public ValidationException(String message, String field) {
        super(message);
        this.field = field;
        this.rejectedValue = null;
    }

    public ValidationException(String message, String field, String rejectedValue) {
        super(message);
        this.field = field;
        this.rejectedValue = rejectedValue;
    }

    public ValidationException(String message, Throwable cause) {
        super(message, cause);
        this.field = null;
        this.rejectedValue = null;
    }

    public String getField() {
        return field;
    }

    public String getRejectedValue() {
        return rejectedValue;
    }
}
