package com.GPS.Global.Payment.Strategy.controller;

import com.GPS.Global.Payment.Strategy.model.dto.PaymentIngressRequestDTO;
import com.GPS.Global.Payment.Strategy.model.dto.PaymentIngressResponseDTO;
import com.GPS.Global.Payment.Strategy.service.PaymentIngressService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for PaymentIngressController
 * Tests REST API endpoints for payment ingress
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Payment Ingress Controller Tests")
class PaymentIngressControllerTest {

    @Mock
    private PaymentIngressService paymentIngressService;

    @InjectMocks
    private PaymentIngressController paymentIngressController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(paymentIngressController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("Should accept valid payment request and return 202 ACCEPTED")
    void testReceivePayment_Success() throws Exception {
        // Arrange
        PaymentIngressRequestDTO request = buildValidRequest();
        PaymentIngressResponseDTO expectedResponse = buildSuccessResponse();

        when(paymentIngressService.processPaymentIngress(any(), anyString(), anyString()))
                .thenReturn(expectedResponse);

        // Act & Assert
        mockMvc.perform(post("/api/v1/ingress/payments")
                        .header("X-Channel-Id", "WEB")
                        .header("X-Correlation-Id", "test-correlation-123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.paymentId").value("PAY-12345"))
                .andExpect(jsonPath("$.status").value("ACCEPTED"))
                .andExpect(jsonPath("$.statusMessage").value("Payment instruction accepted for processing"));

        // Verify
        verify(paymentIngressService, times(1))
                .processPaymentIngress(any(), eq("WEB"), eq("test-correlation-123"));
    }

    @Test
    @DisplayName("Should return 400 BAD_REQUEST when required header is missing")
    void testReceivePayment_MissingChannelId() throws Exception {
        // Arrange
        PaymentIngressRequestDTO request = buildValidRequest();

        // Act & Assert
        mockMvc.perform(post("/api/v1/ingress/payments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        // Verify service was never called
        verify(paymentIngressService, never()).processPaymentIngress(any(), anyString(), anyString());
    }

    @Test
    @DisplayName("Should return 400 BAD_REQUEST when request validation fails")
    void testReceivePayment_InvalidRequest() throws Exception {
        // Arrange - Invalid request with missing required fields
        PaymentIngressRequestDTO invalidRequest = PaymentIngressRequestDTO.builder()
                .amount(new BigDecimal("-100")) // Invalid: negative amount
                .currency("INVALID") // Invalid: not 3 letters
                .build();

        // Act & Assert
        mockMvc.perform(post("/api/v1/ingress/payments")
                        .header("X-Channel-Id", "WEB")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        verify(paymentIngressService, never()).processPaymentIngress(any(), anyString(), anyString());
    }

    @Test
    @DisplayName("Should handle correlation ID when not provided")
    void testReceivePayment_WithoutCorrelationId() throws Exception {
        // Arrange
        PaymentIngressRequestDTO request = buildValidRequest();
        PaymentIngressResponseDTO expectedResponse = buildSuccessResponse();

        when(paymentIngressService.processPaymentIngress(any(), anyString(), isNull()))
                .thenReturn(expectedResponse);

        // Act & Assert
        mockMvc.perform(post("/api/v1/ingress/payments")
                        .header("X-Channel-Id", "API")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.paymentId").exists());

        verify(paymentIngressService, times(1))
                .processPaymentIngress(any(), eq("API"), isNull());
    }

    @Test
    @DisplayName("Should return 200 OK for health check")
    void testHealthCheck() throws Exception {
        mockMvc.perform(post("/api/v1/ingress/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("Payment Ingress Channel - ACTIVE"));
    }

    // Helper methods

    private PaymentIngressRequestDTO buildValidRequest() {
        return PaymentIngressRequestDTO.builder()
                .sourceAccount("GB29NWBK60161331926819")
                .destinationAccount("DE89370400440532013000")
                .amount(new BigDecimal("1000.50"))
                .currency("USD")
                .paymentType("SWIFT")
                .description("Test payment")
                .originatorName("John Doe")
                .beneficiaryName("Jane Smith")
                .referenceNumber("REF123456")
                .purposeCode("SALA")
                .build();
    }

    private PaymentIngressResponseDTO buildSuccessResponse() {
        return PaymentIngressResponseDTO.builder()
                .paymentId("PAY-12345")
                .status("ACCEPTED")
                .statusMessage("Payment instruction accepted for processing")
                .acceptedAt(LocalDateTime.now())
                .correlationId("test-correlation-123")
                .estimatedProcessingSeconds(3600)
                .build();
    }
}
