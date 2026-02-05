package com.GPS.Global.Payment.Strategy.service;

import com.GPS.Global.Payment.Strategy.model.ldm.PaymentInstructionLDM;

/**
 * Service interface for Payment Processing operations
 * Handles payment instructions from various channels
 */
public interface PaymentProcessingService {

    /**
     * Process payment instruction received from IBM MQ
     * 
     * @param paymentLDM Payment instruction in LDM format
     * @param correlationId Correlation ID for tracking
     */
    void processPaymentFromMQ(PaymentInstructionLDM paymentLDM, String correlationId);

    /**
     * Update payment status based on response
     * 
     * @param paymentLDM Payment instruction with updated status
     */
    void updatePaymentStatus(PaymentInstructionLDM paymentLDM);
}
