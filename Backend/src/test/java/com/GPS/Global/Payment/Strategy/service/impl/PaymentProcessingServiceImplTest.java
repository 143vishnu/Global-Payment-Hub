package com.GPS.Global.Payment.Strategy.service.impl;

import com.GPS.Global.Payment.Strategy.exception.PaymentNotFoundException;
import com.GPS.Global.Payment.Strategy.exception.PaymentProcessingException;
import com.GPS.Global.Payment.Strategy.mapper.PaymentLDMMapper;
import com.GPS.Global.Payment.Strategy.messaging.LDMEventPublisher;
import com.GPS.Global.Payment.Strategy.model.entity.PaymentEntity;
import com.GPS.Global.Payment.Strategy.model.ldm.PaymentInstructionLDM;
import com.GPS.Global.Payment.Strategy.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for PaymentProcessingServiceImpl
 * Tests payment processing from IBM MQ and status updates
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Payment Processing Service Tests")
class PaymentProcessingServiceImplTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private PaymentLDMMapper ldmMapper;

    @Mock
    private LDMEventPublisher ldmEventPublisher;

    @InjectMocks
    private PaymentProcessingServiceImpl paymentProcessingService;

    private PaymentInstructionLDM validLDM;
    private PaymentEntity paymentEntity;

    @BeforeEach
    void setUp() {
        validLDM = buildValidLDM();
        paymentEntity = buildPaymentEntity();
    }

    @Test
    @DisplayName("Should successfully process payment from MQ")
    void testProcessPaymentFromMQ_Success() {
        // Arrange
        String correlationId = "corr-123";
        when(ldmMapper.ldmToEntity(any(PaymentInstructionLDM.class))).thenReturn(paymentEntity);
        when(paymentRepository.findByPaymentId(anyString())).thenReturn(Optional.empty());
        when(paymentRepository.save(any(PaymentEntity.class))).thenReturn(paymentEntity);
        doNothing().when(ldmEventPublisher).publishToProcessing(any(PaymentInstructionLDM.class));

        // Act
        paymentProcessingService.processPaymentFromMQ(validLDM, correlationId);

        // Assert
        verify(ldmMapper, times(1)).ldmToEntity(validLDM);
        verify(paymentRepository, times(1)).findByPaymentId(validLDM.getPaymentId());
        verify(paymentRepository, times(1)).save(any(PaymentEntity.class));
        verify(ldmEventPublisher, times(1)).publishToProcessing(validLDM);
    }

    @Test
    @DisplayName("Should skip duplicate payment (idempotency check)")
    void testProcessPaymentFromMQ_DuplicatePayment() {
        // Arrange
        when(ldmMapper.ldmToEntity(any(PaymentInstructionLDM.class))).thenReturn(paymentEntity);
        when(paymentRepository.findByPaymentId(validLDM.getPaymentId()))
                .thenReturn(Optional.of(paymentEntity));

        // Act
        paymentProcessingService.processPaymentFromMQ(validLDM, "corr-123");

        // Assert - Should not save or publish
        verify(paymentRepository, times(1)).findByPaymentId(validLDM.getPaymentId());
        verify(paymentRepository, never()).save(any(PaymentEntity.class));
        verify(ldmEventPublisher, never()).publishToProcessing(any(PaymentInstructionLDM.class));
    }

    @Test
    @DisplayName("Should throw exception when repository save fails")
    void testProcessPaymentFromMQ_RepositoryFailure() {
        // Arrange
        when(ldmMapper.ldmToEntity(any(PaymentInstructionLDM.class))).thenReturn(paymentEntity);
        when(paymentRepository.findByPaymentId(anyString())).thenReturn(Optional.empty());
        when(paymentRepository.save(any(PaymentEntity.class)))
                .thenThrow(new RuntimeException("Database error"));

        // Act & Assert
        assertThatThrownBy(() -> paymentProcessingService.processPaymentFromMQ(validLDM, "corr-123"))
                .isInstanceOf(PaymentProcessingException.class)
                .hasMessageContaining("Payment processing failed");

        verify(ldmEventPublisher, never()).publishToProcessing(any());
    }

    @Test
    @DisplayName("Should successfully update payment status to COMPLETED")
    void testUpdatePaymentStatus_ToCompleted() {
        // Arrange
        validLDM.setStatus("COMPLETED");
        when(paymentRepository.findByPaymentId(validLDM.getPaymentId()))
                .thenReturn(Optional.of(paymentEntity));
        when(paymentRepository.save(any(PaymentEntity.class))).thenReturn(paymentEntity);
        doNothing().when(ldmEventPublisher).publishCompletion(any(PaymentInstructionLDM.class));

        // Act
        paymentProcessingService.updatePaymentStatus(validLDM);

        // Assert
        verify(paymentRepository, times(1)).findByPaymentId(validLDM.getPaymentId());
        verify(paymentRepository, times(1)).save(any(PaymentEntity.class));
        verify(ldmEventPublisher, times(1)).publishCompletion(validLDM);
        verify(ldmEventPublisher, never()).publishFailure(any(), anyString());
    }

    @Test
    @DisplayName("Should successfully update payment status to FAILED")
    void testUpdatePaymentStatus_ToFailed() {
        // Arrange
        validLDM.setStatus("FAILED");
        when(paymentRepository.findByPaymentId(validLDM.getPaymentId()))
                .thenReturn(Optional.of(paymentEntity));
        when(paymentRepository.save(any(PaymentEntity.class))).thenReturn(paymentEntity);
        doNothing().when(ldmEventPublisher).publishFailure(any(PaymentInstructionLDM.class), anyString());

        // Act
        paymentProcessingService.updatePaymentStatus(validLDM);

        // Assert
        verify(paymentRepository, times(1)).save(any(PaymentEntity.class));
        verify(ldmEventPublisher, times(1)).publishFailure(validLDM, "Payment failed");
        verify(ldmEventPublisher, never()).publishCompletion(any());
    }

    @Test
    @DisplayName("Should throw exception when payment not found for status update")
    void testUpdatePaymentStatus_PaymentNotFound() {
        // Arrange
        when(paymentRepository.findByPaymentId(validLDM.getPaymentId()))
                .thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> paymentProcessingService.updatePaymentStatus(validLDM))
                .isInstanceOf(PaymentNotFoundException.class)
                .hasMessageContaining("Payment not found");

        verify(paymentRepository, never()).save(any(PaymentEntity.class));
        verify(ldmEventPublisher, never()).publishCompletion(any());
        verify(ldmEventPublisher, never()).publishFailure(any(), anyString());
    }

    @Test
    @DisplayName("Should set executedAt timestamp for completed payments")
    void testUpdatePaymentStatus_SetExecutedAtForCompleted() {
        // Arrange
        validLDM.setStatus("COMPLETED");
        PaymentEntity entity = buildPaymentEntity();
        entity.setExecutedAt(null); // Initially null

        when(paymentRepository.findByPaymentId(validLDM.getPaymentId()))
                .thenReturn(Optional.of(entity));
        when(paymentRepository.save(any(PaymentEntity.class))).thenReturn(entity);
        doNothing().when(ldmEventPublisher).publishCompletion(any());

        // Act
        paymentProcessingService.updatePaymentStatus(validLDM);

        // Assert
        verify(paymentRepository).save(argThat(payment -> 
                payment.getExecutedAt() != null && "COMPLETED".equals(payment.getStatus())
        ));
    }

    @Test
    @DisplayName("Should handle REJECTED status")
    void testUpdatePaymentStatus_ToRejected() {
        // Arrange
        validLDM.setStatus("REJECTED");
        when(paymentRepository.findByPaymentId(validLDM.getPaymentId()))
                .thenReturn(Optional.of(paymentEntity));
        when(paymentRepository.save(any(PaymentEntity.class))).thenReturn(paymentEntity);
        doNothing().when(ldmEventPublisher).publishFailure(any(), anyString());

        // Act
        paymentProcessingService.updatePaymentStatus(validLDM);

        // Assert
        verify(ldmEventPublisher, times(1)).publishFailure(validLDM, "Payment rejected");
    }

    // Helper methods

    private PaymentInstructionLDM buildValidLDM() {
        return PaymentInstructionLDM.builder()
                .paymentId("PAY-TEST-123")
                .amount(new BigDecimal("1000.50"))
                .currency("USD")
                .debtorAccount("GB29NWBK60161331926819")
                .creditorAccount("DE89370400440532013000")
                .paymentType("SWIFT")
                .region("EU")
                .status("PROCESSING")
                .createdTimestamp(LocalDateTime.now())
                .build();
    }

    private PaymentEntity buildPaymentEntity() {
        return PaymentEntity.builder()
                .id(1L)
                .paymentId("PAY-TEST-123")
                .sourceAccount("GB29NWBK60161331926819")
                .destinationAccount("DE89370400440532013000")
                .amount(new BigDecimal("1000.50"))
                .currency("USD")
                .paymentType("SWIFT")
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();
    }
}
