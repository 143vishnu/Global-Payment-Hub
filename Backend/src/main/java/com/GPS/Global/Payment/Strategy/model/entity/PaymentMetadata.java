package com.GPS.Global.Payment.Strategy.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA Entity for Payment Metadata
 * 
 * Stores payment transaction metadata for tracking and auditing purposes.
 * Uses Oracle-compatible JPA annotations for future migration to Oracle DB.
 * 
 * Database: H2 (development) / Oracle (production)
 * Table: PAYMENT_METADATA
 * Sequence: PAYMENT_METADATA_SEQ
 */
@Entity
@Table(
    name = "PAYMENT_METADATA",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_payment_id", columnNames = "payment_id")
    },
    indexes = {
        @Index(name = "idx_payment_id", columnList = "payment_id", unique = true),
        @Index(name = "idx_status", columnList = "status"),
        @Index(name = "idx_channel", columnList = "channel"),
        @Index(name = "idx_created_at", columnList = "created_at")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMetadata {

    /**
     * Primary key - auto-generated using sequence
     * Oracle-compatible sequence generation strategy
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "payment_metadata_seq_gen")
    @SequenceGenerator(
        name = "payment_metadata_seq_gen",
        sequenceName = "PAYMENT_METADATA_SEQ",
        allocationSize = 1,
        initialValue = 1
    )
    @Column(name = "id", nullable = false, updatable = false)
    private Long id;

    /**
     * Business key - unique payment identifier
     * Used for idempotency and correlation across systems
     */
    @Column(name = "payment_id", nullable = false, unique = true, length = 50)
    private String paymentId;

    /**
     * Payment status
     * Examples: PENDING, PROCESSING, COMPLETED, FAILED, REJECTED
     */
    @Column(name = "status", nullable = false, length = 50)
    private String status;

    /**
     * Source channel identifier
     * Examples: WEB, MOBILE, API, IBM_MQ, KAFKA
     */
    @Column(name = "channel", nullable = false, length = 50)
    private String channel;

    /**
     * Timestamp when the metadata record was created
     * Auto-populated via @PrePersist
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when the metadata record was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Correlation ID for distributed tracing
     */
    @Column(name = "correlation_id", length = 100)
    private String correlationId;

    /**
     * Additional metadata as JSON or text
     */
    @Column(name = "metadata_json", length = 4000)
    private String metadataJson;

    /**
     * Version field for optimistic locking
     */
    @Version
    @Column(name = "version")
    private Long version;

    /**
     * Pre-persist callback to set createdAt timestamp
     * Automatically invoked before entity is persisted to database
     */
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        updatedAt = LocalDateTime.now();
    }

    /**
     * Pre-update callback to update timestamp
     * Automatically invoked before entity is updated in database
     */
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
