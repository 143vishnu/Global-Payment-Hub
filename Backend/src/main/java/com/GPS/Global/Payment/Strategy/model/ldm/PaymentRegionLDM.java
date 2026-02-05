package com.GPS.Global.Payment.Strategy.model.ldm;

/**
 * Enumeration for Payment Regions
 * Represents geographic regions for payment routing and processing
 */
public enum PaymentRegionLDM {
    
    /**
     * North America (US, Canada, Mexico)
     */
    NA("North America"),
    
    /**
     * Europe (EU member states and associated countries)
     */
    EU("Europe"),
    
    /**
     * Asia Pacific (Asia, Australia, New Zealand)
     */
    APAC("Asia Pacific"),
    
    /**
     * Latin America (Central and South America)
     */
    LATAM("Latin America"),
    
    /**
     * Middle East and Africa
     */
    MEA("Middle East and Africa"),
    
    /**
     * Global/Cross-regional payments
     */
    GLOBAL("Global");

    private final String description;

    PaymentRegionLDM(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Determine if region requires special compliance checks
     * 
     * @return true if enhanced compliance required
     */
    public boolean requiresEnhancedCompliance() {
        return this == MEA || this == GLOBAL;
    }

    /**
     * Get timezone identifier for the region
     * 
     * @return timezone ID
     */
    public String getTimezone() {
        return switch (this) {
            case NA -> "America/New_York";
            case EU -> "Europe/London";
            case APAC -> "Asia/Tokyo";
            case LATAM -> "America/Sao_Paulo";
            case MEA -> "Asia/Dubai";
            case GLOBAL -> "UTC";
        };
    }
}
