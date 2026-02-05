package com.GPS.Global.Payment.Strategy.service;

import com.GPS.Global.Payment.Strategy.model.dto.PaymentRequestDTO;
import com.GPS.Global.Payment.Strategy.model.dto.PaymentResponseDTO;

import java.util.List;

/**
 * Service interface for Payment processing operations
 */
public interface PaymentService {

    /**
     * Process a payment request with idempotency support
     * 
     * @param request Payment request details
     * @param idempotencyKey Unique idempotency key for request deduplication
     * @return Payment response with status and transaction details
     */
    PaymentResponseDTO processPayment(PaymentRequestDTO request, String idempotencyKey);

    /**
     * Retrieve payment status by payment ID
     * 
     * @param paymentId Unique payment identifier
     * @return Payment response with current status
     */
    PaymentResponseDTO getPaymentStatus(String paymentId);

    /**
     * Get all payments for dashboard and search
     * 
     * @return List of all payments
     */
    List<PaymentResponseDTO> getAllPayments();
}
