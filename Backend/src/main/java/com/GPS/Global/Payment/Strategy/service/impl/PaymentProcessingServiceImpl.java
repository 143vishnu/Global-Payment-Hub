package com.GPS.Global.Payment.Strategy.service.impl;

import com.GPS.Global.Payment.Strategy.exception.PaymentNotFoundException;
import com.GPS.Global.Payment.Strategy.exception.PaymentProcessingException;
import com.GPS.Global.Payment.Strategy.mapper.PaymentLDMMapper;
import com.GPS.Global.Payment.Strategy.messaging.LDMEventPublisher;
import com.GPS.Global.Payment.Strategy.model.entity.PaymentEntity;
import com.GPS.Global.Payment.Strategy.model.ldm.PaymentInstructionLDM;
import com.GPS.Global.Payment.Strategy.repository.PaymentRepository;
import com.GPS.Global.Payment.Strategy.service.PaymentProcessingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of Payment Processing Service
 * Handles payment instructions from IBM MQ and other channels
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentProcessingServiceImpl implements PaymentProcessingService {

    private final PaymentRepository paymentRepository;
    private final PaymentLDMMapper ldmMapper;
    private final LDMEventPublisher ldmEventPublisher;

    @Override
    @Transactional
    public void processPaymentFromMQ(PaymentInstructionLDM paymentLDM, String correlationId) {
        String paymentId = paymentLDM.getPaymentId();
        log.info("Processing payment from IBM MQ. PaymentId: {}, CorrelationId: {}", 
                paymentId, correlationId);

        try {
            // Convert LDM to entity
            PaymentEntity paymentEntity = ldmMapper.ldmToEntity(paymentLDM);

            // Check if payment already exists (idempotency)
            if (paymentRepository.findByPaymentId(paymentId).isPresent()) {
                log.warn("Payment already exists. Skipping duplicate. PaymentId: {}", paymentId);
                return;
            }

            // Save payment to database
            PaymentEntity savedPayment = paymentRepository.save(paymentEntity);
            log.debug("Payment saved to database. PaymentId: {}, Id: {}", paymentId, savedPayment.getId());

            // Update LDM status to PROCESSING
            paymentLDM.setStatus("PROCESSING");

            // Publish to processing topic for downstream systems
            ldmEventPublisher.publishToProcessing(paymentLDM);

            log.info("Payment from MQ processed successfully. PaymentId: {}", paymentId);

        } catch (Exception e) {
            log.error("Failed to process payment from MQ. PaymentId: {}", paymentId, e);
            throw new PaymentProcessingException("Payment processing failed", e);
        }
    }

    @Override
    @Transactional
    public void updatePaymentStatus(PaymentInstructionLDM paymentLDM) {
        String paymentId = paymentLDM.getPaymentId();
        log.info("Updating payment status. PaymentId: {}, NewStatus: {}", 
                paymentId, paymentLDM.getStatus());

        try {
            // Find existing payment
            PaymentEntity payment = paymentRepository.findByPaymentId(paymentId)
                    .orElseThrow(() -> new PaymentNotFoundException("Payment not found: " + paymentId));

            // Update status
            payment.setStatus(paymentLDM.getStatus());

            // Update additional fields if present
            if (paymentLDM.getStatus().equals("COMPLETED")) {
                payment.setExecutedAt(java.time.LocalDateTime.now());
            }

            // Save updated payment
            paymentRepository.save(payment);

            // Publish status update event based on final status
            if ("COMPLETED".equals(paymentLDM.getStatus())) {
                ldmEventPublisher.publishCompletion(paymentLDM);
            } else if ("FAILED".equals(paymentLDM.getStatus()) || "REJECTED".equals(paymentLDM.getStatus())) {
                ldmEventPublisher.publishFailure(paymentLDM, "Payment " + paymentLDM.getStatus().toLowerCase());
            }

            log.info("Payment status updated successfully. PaymentId: {}, Status: {}", 
                    paymentId, paymentLDM.getStatus());

        } catch (PaymentNotFoundException e) {
            log.error("Payment not found for status update. PaymentId: {}", paymentId, e);
            throw e;
        } catch (Exception e) {
            log.error("Failed to update payment status. PaymentId: {}", paymentId, e);
            throw new PaymentProcessingException("Payment status update failed", e);
        }
    }
}
