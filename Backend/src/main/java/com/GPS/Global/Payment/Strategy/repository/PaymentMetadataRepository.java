package com.GPS.Global.Payment.Strategy.repository;

import com.GPS.Global.Payment.Strategy.model.entity.PaymentMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for PaymentMetadata entity
 * 
 * Provides CRUD operations and custom query methods for payment metadata
 * Follows Spring Data naming conventions for automatic query generation
 */
@Repository
public interface PaymentMetadataRepository extends JpaRepository<PaymentMetadata, Long> {

    /**
     * Find payment metadata by payment ID
     * 
     * @param paymentId Unique payment identifier
     * @return Optional containing PaymentMetadata if found
     */
    Optional<PaymentMetadata> findByPaymentId(String paymentId);

    /**
     * Find all payment metadata by status
     * 
     * @param status Payment status
     * @return List of payment metadata records
     */
    List<PaymentMetadata> findByStatus(String status);

    /**
     * Find all payment metadata by channel
     * 
     * @param channel Source channel identifier
     * @return List of payment metadata records
     */
    List<PaymentMetadata> findByChannel(String channel);

    /**
     * Find payment metadata by status and channel
     * 
     * @param status Payment status
     * @param channel Source channel
     * @return List of payment metadata records
     */
    List<PaymentMetadata> findByStatusAndChannel(String status, String channel);

    /**
     * Find payment metadata created after specific timestamp
     * 
     * @param createdAt Timestamp threshold
     * @return List of payment metadata records
     */
    List<PaymentMetadata> findByCreatedAtAfter(LocalDateTime createdAt);

    /**
     * Find payment metadata created between two timestamps
     * 
     * @param startDate Start timestamp
     * @param endDate End timestamp
     * @return List of payment metadata records
     */
    List<PaymentMetadata> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Check if payment metadata exists for given payment ID
     * 
     * @param paymentId Unique payment identifier
     * @return true if exists, false otherwise
     */
    boolean existsByPaymentId(String paymentId);

    /**
     * Count payment metadata records by status
     * 
     * @param status Payment status
     * @return Count of records
     */
    @Query("SELECT COUNT(pm) FROM PaymentMetadata pm WHERE pm.status = :status")
    long countByStatus(@Param("status") String status);

    /**
     * Find payment metadata by correlation ID
     * 
     * @param correlationId Correlation ID
     * @return List of payment metadata records
     */
    List<PaymentMetadata> findByCorrelationId(String correlationId);

    /**
     * Find payment metadata by status with pagination support
     * Custom JPQL query for complex filtering
     * 
     * @param status Payment status
     * @param channel Source channel
     * @return List of payment metadata
     */
    @Query("SELECT pm FROM PaymentMetadata pm WHERE pm.status = :status AND pm.channel = :channel ORDER BY pm.createdAt DESC")
    List<PaymentMetadata> findByStatusAndChannelOrderByCreatedAtDesc(
            @Param("status") String status,
            @Param("channel") String channel);

    /**
     * Delete payment metadata older than specified date
     * Used for data retention and cleanup
     * 
     * @param cutoffDate Cutoff timestamp
     * @return Number of deleted records
     */
    @Query("DELETE FROM PaymentMetadata pm WHERE pm.createdAt < :cutoffDate")
    int deleteOldRecords(@Param("cutoffDate") LocalDateTime cutoffDate);
}
