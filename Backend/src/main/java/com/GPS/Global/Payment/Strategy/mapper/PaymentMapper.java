package com.GPS.Global.Payment.Strategy.mapper;

import com.GPS.Global.Payment.Strategy.model.dto.PaymentRequestDTO;
import com.GPS.Global.Payment.Strategy.model.dto.PaymentResponseDTO;
import com.GPS.Global.Payment.Strategy.model.entity.PaymentEntity;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Mapper for converting between Payment DTOs and Entities
 */
@Component
public class PaymentMapper {

    /**
     * Convert PaymentRequestDTO to PaymentEntity
     * 
     * @param dto Payment request DTO
     * @return Payment entity
     */
    public PaymentEntity toEntity(PaymentRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        return PaymentEntity.builder()
                .paymentId(UUID.randomUUID().toString())
                .sourceAccount(dto.getSourceAccount())
                .destinationAccount(dto.getDestinationAccount())
                .amount(dto.getAmount())
                .currency(dto.getCurrency())
                .paymentType(dto.getPaymentType())
                .description(dto.getDescription())
                .originatorName(dto.getOriginatorName())
                .beneficiaryName(dto.getBeneficiaryName())
                .requestedExecutionDate(dto.getRequestedExecutionDate())
                .referenceNumber(dto.getReferenceNumber())
                .purposeCode(dto.getPurposeCode())
                .status("PENDING")
                .build();
    }

    /**
     * Convert PaymentEntity to PaymentResponseDTO
     * 
     * @param entity Payment entity
     * @return Payment response DTO
     */
    public PaymentResponseDTO toDTO(PaymentEntity entity) {
        if (entity == null) {
            return null;
        }

        return PaymentResponseDTO.builder()
                .paymentId(entity.getPaymentId())
                .status(entity.getStatus())
                .sourceAccount(entity.getSourceAccount())
                .destinationAccount(entity.getDestinationAccount())
                .amount(entity.getAmount())
                .currency(entity.getCurrency())
                .paymentType(entity.getPaymentType())
                .transactionReference(entity.getTransactionReference())
                .statusReason(entity.getStatusReason())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .executedAt(entity.getExecutedAt())
                .build();
    }
}
