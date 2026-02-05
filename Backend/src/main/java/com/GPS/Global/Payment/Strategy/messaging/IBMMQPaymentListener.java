package com.GPS.Global.Payment.Strategy.messaging;

import com.GPS.Global.Payment.Strategy.exception.PaymentProcessingException;
import com.GPS.Global.Payment.Strategy.mapper.PaymentLDMMapper;
import com.GPS.Global.Payment.Strategy.model.ldm.PaymentInstructionLDM;
import com.GPS.Global.Payment.Strategy.service.PaymentProcessingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import jakarta.jms.JMSException;
import jakarta.jms.Message;
import jakarta.jms.TextMessage;

/**
 * JMS Listener for IBM MQ Payment Messages
 * 
 * Features:
 * - Transactional message processing (XA transactions)
 * - Automatic message conversion to LDM format
 * - Retry mechanism with exponential backoff
 * - Dead-letter queue handling for failed messages
 * - Message acknowledgment management
 * 
 * Message Flow:
 * 1. Receive message from IBM MQ queue
 * 2. Parse and validate message content
 * 3. Transform to LDM format
 * 4. Process payment instruction
 * 5. Acknowledge message on success / Send to DLQ on failure
 */
@Slf4j
@Component
@RequiredArgsConstructor
@org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name = "ibm.mq.enabled", havingValue = "true")
public class IBMMQPaymentListener {

    private final ObjectMapper objectMapper;
    private final PaymentLDMMapper ldmMapper;
    private final PaymentProcessingService paymentProcessingService;
    private final JmsTemplate jmsTemplate;

    private static final int MAX_RETRY_ATTEMPTS = 3;
    private static final String DLQ_QUEUE_NAME = "DEV.QUEUE.PAYMENT.DLQ";

    /**
     * Listen for payment messages from IBM MQ request queue
     * 
     * @param message       JMS message
     * @param messageId     JMS message ID
     * @param correlationId JMS correlation ID
     * @param deliveryCount Redelivery count
     */
    @JmsListener(destination = "${ibm.mq.queue.payment-request}", containerFactory = "jmsListenerContainerFactory", concurrency = "3-10")
    @Transactional
    public void receivePaymentMessage(
            Message message,
            @Header("JMSMessageID") String messageId,
            @Header(value = "JMSCorrelationID", required = false) String correlationId,
            @Header(value = "JMSXDeliveryCount", required = false) Integer deliveryCount) {

        log.info("Received payment message from IBM MQ. MessageId: {}, CorrelationId: {}, DeliveryCount: {}",
                messageId, correlationId, deliveryCount);

        try {
            // Check retry count
            int retryCount = deliveryCount != null ? deliveryCount : 1;
            if (retryCount > MAX_RETRY_ATTEMPTS) {
                log.error("Max retry attempts exceeded. Sending to DLQ. MessageId: {}, RetryCount: {}",
                        messageId, retryCount);
                sendToDeadLetterQueue(message, "Max retry attempts exceeded");
                return;
            }

            // Extract message content
            String messageContent = extractMessageContent(message);
            log.debug("Message content extracted. MessageId: {}, Content length: {}",
                    messageId, messageContent.length());

            // Parse to LDM
            PaymentInstructionLDM paymentLDM = parseToLDM(messageContent, messageId);
            log.info("Message converted to LDM. PaymentId: {}, MessageId: {}",
                    paymentLDM.getPaymentId(), messageId);

            // Validate LDM
            if (!paymentLDM.isValid()) {
                log.error("Invalid payment LDM received. PaymentId: {}, MessageId: {}",
                        paymentLDM.getPaymentId(), messageId);
                sendToDeadLetterQueue(message, "Invalid LDM format");
                return;
            }

            // Process payment
            paymentProcessingService.processPaymentFromMQ(paymentLDM, correlationId);

            log.info("Payment message processed successfully. PaymentId: {}, MessageId: {}",
                    paymentLDM.getPaymentId(), messageId);

        } catch (Exception e) {
            log.error("Error processing payment message. MessageId: {}, DeliveryCount: {}",
                    messageId, deliveryCount, e);

            // Handle retry logic
            handleProcessingError(message, messageId, deliveryCount, e);

            // Rethrow to trigger rollback and redelivery
            throw new PaymentProcessingException("Payment message processing failed", e);
        }
    }

