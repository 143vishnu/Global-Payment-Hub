package com.GPS.Global.Payment.Strategy.messaging;

import com.GPS.Global.Payment.Strategy.model.ldm.PaymentInstructionLDM;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.kafka.support.SendResult;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletableFuture;

/**
 * Publisher for Payment Ingress events to Kafka
 * Publishes payment instructions in LDM format to the ingress topic
 * for downstream processing by the Graphite core engine
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentIngressPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Value("${kafka.topics.payment-ingress:payment-ingress}")
    private String paymentIngressTopic;

    /**
     * Publish payment instruction to Kafka ingress topic
     * 
     * @param paymentLDM Payment instruction in LDM format
     * @param channelId Source channel identifier
     * @param correlationId Correlation ID for tracking
     */
    public void publishPaymentToIngress(
            PaymentInstructionLDM paymentLDM, 
            String channelId, 
            String correlationId) {
        
        String paymentId = paymentLDM.getPaymentId();
        log.info("Publishing payment to ingress topic. PaymentId: {}, Channel: {}", paymentId, channelId);

        try {
            // Serialize LDM to JSON
            String payload = objectMapper.writeValueAsString(paymentLDM);

            // Build message with headers
            Message<String> message = MessageBuilder
                    .withPayload(payload)
                    .setHeader(KafkaHeaders.TOPIC, paymentIngressTopic)
                    .setHeader(KafkaHeaders.KEY, paymentId.getBytes(StandardCharsets.UTF_8))
                    .setHeader("X-Channel-Id", channelId)
                    .setHeader("X-Correlation-Id", correlationId != null ? correlationId : paymentId)
                    .setHeader("X-Payment-Type", paymentLDM.getPaymentType())
                    .setHeader("X-Region", paymentLDM.getRegion())
                    .setHeader("X-Currency", paymentLDM.getCurrency())
                    .build();

            // Send to Kafka asynchronously
            CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send(message);

            // Handle callback
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Payment published successfully to ingress topic. PaymentId: {}, Topic: {}, Partition: {}, Offset: {}", 
                            paymentId, 
                            paymentIngressTopic,
                            result.getRecordMetadata().partition(), 
                            result.getRecordMetadata().offset());
                } else {
                    log.error("Failed to publish payment to ingress topic. PaymentId: {}, Topic: {}", 
                            paymentId, paymentIngressTopic, ex);
                    // In production: trigger retry mechanism or dead-letter queue
                }
            });

        } catch (JsonProcessingException e) {
            log.error("Failed to serialize payment LDM to JSON. PaymentId: {}", paymentId, e);
            throw new RuntimeException("Payment serialization failed", e);
        }
    }

    /**
     * Publish payment with synchronous confirmation (blocking)
     * Use only when immediate confirmation is required
     * 
     * @param paymentLDM Payment instruction in LDM format
     * @param channelId Source channel identifier
     * @param correlationId Correlation ID for tracking
     * @return Send result
     */
    public SendResult<String, String> publishPaymentToIngressSync(
            PaymentInstructionLDM paymentLDM, 
            String channelId, 
            String correlationId) {
        
        String paymentId = paymentLDM.getPaymentId();
        log.info("Publishing payment to ingress topic (sync). PaymentId: {}", paymentId);

        try {
            String payload = objectMapper.writeValueAsString(paymentLDM);

            Message<String> message = MessageBuilder
                    .withPayload(payload)
                    .setHeader(KafkaHeaders.TOPIC, paymentIngressTopic)
                    .setHeader(KafkaHeaders.KEY, paymentId.getBytes(StandardCharsets.UTF_8))
                    .setHeader("X-Channel-Id", channelId)
                    .setHeader("X-Correlation-Id", correlationId != null ? correlationId : paymentId)
                    .build();

            SendResult<String, String> result = kafkaTemplate.send(message).get();
            log.info("Payment published successfully (sync). PaymentId: {}, Offset: {}", 
                    paymentId, result.getRecordMetadata().offset());

            return result;

        } catch (Exception e) {
            log.error("Failed to publish payment to ingress topic (sync). PaymentId: {}", paymentId, e);
            throw new RuntimeException("Synchronous payment publish failed", e);
        }
    }
}
