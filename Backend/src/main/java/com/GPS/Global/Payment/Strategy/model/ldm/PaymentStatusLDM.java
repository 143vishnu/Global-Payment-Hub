package com.GPS.Global.Payment.Strategy.model.ldm;

/**
 * Enumeration for Payment Instruction Status
 * Represents the lifecycle states of a payment in the LDM
 */
public enum PaymentStatusLDM {
    
    /**
     * Payment instruction received and awaiting processing
     */
    PENDING("Payment pending processing"),
    
    /**
     * Payment currently being processed by the payment engine
     */
    PROCESSING("Payment in progress"),
    
    /**
     * Payment successfully completed
     */
    COMPLETED("Payment completed successfully"),
    
    /**
     * Payment failed due to technical or business error
     */
    FAILED("Payment failed"),
    
    /**
     * Payment rejected due to validation or compliance rules
     */
    REJECTED("Payment rejected"),
    
    /**
     * Payment cancelled by user or system
     */
    CANCELLED("Payment cancelled");

    private final String description;

    PaymentStatusLDM(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Check if status represents a terminal state
     * 
     * @return true if terminal state
     */
    public boolean isTerminal() {
        return this == COMPLETED || this == FAILED || this == REJECTED || this == CANCELLED;
    }

    /**
     * Check if status represents an active processing state
     * 
     * @return true if active state
     */
    public boolean isActive() {
        return this == PENDING || this == PROCESSING;
    }
}
