package com.GPS.Global.Payment.Strategy.repository;

import com.GPS.Global.Payment.Strategy.model.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Payment entity persistence operations
 */
@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {

    /**
     * Find payment by unique payment identifier
     * 
     * @param paymentId Unique payment ID
     * @return Optional containing payment if found
     */
    Optional<PaymentEntity> findByPaymentId(String paymentId);

    /**
     * Find payment by idempotency key for duplicate detection
     * 
     * @param idempotencyKey Idempotency key
     * @return Optional containing payment if found
     */
    Optional<PaymentEntity> findByIdempotencyKey(String idempotencyKey);

    /**
     * Check if payment exists with given idempotency key
     * 
     * @param idempotencyKey Idempotency key
     * @return true if payment exists
     */
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM PaymentEntity p WHERE p.idempotencyKey = :idempotencyKey")
    boolean existsByIdempotencyKey(@Param("idempotencyKey") String idempotencyKey);
}
