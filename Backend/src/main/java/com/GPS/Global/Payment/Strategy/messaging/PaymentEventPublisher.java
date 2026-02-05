package com.GPS.Global.Payment.Strategy.messaging;

import com.GPS.Global.Payment.Strategy.model.entity.PaymentEntity;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

/**
 * Publisher for payment events to Kafka
 * Handles asynchronous event publication with error handling
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentEventPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    private static final String PAYMENT_INITIATED_TOPIC = "payment.initiated";
    private static final String PAYMENT_STATUS_TOPIC = "payment.status";

    /**
     * Publish payment initiated event
     * 
     * @param payment Payment entity
     */
    public void publishPaymentInitiatedEvent(PaymentEntity payment) {
        String topic = PAYMENT_INITIATED_TOPIC;
        String key = payment.getPaymentId();
        
        try {
            String payload = objectMapper.writeValueAsString(payment);
            
            CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send(topic, key, payload);
            
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Payment event published successfully. Topic: {}, Partition: {}, Offset: {}", 
                            topic, result.getRecordMetadata().partition(), result.getRecordMetadata().offset());
                } else {
                    log.error("Failed to publish payment event to topic: {}", topic, ex);
                }
            });
            
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize payment event for payment ID: {}", payment.getPaymentId(), e);
            throw new RuntimeException("Event serialization failed", e);
        }
    }

    /**
     * Publish payment status update event
     * 
     * @param payment Payment entity
     */
    public void publishPaymentStatusEvent(PaymentEntity payment) {
        String topic = PAYMENT_STATUS_TOPIC;
        String key = payment.getPaymentId();
        
        try {
            String payload = objectMapper.writeValueAsString(payment);
            kafkaTemplate.send(topic, key, payload);
            log.info("Payment status event published for payment ID: {}", payment.getPaymentId());
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize payment status event", e);
        }
    }
}
