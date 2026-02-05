package com.GPS.Global.Payment.Strategy.exception;

/**
 * Exception for messaging/integration errors
 */
public class MessagingException extends RuntimeException {

    private final String destination;
    private final String messageId;

    public MessagingException(String message) {
        super(message);
        this.destination = null;
        this.messageId = null;
    }

    public MessagingException(String message, String destination) {
        super(message);
        this.destination = destination;
        this.messageId = null;
    }

    public MessagingException(String message, String destination, String messageId) {
        super(message);
        this.destination = destination;
        this.messageId = messageId;
    }

    public MessagingException(String message, Throwable cause) {
        super(message, cause);
        this.destination = null;
        this.messageId = null;
    }

    public MessagingException(String message, String destination, Throwable cause) {
        super(message, cause);
        this.destination = destination;
        this.messageId = null;
    }

    public String getDestination() {
        return destination;
    }

    public String getMessageId() {
        return messageId;
    }
}
