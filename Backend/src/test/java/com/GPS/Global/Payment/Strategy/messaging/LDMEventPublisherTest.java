package com.GPS.Global.Payment.Strategy.messaging;

import com.GPS.Global.Payment.Strategy.model.ldm.PaymentInstructionLDM;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.TopicPartition;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for LDMEventPublisher
 * Tests Kafka message publishing logic
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("LDM Event Publisher Tests")
class LDMEventPublisherTest {

    @Mock
    private KafkaTemplate<String, String> kafkaTemplate;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private LDMEventPublisher ldmEventPublisher;

    private PaymentInstructionLDM validLDM;

    @BeforeEach
    void setUp() {
        validLDM = buildValidLDM();
        // Set topic values via reflection or use @TestPropertySource
        setField(ldmEventPublisher, "paymentIngressTopic", "payment-ingress");
        setField(ldmEventPublisher, "paymentProcessingTopic", "payment-processing");
        setField(ldmEventPublisher, "paymentCompletedTopic", "payment-completed");
        setField(ldmEventPublisher, "paymentFailedTopic", "payment-failed");
    }

    @Test
    @DisplayName("Should successfully publish payment to ingress topic")
    void testPublishToIngress_Success() throws Exception {
        // Arrange
        String channelId = "WEB";
        String correlationId = "corr-123";
        String jsonPayload = "{\"paymentId\":\"PAY-123\"}";

        when(objectMapper.writeValueAsString(any())).thenReturn(jsonPayload);
        CompletableFuture<SendResult<String, String>> future = CompletableFuture.completedFuture(
                createSendResult("payment-ingress", 0, 100L));
        when(kafkaTemplate.send(any(ProducerRecord.class))).thenReturn(future);

        // Act
        ldmEventPublisher.publishToIngress(validLDM, channelId, correlationId);

        // Wait for async completion
        Thread.sleep(100);

        // Assert
        verify(objectMapper, times(1)).writeValueAsString(validLDM);
        verify(kafkaTemplate, times(1)).send(any(ProducerRecord.class));
    }

    @Test
    @DisplayName("Should throw exception when JSON serialization fails")
    void testPublishToIngress_SerializationFailure() throws Exception {
        // Arrange
        when(objectMapper.writeValueAsString(any()))
                .thenThrow(new com.fasterxml.jackson.core.JsonProcessingException("Serialization error") {});

        // Act & Assert
        assertThatThrownBy(() -> ldmEventPublisher.publishToIngress(validLDM, "WEB", "corr-123"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("LDM serialization failed");

        verify(kafkaTemplate, never()).send(any(ProducerRecord.class));
    }

    @Test
    @DisplayName("Should publish to processing topic with correct headers")
    void testPublishToProcessing_WithHeaders() throws Exception {
        // Arrange
        String jsonPayload = "{\"paymentId\":\"PAY-123\"}";
        ArgumentCaptor<ProducerRecord<String, String>> recordCaptor = 
                ArgumentCaptor.forClass(ProducerRecord.class);

        when(objectMapper.writeValueAsString(any())).thenReturn(jsonPayload);
        CompletableFuture<SendResult<String, String>> future = CompletableFuture.completedFuture(
                createSendResult("payment-processing", 0, 100L));
        when(kafkaTemplate.send(recordCaptor.capture())).thenReturn(future);

        // Act
        ldmEventPublisher.publishToProcessing(validLDM);

        // Wait for async completion
        Thread.sleep(100);

        // Assert
        ProducerRecord<String, String> capturedRecord = recordCaptor.getValue();
        assertThat(capturedRecord.topic()).isEqualTo("payment-processing");
        assertThat(capturedRecord.key()).isEqualTo(validLDM.getPaymentId());
        assertThat(capturedRecord.headers().lastHeader("X-Event-Type")).isNotNull();
    }

    @Test
    @DisplayName("Should publish completion event")
    void testPublishCompletion_Success() throws Exception {
        // Arrange
        validLDM.setStatus("COMPLETED");
        String jsonPayload = "{\"paymentId\":\"PAY-123\",\"status\":\"COMPLETED\"}";

        when(objectMapper.writeValueAsString(any())).thenReturn(jsonPayload);
        CompletableFuture<SendResult<String, String>> future = CompletableFuture.completedFuture(
                createSendResult("payment-completed", 0, 100L));
        when(kafkaTemplate.send(any(ProducerRecord.class))).thenReturn(future);

        // Act
        ldmEventPublisher.publishCompletion(validLDM);

        // Wait for async completion
        Thread.sleep(100);

        // Assert
        verify(kafkaTemplate, times(1)).send(any(ProducerRecord.class));
    }

    @Test
    @DisplayName("Should publish failure event with reason")
    void testPublishFailure_WithReason() throws Exception {
        // Arrange
        validLDM.setStatus("FAILED");
        String failureReason = "Insufficient funds";
        String jsonPayload = "{\"paymentId\":\"PAY-123\",\"status\":\"FAILED\"}";

        when(objectMapper.writeValueAsString(any())).thenReturn(jsonPayload);
        CompletableFuture<SendResult<String, String>> future = CompletableFuture.completedFuture(
                createSendResult("payment-failed", 0, 100L));
        when(kafkaTemplate.send(any(ProducerRecord.class))).thenReturn(future);

        // Act
        ldmEventPublisher.publishFailure(validLDM, failureReason);

        // Wait for async completion
        Thread.sleep(100);

        // Assert
        verify(kafkaTemplate, times(1)).send(any(ProducerRecord.class));
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
                .status("PENDING")
                .createdTimestamp(LocalDateTime.now())
                .build();
    }

    private SendResult<String, String> createSendResult(String topic, int partition, long offset) {
        ProducerRecord<String, String> producerRecord = 
                new ProducerRecord<>(topic, partition, "key", "value");
        RecordMetadata metadata = new RecordMetadata(
                new TopicPartition(topic, partition),
                offset,
                0L,
                System.currentTimeMillis(),
                0L,
                0,
                0);
        return new SendResult<>(producerRecord, metadata);
    }

    private void setField(Object target, String fieldName, Object value) {
        try {
            java.lang.reflect.Field field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (Exception e) {
            throw new RuntimeException("Failed to set field: " + fieldName, e);
        }
    }
}
