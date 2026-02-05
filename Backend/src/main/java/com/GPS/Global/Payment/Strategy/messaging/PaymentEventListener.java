package com.GPS.Global.Payment.Strategy.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

/**
 * Listener for payment events from Kafka
 * Handles incoming payment-related messages from downstream systems
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "kafka.enabled", havingValue = "true", matchIfMissing = false)
public class PaymentEventListener {

    /**
     * Listen for payment response events from Graphite
     * 
     * @param payload Message payload
     * @param partition Kafka partition
     * @param offset Message offset
     */
    @KafkaListener(
            topics = "${kafka.topics.payment-response}",
            groupId = "${kafka.consumer.group-id}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void handlePaymentResponse(
            @Payload String payload,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset) {
        
        log.info("Received payment response from partition {} with offset {}", partition, offset);
        
        try {
            // Process payment response
            // Update payment status
            // Trigger downstream notifications
            
            log.info("Payment response processed successfully");
        } catch (Exception e) {
            log.error("Error processing payment response", e);
            // Handle error - send to DLQ or retry
        }
    }
}
