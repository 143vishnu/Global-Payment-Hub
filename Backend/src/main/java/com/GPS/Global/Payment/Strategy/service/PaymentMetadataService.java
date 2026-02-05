package com.GPS.Global.Payment.Strategy.service;

import com.GPS.Global.Payment.Strategy.model.entity.PaymentMetadata;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for PaymentMetadata operations
 */
public interface PaymentMetadataService {

    /**
     * Save payment metadata
     * 
     * @param metadata Payment metadata
     * @return Saved metadata
     */
    PaymentMetadata saveMetadata(PaymentMetadata metadata);

    /**
     * Find payment metadata by payment ID
     * 
     * @param paymentId Payment ID
     * @return Optional containing metadata if found
     */
    Optional<PaymentMetadata> findByPaymentId(String paymentId);

    /**
     * Find all metadata by status
     * 
     * @param status Payment status
     * @return List of metadata
     */
    List<PaymentMetadata> findByStatus(String status);

    /**
     * Update payment status
     * 
     * @param paymentId Payment ID
     * @param newStatus New status
     * @return Updated metadata
     */
    PaymentMetadata updateStatus(String paymentId, String newStatus);

    /**
     * Check if payment metadata exists
     * 
     * @param paymentId Payment ID
     * @return true if exists
     */
    boolean existsByPaymentId(String paymentId);

    /**
     * Delete old metadata records
     * 
     * @param cutoffDate Cutoff date
     * @return Number of deleted records
     */
    int deleteOldRecords(LocalDateTime cutoffDate);
}
