package com.GPS.Global.Payment.Strategy.model.ldm;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Logical Data Model for Payment Instruction
 * Represents the canonical payment data structure used across the Graphite payment engine
 * and downstream systems in the P3 platform.
 * 
 * This LDM serves as the standardized format for payment instructions
 * exchanged between the Isolation Layer, Core Payment Engine, and external systems.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaymentInstructionLDM {

    /**
     * Unique payment instruction identifier
     * Format: UUID or system-generated unique ID
     */
    @NotBlank(message = "Payment ID is required")
    @Size(max = 50, message = "Payment ID cannot exceed 50 characters")
    @JsonProperty("payment_id")
    private String paymentId;

    /**
     * Payment amount
     * Must be positive and have maximum 2 decimal places
     */
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    @Digits(integer = 15, fraction = 2, message = "Amount must have maximum 2 decimal places")
    @JsonProperty("amount")
    private BigDecimal amount;

    /**
     * Currency code in ISO 4217 format (3-letter code)
     * Examples: USD, EUR, GBP, JPY
     */
    @NotBlank(message = "Currency is required")
    @Pattern(regexp = "^[A-Z]{3}$", message = "Currency must be a valid 3-letter ISO 4217 code")
    @Size(min = 3, max = 3, message = "Currency must be exactly 3 characters")
    @JsonProperty("currency")
    private String currency;

    /**
     * Debtor (sender) account identifier
     * Can be IBAN, account number, or other account format
     */
    @NotBlank(message = "Debtor account is required")
    @Size(min = 10, max = 34, message = "Debtor account must be between 10 and 34 characters")
    @JsonProperty("debtor_account")
    private String debtorAccount;

    /**
     * Creditor (receiver) account identifier
     * Can be IBAN, account number, or other account format
     */
    @NotBlank(message = "Creditor account is required")
    @Size(min = 10, max = 34, message = "Creditor account must be between 10 and 34 characters")
    @JsonProperty("creditor_account")
    private String creditorAccount;

    /**
     * Payment type/scheme identifier
     * Examples: SEPA, SWIFT, ACH, RTGS, WIRE, INTERNAL
     */
    @NotBlank(message = "Payment type is required")
    @Size(max = 50, message = "Payment type cannot exceed 50 characters")
    @JsonProperty("payment_type")
    private String paymentType;

    /**
     * Geographic region for payment routing
     * Examples: NA (North America), EU (Europe), APAC (Asia Pacific), LATAM (Latin America)
     */
    @NotBlank(message = "Region is required")
    @Pattern(regexp = "^(NA|EU|APAC|LATAM|MEA|GLOBAL)$", 
             message = "Region must be one of: NA, EU, APAC, LATAM, MEA, GLOBAL")
    @JsonProperty("region")
    private String region;

    /**
     * Payment instruction status
     * Lifecycle: PENDING -> PROCESSING -> COMPLETED | FAILED | REJECTED
     */
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(PENDING|PROCESSING|COMPLETED|FAILED|REJECTED|CANCELLED)$",
             message = "Status must be one of: PENDING, PROCESSING, COMPLETED, FAILED, REJECTED, CANCELLED")
    @JsonProperty("status")
    private String status;

    /**
     * Timestamp when the payment instruction was created
     * Format: ISO 8601 (yyyy-MM-dd'T'HH:mm:ss)
     */
    @NotNull(message = "Created timestamp is required")
    @PastOrPresent(message = "Created timestamp cannot be in the future")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "UTC")
    @JsonProperty("created_timestamp")
    private LocalDateTime createdTimestamp;

    /**
     * Validate the payment instruction for business rules
     * 
     * @return true if valid, false otherwise
     */
    public boolean isValid() {
        return paymentId != null && !paymentId.isBlank()
                && amount != null && amount.compareTo(BigDecimal.ZERO) > 0
                && currency != null && currency.matches("^[A-Z]{3}$")
                && debtorAccount != null && !debtorAccount.isBlank()
                && creditorAccount != null && !creditorAccount.isBlank()
                && paymentType != null && !paymentType.isBlank()
                && region != null && !region.isBlank()
                && status != null && !status.isBlank()
                && createdTimestamp != null;
    }

    /**
     * Check if payment is in a terminal state
     * 
     * @return true if status is COMPLETED, FAILED, REJECTED, or CANCELLED
     */
    public boolean isTerminal() {
        return "COMPLETED".equals(status) 
                || "FAILED".equals(status) 
                || "REJECTED".equals(status)
                || "CANCELLED".equals(status);
    }

    /**
     * Check if payment is actively processing
     * 
     * @return true if status is PENDING or PROCESSING
     */
    public boolean isActive() {
        return "PENDING".equals(status) || "PROCESSING".equals(status);
    }
}
