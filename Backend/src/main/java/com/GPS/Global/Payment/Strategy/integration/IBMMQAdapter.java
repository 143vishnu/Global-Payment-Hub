package com.GPS.Global.Payment.Strategy.integration;

import com.GPS.Global.Payment.Strategy.model.entity.PaymentEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

/**
 * Adapter for IBM MQ integration
 * Handles message sending/receiving to/from IBM MQ
 */
@Slf4j
@Component
@RequiredArgsConstructor
@org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name = "ibm.mq.enabled", havingValue = "true")
public class IBMMQAdapter {

    private final JmsTemplate jmsTemplate;

    /**
     * Send payment message to IBM MQ queue
     * 
     * @param payment   Payment entity
     * @param queueName Target queue name
     */
    public void sendToQueue(PaymentEntity payment, String queueName) {
        log.info("Sending payment {} to IBM MQ queue: {}", payment.getPaymentId(), queueName);

        try {
            jmsTemplate.convertAndSend(queueName, payment, message -> {
                message.setStringProperty("PaymentId", payment.getPaymentId());
                message.setStringProperty("MessageType", "PAYMENT_REQUEST");
                return message;
            });

            log.info("Payment message sent successfully to queue: {}", queueName);
        } catch (Exception e) {
            log.error("Failed to send message to IBM MQ queue: {}", queueName, e);
            throw new RuntimeException("IBM MQ send failed", e);
        }
    }
}
