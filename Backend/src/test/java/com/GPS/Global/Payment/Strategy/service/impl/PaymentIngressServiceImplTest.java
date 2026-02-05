package com.GPS.Global.Payment.Strategy.service.impl;

import com.GPS.Global.Payment.Strategy.exception.PaymentProcessingException;
import com.GPS.Global.Payment.Strategy.mapper.PaymentLDMMapper;
import com.GPS.Global.Payment.Strategy.messaging.PaymentIngressPublisher;
import com.GPS.Global.Payment.Strategy.model.dto.PaymentIngressRequestDTO;
import com.GPS.Global.Payment.Strategy.model.dto.PaymentIngressResponseDTO;
import com.GPS.Global.Payment.Strategy.model.dto.PaymentRequestDTO;
import com.GPS.Global.Payment.Strategy.model.ldm.PaymentInstructionLDM;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for PaymentIngressServiceImpl
 * Tests payment ingress processing logic
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Payment Ingress Service Tests")
class PaymentIngressServiceImplTest {

    @Mock
    private PaymentLDMMapper ldmMapper;

    @Mock
    private PaymentIngressPublisher ingressPublisher;

    @InjectMocks
    private PaymentIngressServiceImpl paymentIngressService;

    private PaymentIngressRequestDTO validRequest;
    private PaymentRequestDTO internalRequest;
    private PaymentInstructionLDM validLDM;

    @BeforeEach
    void setUp() {
        validRequest = buildValidIngressRequest();
        internalRequest = buildInternalRequest();
        validLDM = buildValidLDM();
    }

    @Test
    @DisplayName("Should successfully process payment ingress and publish to Kafka")
    void testProcessPaymentIngress_Success() {
        // Arrange
        String channelId = "WEB";
        String correlationId = "corr-123";

        when(ldmMapper.dtoToLDM(any(PaymentRequestDTO.class), anyString()))
                .thenReturn(validLDM);
        doNothing().when(ingressPublisher).publishPaymentToIngress(any(), anyString(), anyString());

        // Act
        PaymentIngressResponseDTO response = paymentIngressService.processPaymentIngress(
                validRequest, channelId, correlationId);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getPaymentId()).isNotNull();
        assertThat(response.getPaymentId()).startsWith("PAY-");
        assertThat(response.getStatus()).isEqualTo("ACCEPTED");
        assertThat(response.getStatusMessage()).contains("accepted for processing");
        assertThat(response.getCorrelationId()).isEqualTo(correlationId);
        assertThat(response.getEstimatedProcessingSeconds()).isGreaterThan(0);

