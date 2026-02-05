package com.GPS.Global.Payment.Strategy.controller;

import com.GPS.Global.Payment.Strategy.model.dto.PaymentRequestDTO;
import com.GPS.Global.Payment.Strategy.model.dto.PaymentResponseDTO;
import com.GPS.Global.Payment.Strategy.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

/**
 * REST Controller for Payment operations
 * Acts as the entry point for external payment requests
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Validated
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponseDTO> initiatePayment(
            @Valid @RequestBody PaymentRequestDTO request,
            @RequestHeader("X-Idempotency-Key") @NotBlank String idempotencyKey) {
        
        log.info("Received payment request with idempotency key: {}", idempotencyKey);
        
        PaymentResponseDTO response = paymentService.processPayment(request, idempotencyKey);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponseDTO> getPaymentStatus(
            @PathVariable @NotBlank String paymentId) {
        
        log.info("Retrieving payment status for ID: {}", paymentId);
        
        PaymentResponseDTO response = paymentService.getPaymentStatus(paymentId);
        
        return ResponseEntity.ok(response);
    }
}
