package com.GPS.Global.Payment.Strategy.service.impl;

import com.GPS.Global.Payment.Strategy.exception.PaymentProcessingException;
import com.GPS.Global.Payment.Strategy.mapper.PaymentLDMMapper;
import com.GPS.Global.Payment.Strategy.messaging.PaymentIngressPublisher;
import com.GPS.Global.Payment.Strategy.model.dto.PaymentIngressRequestDTO;
import com.GPS.Global.Payment.Strategy.model.dto.PaymentIngressResponseDTO;
import com.GPS.Global.Payment.Strategy.model.dto.PaymentRequestDTO;
import com.GPS.Global.Payment.Strategy.model.ldm.PaymentInstructionLDM;
import com.GPS.Global.Payment.Strategy.model.ldm.PaymentTypeLDM;
import com.GPS.Global.Payment.Strategy.service.PaymentIngressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Implementation of Payment Ingress Service
 * Handles conversion from channel format to LDM and publishes to Kafka
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentIngressServiceImpl implements PaymentIngressService {

    private final PaymentLDMMapper ldmMapper;
    private final PaymentIngressPublisher ingressPublisher;

    @Override
    public PaymentIngressResponseDTO processPaymentIngress(
            PaymentIngressRequestDTO request, 
            String channelId, 
            String correlationId) {
        
        log.info("Processing payment ingress from channel: {}", channelId);

        try {
            // Generate unique payment ID
            String paymentId = generatePaymentId();
            log.debug("Generated payment ID: {}", paymentId);

            // Convert channel request to internal DTO format
            PaymentRequestDTO internalRequest = convertToInternalRequest(request);

            // Transform to Logical Data Model (LDM)
            PaymentInstructionLDM paymentLDM = ldmMapper.dtoToLDM(internalRequest, paymentId);
            log.debug("Converted to LDM: {}", paymentLDM);

            // Validate LDM
            if (!paymentLDM.isValid()) {
                throw new PaymentProcessingException("Payment LDM validation failed for payment: " + paymentId);
            }

            // Publish to Kafka ingress topic
            ingressPublisher.publishPaymentToIngress(paymentLDM, channelId, correlationId);
            log.info("Payment published to ingress topic. PaymentId: {}", paymentId);

            // Calculate estimated processing time based on payment type
            int estimatedSeconds = calculateEstimatedProcessingTime(paymentLDM);

            // Build acknowledgment response
            return PaymentIngressResponseDTO.builder()
                    .paymentId(paymentId)
                    .status("ACCEPTED")
                    .statusMessage("Payment instruction accepted for processing")
                    .acceptedAt(LocalDateTime.now())
                    .correlationId(correlationId)
                    .channelReference(request.getChannelReference())
                    .estimatedProcessingSeconds(estimatedSeconds)
                    .build();

        } catch (Exception e) {
            log.error("Failed to process payment ingress from channel: {}", channelId, e);
            throw new PaymentProcessingException("Payment ingress processing failed", e);
        }
    }

    /**
     * Generate unique payment identifier
     * 
     * @return Payment ID
     */
    private String generatePaymentId() {
        return "PAY-" + UUID.randomUUID().toString().toUpperCase().replace("-", "");
    }

    /**
     * Convert channel-specific request to internal request format
     * 
     * @param channelRequest Channel request
     * @return Internal request DTO
     */
    private PaymentRequestDTO convertToInternalRequest(PaymentIngressRequestDTO channelRequest) {
        return PaymentRequestDTO.builder()
                .sourceAccount(channelRequest.getSourceAccount())
                .destinationAccount(channelRequest.getDestinationAccount())
                .amount(channelRequest.getAmount())
                .currency(channelRequest.getCurrency())
                .paymentType(channelRequest.getPaymentType())
                .description(channelRequest.getDescription())
                .originatorName(channelRequest.getOriginatorName())
                .beneficiaryName(channelRequest.getBeneficiaryName())
                .requestedExecutionDate(channelRequest.getRequestedExecutionDate())
                .referenceNumber(channelRequest.getReferenceNumber())
                .purposeCode(channelRequest.getPurposeCode())
                .build();
    }

    /**
     * Calculate estimated processing time based on payment attributes
     * 
     * @param ldm Payment LDM
     * @return Estimated seconds
     */
    private int calculateEstimatedProcessingTime(PaymentInstructionLDM ldm) {
        try {
            PaymentTypeLDM paymentType = PaymentTypeLDM.valueOf(ldm.getPaymentType());
            return paymentType.getTypicalSettlementHours() * 3600; // Convert hours to seconds
        } catch (IllegalArgumentException e) {
            log.warn("Unknown payment type: {}, using default estimate", ldm.getPaymentType());
            return 3600; // Default: 1 hour
        }
    }
}
