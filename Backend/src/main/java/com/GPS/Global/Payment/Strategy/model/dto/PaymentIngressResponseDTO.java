package com.GPS.Global.Payment.Strategy.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for Payment Ingress Response
 * Acknowledgment returned to external channel after payment submission
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentIngressResponseDTO {

    /**
     * Assigned payment identifier (P3 internal ID)
     */
    private String paymentId;

    /**
     * Current payment status
     */
    private String status;

    /**
     * Status description/message
     */
    private String statusMessage;

    /**
     * Timestamp when payment was accepted
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime acceptedAt;

    /**
     * Channel correlation ID for tracking
     */
    private String correlationId;

    /**
     * Channel-specific reference
     */
    private String channelReference;

    /**
     * Expected processing time in seconds (SLA estimate)
     */
    private Integer estimatedProcessingSeconds;
}
