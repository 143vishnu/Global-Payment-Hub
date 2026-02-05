package com.GPS.Global.Payment.Strategy.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * JPA Entity for Payment
 * Maps to PAYMENTS table in Oracle database
 */
@Entity
@Table(name = "PAYMENTS", indexes = {
        @Index(name = "idx_payment_id", columnList = "payment_id", unique = true),
        @Index(name = "idx_idempotency_key", columnList = "idempotency_key", unique = true),
        @Index(name = "idx_status", columnList = "status"),
        @Index(name = "idx_created_at", columnList = "created_at")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "payment_seq")
    @SequenceGenerator(name = "payment_seq", sequenceName = "PAYMENT_SEQ", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @Column(name = "payment_id", nullable = false, unique = true, length = 36)
    private String paymentId;

    @Column(name = "idempotency_key", nullable = false, unique = true, length = 100)
    private String idempotencyKey;

    @Column(name = "source_account", nullable = false, length = 34)
    private String sourceAccount;

    @Column(name = "destination_account", nullable = false, length = 34)
    private String destinationAccount;

    @Column(name = "amount", nullable = false, precision = 17, scale = 2)
    private BigDecimal amount;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency;

    @Column(name = "payment_type", nullable = false, length = 50)
    private String paymentType;

    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "originator_name", length = 140)
    private String originatorName;

    @Column(name = "beneficiary_name", length = 140)
    private String beneficiaryName;

    @Column(name = "transaction_reference", length = 100)
    private String transactionReference;

    @Column(name = "status_reason", length = 500)
    private String statusReason;

    @Column(name = "requested_execution_date")
    private LocalDateTime requestedExecutionDate;

    @Column(name = "executed_at")
    private LocalDateTime executedAt;

    @Column(name = "reference_number", length = 100)
    private String referenceNumber;

    @Column(name = "purpose_code", length = 10)
    private String purposeCode;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Version
    @Column(name = "version")
    private Long version;
}