    /**
     * Listen for payment response messages from Graphite
     * 
     * @param message   JMS message
     * @param messageId JMS message ID
     */
    @JmsListener(destination = "${ibm.mq.queue.payment-response}", containerFactory = "jmsListenerContainerFactory", concurrency = "2-5")
    @Transactional
    public void receivePaymentResponse(
            Message message,
            @Header("JMSMessageID") String messageId) {

        log.info("Received payment response from IBM MQ. MessageId: {}", messageId);

        try {
            String messageContent = extractMessageContent(message);

            // Parse response to LDM
            PaymentInstructionLDM paymentLDM = parseToLDM(messageContent, messageId);

            // Update payment status
            paymentProcessingService.updatePaymentStatus(paymentLDM);

            log.info("Payment response processed. PaymentId: {}, Status: {}",
                    paymentLDM.getPaymentId(), paymentLDM.getStatus());

        } catch (Exception e) {
            log.error("Error processing payment response. MessageId: {}", messageId, e);
            sendToDeadLetterQueue(message, "Response processing failed");
            throw new PaymentProcessingException("Payment response processing failed", e);
        }
    }

    /**
     * Extract text content from JMS message
     * 
     * @param message JMS message
     * @return Message content as string
     * @throws JMSException if extraction fails
     */
    private String extractMessageContent(Message message) throws JMSException {
        if (message instanceof TextMessage textMessage) {
            return textMessage.getText();
        } else {
            throw new IllegalArgumentException("Unsupported message type: " + message.getClass().getName());
        }
    }

    /**
     * Parse message content to PaymentInstructionLDM
     * 
     * @param messageContent Message content (JSON)
     * @param messageId      Message ID for logging
     * @return Payment instruction LDM
     */
    private PaymentInstructionLDM parseToLDM(String messageContent, String messageId) {
        try {
            return objectMapper.readValue(messageContent, PaymentInstructionLDM.class);
        } catch (Exception e) {
            log.error("Failed to parse message to LDM. MessageId: {}", messageId, e);
            throw new PaymentProcessingException("Message parsing failed", e);
        }
    }

    /**
     * Handle processing error with retry logic
     * 
     * @param message       Original message
     * @param messageId     Message ID
     * @param deliveryCount Current delivery count
     * @param exception     Exception that occurred
     */
    private void handleProcessingError(
            Message message,
            String messageId,
            Integer deliveryCount,
            Exception exception) {

        int retryCount = deliveryCount != null ? deliveryCount : 1;

        log.warn("Processing error occurred. MessageId: {}, RetryCount: {}/{}",
                messageId, retryCount, MAX_RETRY_ATTEMPTS);

        if (retryCount >= MAX_RETRY_ATTEMPTS) {
            log.error("Max retries reached. Sending to DLQ. MessageId: {}", messageId);
            sendToDeadLetterQueue(message, exception.getMessage());
        } else {
            log.info("Message will be redelivered. MessageId: {}, NextAttempt: {}",
                    messageId, retryCount + 1);
            // Transaction rollback will trigger automatic redelivery
        }
    }

    /**
     * Send failed message to dead-letter queue
     * 
     * @param message Original message
     * @param reason  Failure reason
     */
    private void sendToDeadLetterQueue(Message message, String reason) {
        try {
            log.warn("Sending message to DLQ. Queue: {}, Reason: {}", DLQ_QUEUE_NAME, reason);

            jmsTemplate.convertAndSend(DLQ_QUEUE_NAME, message, postProcessor -> {
                postProcessor.setStringProperty("DLQ_Reason", reason);
                postProcessor.setLongProperty("DLQ_Timestamp", System.currentTimeMillis());
                postProcessor.setStringProperty("Original_Queue",
                        message.getJMSDestination().toString());
                return postProcessor;
            });

            log.info("Message sent to DLQ successfully. Queue: {}", DLQ_QUEUE_NAME);

        } catch (Exception e) {
            log.error("Failed to send message to DLQ. Queue: {}", DLQ_QUEUE_NAME, e);
            // Last resort: log the message for manual recovery
            logMessageForManualRecovery(message, reason);
        }
    }

    /**
     * Log message details for manual recovery
     * 
     * @param message JMS message
     * @param reason  Failure reason
     */
    private void logMessageForManualRecovery(Message message, String reason) {
        try {
            String content = extractMessageContent(message);
            log.error("MESSAGE REQUIRES MANUAL RECOVERY - MessageId: {}, Reason: {}, Content: {}",
                    message.getJMSMessageID(), reason, content);
        } catch (Exception e) {
            log.error("Failed to log message for manual recovery", e);
        }
    }
}
