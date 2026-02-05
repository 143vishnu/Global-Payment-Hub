package com.GPS.Global.Payment.Strategy.service.impl;

import com.GPS.Global.Payment.Strategy.exception.DuplicateRequestException;
import com.GPS.Global.Payment.Strategy.exception.PaymentNotFoundException;
import com.GPS.Global.Payment.Strategy.mapper.PaymentMapper;
import com.GPS.Global.Payment.Strategy.messaging.PaymentEventPublisher;
import com.GPS.Global.Payment.Strategy.model.dto.PaymentRequestDTO;
import com.GPS.Global.Payment.Strategy.model.dto.PaymentResponseDTO;
import com.GPS.Global.Payment.Strategy.model.entity.PaymentEntity;
import com.GPS.Global.Payment.Strategy.repository.PaymentRepository;
import com.GPS.Global.Payment.Strategy.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of Payment Service
 * Handles core payment processing logic
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final PaymentEventPublisher eventPublisher;

    @Override
    @Transactional
    public PaymentResponseDTO processPayment(PaymentRequestDTO request, String idempotencyKey) {
        log.info("Processing payment for idempotency key: {}", idempotencyKey);

        // Check for duplicate request
        Optional<PaymentEntity> existingPayment = paymentRepository.findByIdempotencyKey(idempotencyKey);
        if (existingPayment.isPresent()) {
            log.warn("Duplicate payment request detected for idempotency key: {}", idempotencyKey);
            throw new DuplicateRequestException("Payment request already processed");
        }

        // Map DTO to Entity
        PaymentEntity payment = paymentMapper.toEntity(request);
        payment.setIdempotencyKey(idempotencyKey);

        // Persist payment
        PaymentEntity savedPayment = paymentRepository.save(payment);

        // Publish event to downstream systems
        eventPublisher.publishPaymentInitiatedEvent(savedPayment);

        log.info("Payment processed successfully with ID: {}", savedPayment.getPaymentId());

        return paymentMapper.toDTO(savedPayment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponseDTO getPaymentStatus(String paymentId) {
        log.info("Fetching payment status for ID: {}", paymentId);

        PaymentEntity payment = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found: " + paymentId));

        return paymentMapper.toDTO(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponseDTO> getAllPayments() {
        log.info("Fetching all payments");

        try {
            List<PaymentEntity> payments = paymentRepository.findAll();
            return payments.stream()
                    .map(paymentMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching all payments", e);
            // Return empty list if error
            return List.of();
        }
    }
}