        // Verify interactions
        verify(ldmMapper, times(1)).dtoToLDM(any(PaymentRequestDTO.class), anyString());
        verify(ingressPublisher, times(1))
                .publishPaymentToIngress(eq(validLDM), eq(channelId), eq(correlationId));
    }

    @Test
    @DisplayName("Should generate unique payment ID for each request")
    void testProcessPaymentIngress_UniquePaymentId() {
        // Arrange
        when(ldmMapper.dtoToLDM(any(PaymentRequestDTO.class), anyString()))
                .thenReturn(validLDM);
        doNothing().when(ingressPublisher).publishPaymentToIngress(any(), anyString(), anyString());

        // Act
        PaymentIngressResponseDTO response1 = paymentIngressService.processPaymentIngress(
                validRequest, "WEB", "corr-1");
        PaymentIngressResponseDTO response2 = paymentIngressService.processPaymentIngress(
                validRequest, "WEB", "corr-2");

        // Assert
        assertThat(response1.getPaymentId()).isNotEqualTo(response2.getPaymentId());
    }

    @Test
    @DisplayName("Should throw exception when LDM validation fails")
    void testProcessPaymentIngress_InvalidLDM() {
        // Arrange
        PaymentInstructionLDM invalidLDM = buildInvalidLDM();
        when(ldmMapper.dtoToLDM(any(PaymentRequestDTO.class), anyString()))
                .thenReturn(invalidLDM);

        // Act & Assert
        assertThatThrownBy(() -> paymentIngressService.processPaymentIngress(
                validRequest, "WEB", "corr-123"))
                .isInstanceOf(PaymentProcessingException.class)
                .hasMessageContaining("LDM validation failed");

        // Verify publisher was never called
        verify(ingressPublisher, never()).publishPaymentToIngress(any(), anyString(), anyString());
    }

    @Test
    @DisplayName("Should handle null correlation ID")
    void testProcessPaymentIngress_NullCorrelationId() {
        // Arrange
        when(ldmMapper.dtoToLDM(any(PaymentRequestDTO.class), anyString()))
                .thenReturn(validLDM);
        doNothing().when(ingressPublisher).publishPaymentToIngress(any(), anyString(), anyString());

        // Act
        PaymentIngressResponseDTO response = paymentIngressService.processPaymentIngress(
                validRequest, "API", null);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getCorrelationId()).isNull();

        // Verify publisher called with null correlation ID
        verify(ingressPublisher, times(1))
                .publishPaymentToIngress(any(), eq("API"), isNull());
    }

    @Test
    @DisplayName("Should calculate estimated processing time based on payment type")
    void testProcessPaymentIngress_EstimatedProcessingTime() {
        // Arrange
        PaymentInstructionLDM swiftLDM = buildValidLDM();
        swiftLDM.setPaymentType("SWIFT");

        when(ldmMapper.dtoToLDM(any(PaymentRequestDTO.class), anyString()))
                .thenReturn(swiftLDM);
        doNothing().when(ingressPublisher).publishPaymentToIngress(any(), anyString(), anyString());

        // Act
        PaymentIngressResponseDTO response = paymentIngressService.processPaymentIngress(
                validRequest, "WEB", "corr-123");

        // Assert
        assertThat(response.getEstimatedProcessingSeconds()).isEqualTo(172800); // 48 hours for SWIFT
    }

    @Test
    @DisplayName("Should throw exception when publisher fails")
    void testProcessPaymentIngress_PublisherFailure() {
        // Arrange
        when(ldmMapper.dtoToLDM(any(PaymentRequestDTO.class), anyString()))
                .thenReturn(validLDM);
        doThrow(new RuntimeException("Kafka unavailable"))
                .when(ingressPublisher).publishPaymentToIngress(any(), anyString(), anyString());

        // Act & Assert
        assertThatThrownBy(() -> paymentIngressService.processPaymentIngress(
                validRequest, "WEB", "corr-123"))
                .isInstanceOf(PaymentProcessingException.class)
                .hasMessageContaining("Payment ingress processing failed")
                .hasCauseInstanceOf(RuntimeException.class);
    }

    @Test
    @DisplayName("Should capture and verify published LDM details")
    void testProcessPaymentIngress_VerifyPublishedLDM() {
        // Arrange
        ArgumentCaptor<PaymentInstructionLDM> ldmCaptor = ArgumentCaptor.forClass(PaymentInstructionLDM.class);
        when(ldmMapper.dtoToLDM(any(PaymentRequestDTO.class), anyString()))
                .thenReturn(validLDM);
        doNothing().when(ingressPublisher).publishPaymentToIngress(ldmCaptor.capture(), anyString(), anyString());

        // Act
        paymentIngressService.processPaymentIngress(validRequest, "MOBILE", "corr-456");

        // Assert
        PaymentInstructionLDM capturedLDM = ldmCaptor.getValue();
        assertThat(capturedLDM).isNotNull();
        assertThat(capturedLDM.getAmount()).isEqualByComparingTo(new BigDecimal("1000.50"));
        assertThat(capturedLDM.getCurrency()).isEqualTo("USD");
        assertThat(capturedLDM.getPaymentType()).isEqualTo("SWIFT");
    }

    // Helper methods

    private PaymentIngressRequestDTO buildValidIngressRequest() {
        return PaymentIngressRequestDTO.builder()
                .sourceAccount("GB29NWBK60161331926819")
                .destinationAccount("DE89370400440532013000")
                .amount(new BigDecimal("1000.50"))
                .currency("USD")
                .paymentType("SWIFT")
                .description("Test payment")
                .originatorName("John Doe")
                .beneficiaryName("Jane Smith")
                .build();
    }

    private PaymentRequestDTO buildInternalRequest() {
        return PaymentRequestDTO.builder()
                .sourceAccount("GB29NWBK60161331926819")
                .destinationAccount("DE89370400440532013000")
                .amount(new BigDecimal("1000.50"))
                .currency("USD")
                .paymentType("SWIFT")
                .build();
    }

    private PaymentInstructionLDM buildValidLDM() {
        return PaymentInstructionLDM.builder()
                .paymentId("PAY-TEST-123")
                .amount(new BigDecimal("1000.50"))
                .currency("USD")
                .debtorAccount("GB29NWBK60161331926819")
                .creditorAccount("DE89370400440532013000")
                .paymentType("SWIFT")
                .region("EU")
                .status("PENDING")
                .createdTimestamp(java.time.LocalDateTime.now())
                .build();
    }

    private PaymentInstructionLDM buildInvalidLDM() {
        return PaymentInstructionLDM.builder()
                .paymentId("PAY-INVALID")
                // Missing required fields - will fail isValid()
                .build();
    }
}
