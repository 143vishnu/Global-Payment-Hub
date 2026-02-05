package com.GPS.Global.Payment.Strategy.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for Payment Ingress Request from External Channels
 * Represents the channel-specific payment instruction format
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentIngressRequestDTO {

    @NotBlank(message = "Source account is required")
    @Size(min = 10, max = 34, message = "Source account must be between 10 and 34 characters")
    private String sourceAccount;

    @NotBlank(message = "Destination account is required")
    @Size(min = 10, max = 34, message = "Destination account must be between 10 and 34 characters")
    private String destinationAccount;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    @Digits(integer = 15, fraction = 2, message = "Invalid amount format")
    private BigDecimal amount;

    @NotBlank(message = "Currency code is required")
    @Pattern(regexp = "^[A-Z]{3}$", message = "Currency must be a valid 3-letter ISO code")
    private String currency;

    @NotBlank(message = "Payment type is required")
    @Size(max = 50, message = "Payment type cannot exceed 50 characters")
    private String paymentType;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotBlank(message = "Originator name is required")
    @Size(max = 140, message = "Originator name cannot exceed 140 characters")
    private String originatorName;

    @NotBlank(message = "Beneficiary name is required")
    @Size(max = 140, message = "Beneficiary name cannot exceed 140 characters")
    private String beneficiaryName;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime requestedExecutionDate;

    @Size(max = 100, message = "Reference number cannot exceed 100 characters")
    private String referenceNumber;

    @Pattern(regexp = "^[A-Z0-9]{0,10}$", message = "Purpose code must be alphanumeric, max 10 characters")
    private String purposeCode;

    @Size(max = 2, message = "Country code must be 2 characters")
    @Pattern(regexp = "^[A-Z]{2}$", message = "Country code must be a valid 2-letter ISO code")
    private String originatorCountry;

    @Size(max = 2, message = "Country code must be 2 characters")
    @Pattern(regexp = "^[A-Z]{2}$", message = "Country code must be a valid 2-letter ISO code")
    private String beneficiaryCountry;

    private String channelReference;
}
