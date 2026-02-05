package com.GPS.Global.Payment.Strategy.controller;

import com.GPS.Global.Payment.Strategy.model.dto.PaymentIngressRequestDTO;
import com.GPS.Global.Payment.Strategy.model.dto.PaymentIngressResponseDTO;
import com.GPS.Global.Payment.Strategy.service.PaymentIngressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

/**
 * REST Controller for Payment Ingress from External Channels
 * Acts as the entry point for channel adapters to submit payment instructions
 * into the Global Payment Platform (P3)
 * 
 * Flow:
 * 1. Receive payment request from external channel
 * 2. Validate channel-specific request format
 * 3. Transform to canonical LDM format
 * 4. Publish to Kafka ingress topic for downstream processing
 * 5. Return synchronous acknowledgment
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/ingress")
@RequiredArgsConstructor
@Validated
public class PaymentIngressController {

    private final PaymentIngressService paymentIngressService;

    /**
     * Receive payment instruction from external channel
     * 
     * @param request Payment ingress request with channel-specific data
     * @param channelId Source channel identifier (header)
     * @param correlationId Correlation ID for request tracking (header)
     * @return Payment acknowledgment with assigned paymentId and status
     */
    @PostMapping("/payments")
    public ResponseEntity<PaymentIngressResponseDTO> receivePayment(
            @Valid @RequestBody PaymentIngressRequestDTO request,
            @RequestHeader(value = "X-Channel-Id", required = true) String channelId,
            @RequestHeader(value = "X-Correlation-Id", required = false) String correlationId) {
        
        log.info("Received payment ingress request from channel: {}, correlation: {}", 
                channelId, correlationId);
        
        // Process payment through ingress service
        PaymentIngressResponseDTO response = paymentIngressService.processPaymentIngress(
                request, channelId, correlationId);
        
        log.info("Payment ingress processed successfully. PaymentId: {}, Status: {}", 
                response.getPaymentId(), response.getStatus());
        
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    /**
     * Health check endpoint for channel connectivity testing
     * 
     * @return Health status
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Payment Ingress Channel - ACTIVE");
    }
}
