package com.GPS.Global.Payment.Strategy.mapper;

import com.GPS.Global.Payment.Strategy.model.dto.PaymentRequestDTO;
import com.GPS.Global.Payment.Strategy.model.dto.PaymentResponseDTO;
import com.GPS.Global.Payment.Strategy.model.entity.PaymentEntity;
import com.GPS.Global.Payment.Strategy.model.ldm.PaymentInstructionLDM;
import com.GPS.Global.Payment.Strategy.model.ldm.PaymentRegionLDM;
import com.GPS.Global.Payment.Strategy.model.ldm.PaymentStatusLDM;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Mapper for converting between Payment models and LDM
 * Handles transformation between DTOs, Entities, and Logical Data Model
 */
@Slf4j
@Component
public class PaymentLDMMapper {

    /**
     * Convert PaymentEntity to PaymentInstructionLDM
     * 
     * @param entity Payment entity
     * @return Payment instruction LDM
     */
    public PaymentInstructionLDM entityToLDM(PaymentEntity entity) {
        if (entity == null) {
            return null;
        }

        return PaymentInstructionLDM.builder()
                .paymentId(entity.getPaymentId())
                .amount(entity.getAmount())
                .currency(entity.getCurrency())
                .debtorAccount(entity.getSourceAccount())
                .creditorAccount(entity.getDestinationAccount())
                .paymentType(entity.getPaymentType())
                .region(determineRegion(entity))
                .status(entity.getStatus())
                .createdTimestamp(entity.getCreatedAt())
                .build();
    }

    /**
     * Convert PaymentInstructionLDM to PaymentEntity
     * 
     * @param ldm Payment instruction LDM
     * @return Payment entity
     */
    public PaymentEntity ldmToEntity(PaymentInstructionLDM ldm) {
        if (ldm == null) {
            return null;
        }

        return PaymentEntity.builder()
                .paymentId(ldm.getPaymentId())
                .amount(ldm.getAmount())
                .currency(ldm.getCurrency())
                .sourceAccount(ldm.getDebtorAccount())
                .destinationAccount(ldm.getCreditorAccount())
                .paymentType(ldm.getPaymentType())
                .status(ldm.getStatus())
                .createdAt(ldm.getCreatedTimestamp())
                .build();
    }

    /**
     * Convert PaymentRequestDTO to PaymentInstructionLDM
     * 
     * @param dto Payment request DTO
     * @param paymentId Generated payment ID
     * @return Payment instruction LDM
     */
    public PaymentInstructionLDM dtoToLDM(PaymentRequestDTO dto, String paymentId) {
        if (dto == null) {
            return null;
        }

        return PaymentInstructionLDM.builder()
                .paymentId(paymentId)
                .amount(dto.getAmount())
                .currency(dto.getCurrency())
                .debtorAccount(dto.getSourceAccount())
                .creditorAccount(dto.getDestinationAccount())
                .paymentType(dto.getPaymentType())
                .region(determineRegionFromCurrency(dto.getCurrency()))
                .status(PaymentStatusLDM.PENDING.name())
                .createdTimestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Convert PaymentInstructionLDM to PaymentResponseDTO
     * 
     * @param ldm Payment instruction LDM
     * @return Payment response DTO
     */
    public PaymentResponseDTO ldmToResponseDTO(PaymentInstructionLDM ldm) {
        if (ldm == null) {
            return null;
        }

        return PaymentResponseDTO.builder()
                .paymentId(ldm.getPaymentId())
                .status(ldm.getStatus())
                .sourceAccount(ldm.getDebtorAccount())
                .destinationAccount(ldm.getCreditorAccount())
                .amount(ldm.getAmount())
                .currency(ldm.getCurrency())
                .paymentType(ldm.getPaymentType())
                .createdAt(ldm.getCreatedTimestamp())
                .build();
    }

    /**
     * Determine region from payment entity attributes
     * 
     * @param entity Payment entity
     * @return Region code
     */
    private String determineRegion(PaymentEntity entity) {
        // Logic to determine region based on currency, accounts, etc.
        String currency = entity.getCurrency();
        return determineRegionFromCurrency(currency);
    }

    /**
     * Determine region from currency code
     * 
     * @param currency Currency code
     * @return Region code
     */
    private String determineRegionFromCurrency(String currency) {
        return switch (currency.toUpperCase()) {
            case "USD", "CAD", "MXN" -> PaymentRegionLDM.NA.name();
            case "EUR", "GBP", "CHF", "SEK", "NOK", "DKK" -> PaymentRegionLDM.EU.name();
            case "JPY", "CNY", "HKD", "SGD", "AUD", "NZD", "KRW" -> PaymentRegionLDM.APAC.name();
            case "BRL", "ARS", "CLP", "COP", "PEN" -> PaymentRegionLDM.LATAM.name();
            case "AED", "SAR", "ZAR", "EGP" -> PaymentRegionLDM.MEA.name();
            default -> PaymentRegionLDM.GLOBAL.name();
        };
    }

    /**
     * Enrich LDM with additional metadata for Graphite processing
     * 
     * @param ldm Payment instruction LDM
     * @return Enriched LDM
     */
    public PaymentInstructionLDM enrichForGraphite(PaymentInstructionLDM ldm) {
        if (ldm == null) {
            return null;
        }

        // Add enrichment logic here
        // - Append routing information
        // - Add compliance flags
        // - Set priority based on amount/type
        
        log.debug("Enriching payment LDM for Graphite: {}", ldm.getPaymentId());
        
        return ldm;
    }
}
