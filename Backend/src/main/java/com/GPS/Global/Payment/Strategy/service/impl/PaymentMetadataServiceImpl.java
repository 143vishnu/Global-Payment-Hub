package com.GPS.Global.Payment.Strategy.service.impl;

import com.GPS.Global.Payment.Strategy.exception.PaymentNotFoundException;
import com.GPS.Global.Payment.Strategy.model.entity.PaymentMetadata;
import com.GPS.Global.Payment.Strategy.repository.PaymentMetadataRepository;
import com.GPS.Global.Payment.Strategy.service.PaymentMetadataService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Implementation of PaymentMetadataService
 * Handles payment metadata CRUD operations
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentMetadataServiceImpl implements PaymentMetadataService {

    private final PaymentMetadataRepository metadataRepository;

    @Override
    @Transactional
    public PaymentMetadata saveMetadata(PaymentMetadata metadata) {
        log.info("Saving payment metadata. PaymentId: {}", metadata.getPaymentId());
        
        PaymentMetadata saved = metadataRepository.save(metadata);
        
        log.debug("Payment metadata saved. PaymentId: {}, Id: {}", 
                saved.getPaymentId(), saved.getId());
        
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PaymentMetadata> findByPaymentId(String paymentId) {
        log.debug("Finding payment metadata by paymentId: {}", paymentId);
        return metadataRepository.findByPaymentId(paymentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentMetadata> findByStatus(String status) {
        log.debug("Finding payment metadata by status: {}", status);
        return metadataRepository.findByStatus(status);
    }

    @Override
    @Transactional
    public PaymentMetadata updateStatus(String paymentId, String newStatus) {
        log.info("Updating payment status. PaymentId: {}, NewStatus: {}", paymentId, newStatus);
        
        PaymentMetadata metadata = metadataRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException("Payment metadata not found: " + paymentId));
        
        metadata.setStatus(newStatus);
        
        PaymentMetadata updated = metadataRepository.save(metadata);
        
        log.info("Payment status updated. PaymentId: {}, Status: {}", paymentId, newStatus);
        
        return updated;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByPaymentId(String paymentId) {
        return metadataRepository.existsByPaymentId(paymentId);
    }

    @Override
    @Transactional
    public int deleteOldRecords(LocalDateTime cutoffDate) {
        log.info("Deleting old payment metadata records before: {}", cutoffDate);
        
        int deletedCount = metadataRepository.deleteOldRecords(cutoffDate);
        
        log.info("Deleted {} old payment metadata records", deletedCount);
        
        return deletedCount;
    }
}
