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
 * Data Transfer Object for Payment Request
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDTO {

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
    @Pattern(regexp = "[A-Z]{3}", message = "Currency must be a valid 3-letter ISO code")
    private String currency;

    @NotBlank(message = "Payment type is required")
    private String paymentType;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotBlank(message = "Originator name is required")
    private String originatorName;

    @NotBlank(message = "Beneficiary name is required")
    private String beneficiaryName;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime requestedExecutionDate;

    private String referenceNumber;

    private String purposeCode;
}
