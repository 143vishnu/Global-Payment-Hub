package com.GPS.Global.Payment.Strategy.exception;

/**
 * Exception thrown when duplicate request is detected via idempotency key
 */
public class DuplicateRequestException extends RuntimeException {

    public DuplicateRequestException(String message) {
        super(message);
    }

    public DuplicateRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}
