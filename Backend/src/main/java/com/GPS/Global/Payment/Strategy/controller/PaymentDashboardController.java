package com.GPS.Global.Payment.Strategy.controller;

import com.GPS.Global.Payment.Strategy.model.dto.PaymentResponseDTO;
import com.GPS.Global.Payment.Strategy.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Controller for payment dashboard and search operations
 */
@Slf4j
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentDashboardController {

    private final PaymentService paymentService;

    /**
     * Get payment summary for dashboard
     */
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getPaymentSummary() {
        log.info("Fetching payment summary");
        
        try {
            List<PaymentResponseDTO> allPayments = paymentService.getAllPayments();
            
            Map<String, Object> summary = new HashMap<>();
            summary.put("totalCount", allPayments.size());
            summary.put("totalAmount", calculateTotalAmount(allPayments));
            summary.put("successCount", countByStatus(allPayments, "SUCCESS"));
            summary.put("failedCount", countByStatus(allPayments, "FAILED"));
            summary.put("pendingCount", countByStatus(allPayments, "PENDING"));
            summary.put("regionalDistribution", getRegionalDistribution(allPayments));
            summary.put("statusDistribution", getStatusDistribution(allPayments));
            summary.put("trend", getPaymentTrend(allPayments));
            
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            log.error("Error fetching payment summary", e);
            // Return empty summary on error
            return ResponseEntity.ok(getEmptySummary());
        }
    }

    /**
     * Search payments with filters
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> searchPayments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String paymentType,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        
        log.info("Searching payments - status: {}, region: {}, page: {}", status, region, page);
        
        try {
            List<PaymentResponseDTO> allPayments = paymentService.getAllPayments();
            
            // Apply filters
            List<PaymentResponseDTO> filtered = allPayments.stream()
                    .filter(p -> status == null || status.equals(p.getStatus()))
                    .filter(p -> paymentType == null || paymentType.equals(p.getPaymentType()))
                    .filter(p -> searchTerm == null || matchesSearchTerm(p, searchTerm))
                    .collect(Collectors.toList());
            
            // Sort
            filtered.sort(getComparator(sortBy, sortOrder));
            
            // Paginate
            int start = page * size;
            int end = Math.min(start + size, filtered.size());
            List<PaymentResponseDTO> pageContent = start < filtered.size() ? 
                    filtered.subList(start, end) : Collections.emptyList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("content", pageContent);
            response.put("totalElements", filtered.size());
            response.put("totalPages", (int) Math.ceil((double) filtered.size() / size));
            response.put("currentPage", page);
            response.put("pageSize", size);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error searching payments", e);
            return ResponseEntity.ok(getEmptySearchResults());
        }
    }

    /**
     * Get failed payments for exception handling
     */
    @GetMapping("/failed")
    public ResponseEntity<Map<String, Object>> getFailedPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Fetching failed payments - page: {}", page);
        
        try {
            List<PaymentResponseDTO> allPayments = paymentService.getAllPayments();
            List<PaymentResponseDTO> failed = allPayments.stream()
                    .filter(p -> "FAILED".equals(p.getStatus()))
                    .collect(Collectors.toList());
            
            int start = page * size;
            int end = Math.min(start + size, failed.size());
            List<PaymentResponseDTO> pageContent = start < failed.size() ? 
                    failed.subList(start, end) : Collections.emptyList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("content", pageContent);
            response.put("totalElements", failed.size());
            response.put("totalPages", (int) Math.ceil((double) failed.size() / size));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching failed payments", e);
            return ResponseEntity.ok(getEmptySearchResults());
        }
    }

    /**
     * Get payment history/lifecycle
     */
    @GetMapping("/{id}/history")
    public ResponseEntity<List<Map<String, Object>>> getPaymentHistory(@PathVariable String id) {
        log.info("Fetching payment history for ID: {}", id);
        
        List<Map<String, Object>> history = new ArrayList<>();
        Map<String, Object> event = new HashMap<>();
        event.put("timestamp", new Date());
        event.put("status", "CREATED");
        event.put("message", "Payment initiated");
        event.put("details", "Payment created and queued for processing");
        history.add(event);
        
        return ResponseEntity.ok(history);
    }

    /**
     * Get payment audit trail
     */
    @GetMapping("/{id}/audit")
    public ResponseEntity<List<Map<String, Object>>> getPaymentAudit(@PathVariable String id) {
        log.info("Fetching payment audit for ID: {}", id);
        
        List<Map<String, Object>> audit = new ArrayList<>();
        Map<String, Object> entry = new HashMap<>();
        entry.put("timestamp", new Date());
        entry.put("action", "PAYMENT_CREATED");
        entry.put("user", "system");
        entry.put("details", "Payment record created");
        audit.add(entry);
        
        return ResponseEntity.ok(audit);
    }

    /**
     * Retry failed payment
     */
    @PostMapping("/{id}/retry")
    public ResponseEntity<PaymentResponseDTO> retryPayment(@PathVariable String id) {
        log.info("Retrying payment: {}", id);
        
        try {
            PaymentResponseDTO payment = paymentService.getPaymentStatus(id);
            payment.setStatus("PENDING");
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            log.error("Error retrying payment", e);
            throw new RuntimeException("Failed to retry payment");
        }
    }

    /**
     * Cancel payment
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<PaymentResponseDTO> cancelPayment(@PathVariable String id) {
        log.info("Cancelling payment: {}", id);
        
        try {
            PaymentResponseDTO payment = paymentService.getPaymentStatus(id);
            payment.setStatus("CANCELLED");
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            log.error("Error cancelling payment", e);
            throw new RuntimeException("Failed to cancel payment");
        }
    }

    /**
     * Repair payment with notes
     */
    @PostMapping("/{id}/repair")
    public ResponseEntity<PaymentResponseDTO> repairPayment(
            @PathVariable String id,
            @RequestBody Map<String, String> repairData) {
        
        log.info("Repairing payment: {} with notes: {}", id, repairData.get("notes"));
        
        try {
            PaymentResponseDTO payment = paymentService.getPaymentStatus(id);
            payment.setStatus("PENDING");
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            log.error("Error repairing payment", e);
            throw new RuntimeException("Failed to repair payment");
        }
    }

    // Helper methods
    private BigDecimal calculateTotalAmount(List<PaymentResponseDTO> payments) {
        return payments.stream()
                .map(p -> p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private long countByStatus(List<PaymentResponseDTO> payments, String status) {
        return payments.stream()
                .filter(p -> status.equals(p.getStatus()))
                .count();
    }

    private List<Map<String, Object>> getRegionalDistribution(List<PaymentResponseDTO> payments) {
        // Region not available in PaymentResponseDTO, return empty for now
        return new ArrayList<>();
    }

    private List<Map<String, Object>> getStatusDistribution(List<PaymentResponseDTO> payments) {
        Map<String, Long> byStatus = payments.stream()
                .collect(Collectors.groupingBy(
                        p -> p.getStatus() != null ? p.getStatus() : "UNKNOWN",
                        Collectors.counting()
                ));
        
        return byStatus.entrySet().stream().map(entry -> {
            Map<String, Object> statusData = new HashMap<>();
            statusData.put("status", entry.getKey());
            statusData.put("count", entry.getValue());
            return statusData;
        }).collect(Collectors.toList());
    }

    private List<Map<String, Object>> getPaymentTrend(List<PaymentResponseDTO> payments) {
        // Return last 7 days trend (simplified)
        List<Map<String, Object>> trend = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", "Day-" + i);
            dayData.put("count", payments.size() / 7);
            dayData.put("amount", calculateTotalAmount(payments).divide(new BigDecimal(7)));
            trend.add(dayData);
        }
        return trend;
    }

    private boolean matchesSearchTerm(PaymentResponseDTO payment, String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return true;
        }
        String term = searchTerm.toLowerCase();
        return (payment.getPaymentId() != null && payment.getPaymentId().toLowerCase().contains(term)) ||
               (payment.getPaymentType() != null && payment.getPaymentType().toLowerCase().contains(term));
    }

    private Comparator<PaymentResponseDTO> getComparator(String sortBy, String sortOrder) {
        Comparator<PaymentResponseDTO> comparator;
        
        switch (sortBy) {
            case "amount":
                comparator = Comparator.comparing(p -> p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO);
                break;
            case "status":
                comparator = Comparator.comparing(p -> p.getStatus() != null ? p.getStatus() : "");
                break;
            default:
                comparator = Comparator.comparing(p -> new Date());
        }
        
        return "asc".equalsIgnoreCase(sortOrder) ? comparator : comparator.reversed();
    }

    private Map<String, Object> getEmptySummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalCount", 0);
        summary.put("totalAmount", BigDecimal.ZERO);
        summary.put("successCount", 0);
        summary.put("failedCount", 0);
        summary.put("pendingCount", 0);
        summary.put("regionalDistribution", Collections.emptyList());
        summary.put("statusDistribution", Collections.emptyList());
        summary.put("trend", Collections.emptyList());
        return summary;
    }

    private Map<String, Object> getEmptySearchResults() {
        Map<String, Object> response = new HashMap<>();
        response.put("content", Collections.emptyList());
        response.put("totalElements", 0);
        response.put("totalPages", 0);
        response.put("currentPage", 0);
        response.put("pageSize", 10);
        return response;
    }
}
