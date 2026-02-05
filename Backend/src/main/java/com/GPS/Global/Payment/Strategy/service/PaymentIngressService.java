package com.GPS.Global.Payment.Strategy.service;

import com.GPS.Global.Payment.Strategy.model.dto.PaymentIngressRequestDTO;
import com.GPS.Global.Payment.Strategy.model.dto.PaymentIngressResponseDTO;

/**
 * Service interface for Payment Ingress operations
 * Handles payment submissions from external channels
 */
public interface PaymentIngressService {

    /**
     * Process payment ingress from external channel
     * 
     * @param request Payment ingress request
     * @param channelId Source channel identifier
     * @param correlationId Correlation ID for tracking
     * @return Payment ingress response with acknowledgment
     */
    PaymentIngressResponseDTO processPaymentIngress(
            PaymentIngressRequestDTO request, 
            String channelId, 
            String correlationId);
}
