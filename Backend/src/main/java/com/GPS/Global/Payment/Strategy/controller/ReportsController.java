package com.GPS.Global.Payment.Strategy.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Controller for reports and analytics
 */
@Slf4j
@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ReportsController {

    /**
     * Get daily report
     */
    @GetMapping("/daily")
    public ResponseEntity<Map<String, Object>> getDailyReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String region) {
        
        log.info("Fetching daily report - startDate: {}, endDate: {}, region: {}", startDate, endDate, region);
        
        List<Map<String, Object>> reportData = new ArrayList<>();
        
        // Generate mock daily data for last 7 days
        for (int i = 6; i >= 0; i--) {
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", "2024-01-" + (25 + i));
            dayData.put("totalCount", 100 + (i * 10));
            dayData.put("totalAmount", new BigDecimal("50000.00").add(new BigDecimal(i * 5000)));
            dayData.put("successCount", 85 + (i * 8));
            dayData.put("failedCount", 10 + i);
            dayData.put("pendingCount", 5 + i);
            dayData.put("region", region != null ? region : "ALL");
            reportData.add(dayData);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("data", reportData);
        response.put("summary", Map.of(
                "totalTransactions", 770,
                "totalAmount", new BigDecimal("385000.00"),
                "successRate", 87.5,
                "avgDailyAmount", new BigDecimal("55000.00")
        ));
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get audit report
     */
    @GetMapping("/audit")
    public ResponseEntity<Map<String, Object>> getAuditReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String user) {
        
        log.info("Fetching audit report - startDate: {}, endDate: {}, action: {}, user: {}", 
                startDate, endDate, action, user);
        
        List<Map<String, Object>> auditData = new ArrayList<>();
        
        // Generate mock audit entries
        String[] actions = {"PAYMENT_CREATED", "PAYMENT_APPROVED", "PAYMENT_REJECTED", "CONFIG_UPDATED", "USER_LOGIN"};
        String[] users = {"admin", "opsuser", "businessuser", "system"};
        
        for (int i = 0; i < 20; i++) {
            Map<String, Object> audit = new HashMap<>();
            audit.put("id", "AUD-" + String.format("%05d", i + 1));
            audit.put("timestamp", new Date(System.currentTimeMillis() - (i * 3600000L)));
            audit.put("action", actions[i % actions.length]);
            audit.put("user", users[i % users.length]);
            audit.put("entityType", "PAYMENT");
            audit.put("entityId", "PAY-" + String.format("%05d", i + 1));
            audit.put("details", "Action performed successfully");
            audit.put("ipAddress", "192.168.1." + (100 + i));
            auditData.add(audit);
        }
        
        // Filter by action if provided
        if (action != null && !action.isEmpty()) {
            auditData.removeIf(a -> !action.equals(a.get("action")));
        }
        
        // Filter by user if provided
        if (user != null && !user.isEmpty()) {
            auditData.removeIf(a -> !user.equals(a.get("user")));
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("data", auditData);
        response.put("totalRecords", auditData.size());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Download report as CSV
     */
    @GetMapping("/daily/csv")
    public ResponseEntity<byte[]> downloadDailyReportCsv(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        log.info("Downloading daily report as CSV - startDate: {}, endDate: {}", startDate, endDate);
        
        try {
            StringBuilder csv = new StringBuilder();
            csv.append("Date,Total Count,Total Amount,Success Count,Failed Count,Pending Count\n");
            
            for (int i = 6; i >= 0; i--) {
                csv.append(String.format("2024-01-%d,%d,%.2f,%d,%d,%d\n",
                        (25 + i), (100 + i * 10), (50000.0 + i * 5000), (85 + i * 8), (10 + i), (5 + i)));
            }
            
            byte[] csvBytes = csv.toString().getBytes(StandardCharsets.UTF_8);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(new MediaType("text", "csv", StandardCharsets.UTF_8));
            headers.set("Content-Disposition", "attachment; filename=\"daily_report.csv\"");
            headers.setContentLength(csvBytes.length);
            headers.set("Access-Control-Expose-Headers", "Content-Disposition");
            
            return new ResponseEntity<>(csvBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            log.error("Error generating CSV report", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Download report as Excel
     */
    @GetMapping("/daily/excel")
    public ResponseEntity<byte[]> downloadDailyReportExcel(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        log.info("Downloading daily report as Excel - startDate: {}, endDate: {}", startDate, endDate);
        
        try {
            // For now, return CSV content (in production, use Apache POI to generate Excel)
            StringBuilder csv = new StringBuilder();
            csv.append("Date,Total Count,Total Amount,Success Count,Failed Count,Pending Count\n");
            
            for (int i = 6; i >= 0; i--) {
                csv.append(String.format("2024-01-%d,%d,%.2f,%d,%d,%d\n",
                        (25 + i), (100 + i * 10), (50000.0 + i * 5000), (85 + i * 8), (10 + i), (5 + i)));
            }
            
            byte[] excelBytes = csv.toString().getBytes(StandardCharsets.UTF_8);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.set("Content-Disposition", "attachment; filename=\"daily_report.xlsx\"");
            headers.setContentLength(excelBytes.length);
            headers.set("Access-Control-Expose-Headers", "Content-Disposition");
            
            return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            log.error("Error generating Excel report", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Download audit report as CSV
     */
    @GetMapping("/audit/csv")
    public ResponseEntity<byte[]> downloadAuditReportCsv(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        log.info("Downloading audit report as CSV - startDate: {}, endDate: {}", startDate, endDate);
        
        try {
            StringBuilder csv = new StringBuilder();
            csv.append("ID,Timestamp,Action,User,Entity Type,Entity ID,IP Address\n");
            
            for (int i = 0; i < 20; i++) {
                csv.append(String.format("AUD-%05d,2024-01-31 %02d:00:00,PAYMENT_CREATED,user%d,PAYMENT,PAY-%05d,192.168.1.%d\n",
                        i + 1, (23 - i), (i % 3 + 1), i + 1, (100 + i)));
            }
            
            byte[] csvBytes = csv.toString().getBytes(StandardCharsets.UTF_8);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(new MediaType("text", "csv", StandardCharsets.UTF_8));
            headers.set("Content-Disposition", "attachment; filename=\"audit_report.csv\"");
            headers.setContentLength(csvBytes.length);
            headers.set("Access-Control-Expose-Headers", "Content-Disposition");
            
            return new ResponseEntity<>(csvBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            log.error("Error generating audit CSV report", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Download audit report as Excel
     */
    @GetMapping("/audit/excel")
    public ResponseEntity<byte[]> downloadAuditReportExcel(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        log.info("Downloading audit report as Excel - startDate: {}, endDate: {}", startDate, endDate);
        
        try {
            StringBuilder csv = new StringBuilder();
            csv.append("ID,Timestamp,Action,User,Entity Type,Entity ID,IP Address\n");
            
            for (int i = 0; i < 20; i++) {
                csv.append(String.format("AUD-%05d,2024-01-31 %02d:00:00,PAYMENT_CREATED,user%d,PAYMENT,PAY-%05d,192.168.1.%d\n",
                        i + 1, (23 - i), (i % 3 + 1), i + 1, (100 + i)));
            }
            
            byte[] excelBytes = csv.toString().getBytes(StandardCharsets.UTF_8);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.set("Content-Disposition", "attachment; filename=\"audit_report.xlsx\"");
            headers.setContentLength(excelBytes.length);
            headers.set("Access-Control-Expose-Headers", "Content-Disposition");
            
            return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            log.error("Error generating audit Excel report", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get regional statistics
     */
    @GetMapping("/regional-stats")
    public ResponseEntity<List<Map<String, Object>>> getRegionalStats(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        log.info("Fetching regional stats - startDate: {}, endDate: {}", startDate, endDate);
        
        List<Map<String, Object>> stats = new ArrayList<>();
        
        String[] regions = {"NA", "EU", "APAC", "LATAM"};
        for (int i = 0; i < regions.length; i++) {
            Map<String, Object> regionStat = new HashMap<>();
            regionStat.put("region", regions[i]);
            regionStat.put("totalCount", 100 + (i * 20));
            regionStat.put("totalAmount", new BigDecimal((100 + i * 20) * 1000));
            regionStat.put("successRate", 85.0 + i);
            stats.add(regionStat);
        }
        
        return ResponseEntity.ok(stats);
    }

    /**
     * Get payment type statistics
     */
    @GetMapping("/payment-types")
    public ResponseEntity<List<Map<String, Object>>> getPaymentTypeStats(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        log.info("Fetching payment type stats - startDate: {}, endDate: {}", startDate, endDate);
        
        List<Map<String, Object>> stats = new ArrayList<>();
        
        String[] types = {"WIRE", "ACH", "SWIFT", "SEPA"};
        for (int i = 0; i < types.length; i++) {
            Map<String, Object> typeStat = new HashMap<>();
            typeStat.put("paymentType", types[i]);
            typeStat.put("count", 80 + (i * 15));
            typeStat.put("totalAmount", new BigDecimal((80 + i * 15) * 1200));
            typeStat.put("avgAmount", new BigDecimal(1200 + i * 100));
            stats.add(typeStat);
        }
        
        return ResponseEntity.ok(stats);
    }
}
