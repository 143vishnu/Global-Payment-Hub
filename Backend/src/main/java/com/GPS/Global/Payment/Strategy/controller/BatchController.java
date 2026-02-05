package com.GPS.Global.Payment.Strategy.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

/**
 * Controller for batch payment operations
 */
@Slf4j
@RestController
@RequestMapping("/batch")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BatchController {

    /**
     * Upload batch file (CSV/Excel)
     */
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadBatch(@RequestParam("file") MultipartFile file) {
        log.info("Batch file upload received: {} (size: {} bytes)", file.getOriginalFilename(), file.getSize());
        
        try {
            // Validate file
            if (file.isEmpty()) {
                throw new IllegalArgumentException("File is empty");
            }
            
            String filename = file.getOriginalFilename();
            if (filename == null || (!filename.endsWith(".csv") && !filename.endsWith(".xlsx") && !filename.endsWith(".xls"))) {
                throw new IllegalArgumentException("Invalid file format. Only CSV and Excel files are supported");
            }
            
            if (file.getSize() > 10 * 1024 * 1024) { // 10MB
                throw new IllegalArgumentException("File size exceeds 10MB limit");
            }
            
            // Create batch job
            String jobId = "JOB-" + UUID.randomUUID().toString().substring(0, 8);
            
            Map<String, Object> job = new HashMap<>();
            job.put("jobId", jobId);
            job.put("fileName", filename);
            job.put("status", "PROCESSING");
            job.put("totalRecords", 100); // Mock count
            job.put("processedRecords", 0);
            job.put("successCount", 0);
            job.put("failedCount", 0);
            job.put("uploadedAt", new Date());
            job.put("uploadedBy", "current_user");
            
            log.info("Batch job created: {}", jobId);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(job);
            
        } catch (IllegalArgumentException e) {
            log.error("Batch upload validation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error processing batch upload", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to process batch file"));
        }
    }

    /**
     * Get all batch jobs
     */
    @GetMapping("/jobs")
    public ResponseEntity<Map<String, Object>> getBatchJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        
        log.info("Fetching batch jobs - page: {}, size: {}, status: {}", page, size, status);
        
        List<Map<String, Object>> jobs = new ArrayList<>();
        
        // Return mock batch jobs
        for (int i = 1; i <= 5; i++) {
            Map<String, Object> job = new HashMap<>();
            job.put("jobId", "JOB-" + String.format("%08d", i));
            job.put("fileName", "payments_batch_" + i + ".csv");
            job.put("status", i == 1 ? "PROCESSING" : i == 2 ? "FAILED" : "COMPLETED");
            job.put("totalRecords", 100 * i);
            job.put("processedRecords", i == 1 ? 45 : 100 * i);
            job.put("successCount", i == 2 ? 50 : 100 * i);
            job.put("failedCount", i == 2 ? 50 : 0);
            job.put("uploadedAt", new Date(System.currentTimeMillis() - i * 86400000L));
            job.put("uploadedBy", "user_" + i);
            job.put("completedAt", i == 1 ? null : new Date());
            jobs.add(job);
        }
        
        // Filter by status if provided
        if (status != null && !status.isEmpty()) {
            jobs.removeIf(job -> !status.equals(job.get("status")));
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", jobs);
        response.put("totalElements", jobs.size());
        response.put("totalPages", 1);
        response.put("currentPage", page);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get specific batch job details
     */
    @GetMapping("/jobs/{jobId}")
    public ResponseEntity<Map<String, Object>> getBatchJob(@PathVariable String jobId) {
        log.info("Fetching batch job: {}", jobId);
        
        Map<String, Object> job = new HashMap<>();
        job.put("jobId", jobId);
        job.put("fileName", "payments_batch.csv");
        job.put("status", "COMPLETED");
        job.put("totalRecords", 100);
        job.put("processedRecords", 100);
        job.put("successCount", 95);
        job.put("failedCount", 5);
        job.put("uploadedAt", new Date());
        job.put("completedAt", new Date());
        job.put("uploadedBy", "current_user");
        
        return ResponseEntity.ok(job);
    }

    /**
     * Get batch job status
     */
    @GetMapping("/jobs/{jobId}/status")
    public ResponseEntity<Map<String, Object>> getBatchJobStatus(@PathVariable String jobId) {
        log.info("Fetching batch job status: {}", jobId);
        
        Map<String, Object> status = new HashMap<>();
        status.put("jobId", jobId);
        status.put("status", "COMPLETED");
        status.put("progress", 100);
        status.put("message", "Batch processing completed successfully");
        
        return ResponseEntity.ok(status);
    }

    /**
     * Retry failed records in a batch job
     */
    @PostMapping("/jobs/{jobId}/retry")
    public ResponseEntity<Map<String, Object>> retryBatchJob(@PathVariable String jobId) {
        log.info("Retrying failed records for batch job: {}", jobId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("jobId", jobId);
        result.put("status", "RETRY_INITIATED");
        result.put("message", "Retry process started for failed records");
        result.put("retriedCount", 5);
        
        return ResponseEntity.ok(result);
    }

    /**
     * Download batch job report
     */
    @GetMapping("/jobs/{jobId}/report")
    public ResponseEntity<byte[]> downloadBatchReport(
            @PathVariable String jobId,
            @RequestParam(defaultValue = "csv") String format) {
        
        log.info("Downloading batch report: {} in format: {}", jobId, format);
        
        try {
            String csvContent = "Payment ID,Amount,Status,Error Message\n" +
                    "PAY-001,1000.00,SUCCESS,\n" +
                    "PAY-002,2000.00,FAILED,Invalid account number\n" +
                    "PAY-003,1500.00,SUCCESS,\n";
            
            byte[] reportBytes = csvContent.getBytes();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "batch_report_" + jobId + "." + format);
            headers.setContentLength(reportBytes.length);
            
            return new ResponseEntity<>(reportBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            log.error("Error generating batch report", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Cancel batch job
     */
    @PostMapping("/jobs/{jobId}/cancel")
    public ResponseEntity<Map<String, Object>> cancelBatchJob(@PathVariable String jobId) {
        log.info("Cancelling batch job: {}", jobId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("jobId", jobId);
        result.put("status", "CANCELLED");
        result.put("message", "Batch job cancelled successfully");
        
        return ResponseEntity.ok(result);
    }
}
