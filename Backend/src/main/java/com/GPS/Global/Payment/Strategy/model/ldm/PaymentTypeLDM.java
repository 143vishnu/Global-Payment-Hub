package com.GPS.Global.Payment.Strategy.model.ldm;

/**
 * Enumeration for Payment Types/Schemes
 * Represents different payment methods and rails supported by the platform
 */
public enum PaymentTypeLDM {
    
    /**
     * Single Euro Payments Area (SEPA) Credit Transfer
     */
    SEPA("SEPA Credit Transfer"),
    
    /**
     * Society for Worldwide Interbank Financial Telecommunication
     */
    SWIFT("SWIFT/ISO 20022"),
    
    /**
     * Automated Clearing House (US)
     */
    ACH("ACH Transfer"),
    
    /**
     * Real-Time Gross Settlement
     */
    RTGS("Real-Time Gross Settlement"),
    
    /**
     * International wire transfer
     */
    WIRE("Wire Transfer"),
    
    /**
     * Internal book transfer within JPMC
     */
    INTERNAL("Internal Transfer"),
    
    /**
     * Faster Payments Service (UK)
     */
    FPS("Faster Payments"),
    
    /**
     * Fedwire (US)
     */
    FEDWIRE("Fedwire"),
    
    /**
     * TARGET2 (EU)
     */
    TARGET2("TARGET2"),
    
    /**
     * CHIPS - Clearing House Interbank Payments System (US)
     */
    CHIPS("CHIPS");

    private final String description;

    PaymentTypeLDM(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Check if payment type is real-time
     * 
     * @return true if real-time processing
     */
    public boolean isRealTime() {
        return this == RTGS || this == FPS || this == FEDWIRE || this == TARGET2 || this == INTERNAL;
    }

    /**
     * Check if payment type is international
     * 
     * @return true if cross-border payment
     */
    public boolean isInternational() {
        return this == SWIFT || this == WIRE;
    }

    /**
     * Check if payment type requires enhanced validation
     * 
     * @return true if enhanced validation needed
     */
    public boolean requiresEnhancedValidation() {
        return this == SWIFT || this == WIRE || this == FEDWIRE;
    }

    /**
     * Get typical settlement time in hours
     * 
     * @return settlement time in hours
     */
    public int getTypicalSettlementHours() {
        return switch (this) {
            case RTGS, FPS, FEDWIRE, TARGET2, INTERNAL -> 0; // Instant
            case ACH -> 24;
            case SEPA -> 24;
            case SWIFT, WIRE -> 48;
            case CHIPS -> 1;
        };
    }
}
