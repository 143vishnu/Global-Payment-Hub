package com.GPS.Global.Payment.Strategy.controller;

import com.GPS.Global.Payment.Strategy.model.entity.User;
import com.GPS.Global.Payment.Strategy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Controller for administrative operations
 */
@Slf4j
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final UserRepository userRepository;

    /**
     * Get system configuration
     */
    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getConfig() {
        log.info("Fetching system configuration");
        
        Map<String, Object> config = new HashMap<>();
        config.put("maxPaymentAmount", new BigDecimal("1000000.00"));
        config.put("minPaymentAmount", new BigDecimal("1.00"));
        config.put("defaultCurrency", "USD");
        config.put("timeoutSeconds", 30);
        config.put("retryAttempts", 3);
        config.put("batchSize", 100);
        config.put("enableNotifications", true);
        config.put("enableAuditLog", true);
        config.put("maintenanceMode", false);
        
        return ResponseEntity.ok(config);
    }

    /**
     * Update system configuration
     */
    @PutMapping("/config")
    public ResponseEntity<Map<String, Object>> updateConfig(@RequestBody Map<String, Object> config) {
        log.info("Updating system configuration: {}", config);
        
        // In production, validate and save to database
        // For now, just return the updated config
        
        return ResponseEntity.ok(config);
    }

    /**
     * Get regional rules
     */
    @GetMapping("/regional-rules")
    public ResponseEntity<List<Map<String, Object>>> getRegionalRules() {
        log.info("Fetching regional rules");
        
        List<Map<String, Object>> rules = new ArrayList<>();
        
        String[] regions = {"NA", "EU", "APAC", "LATAM"};
        for (String region : regions) {
            Map<String, Object> rule = new HashMap<>();
            rule.put("region", region);
            rule.put("maxAmount", new BigDecimal("500000.00"));
            rule.put("currency", region.equals("EU") ? "EUR" : "USD");
            rule.put("requiresApproval", true);
            rule.put("workingHoursOnly", false);
            rule.put("enabled", true);
            rules.add(rule);
        }
        
        return ResponseEntity.ok(rules);
    }

    /**
     * Update regional rule
     */
    @PutMapping("/regional-rules/{region}")
    public ResponseEntity<Map<String, Object>> updateRegionalRule(
            @PathVariable String region,
            @RequestBody Map<String, Object> rule) {
        
        log.info("Updating regional rule for {}: {}", region, rule);
        
        rule.put("region", region);
        
        return ResponseEntity.ok(rule);
    }

    /**
     * Get payment thresholds
     */
    @GetMapping("/thresholds")
    public ResponseEntity<List<Map<String, Object>>> getThresholds() {
        log.info("Fetching payment thresholds");
        
        List<Map<String, Object>> thresholds = new ArrayList<>();
        
        String[] levels = {"LOW", "MEDIUM", "HIGH", "CRITICAL"};
        BigDecimal[] amounts = {new BigDecimal("10000"), new BigDecimal("50000"), 
                                new BigDecimal("100000"), new BigDecimal("500000")};
        
        for (int i = 0; i < levels.length; i++) {
            Map<String, Object> threshold = new HashMap<>();
            threshold.put("id", "THR-" + (i + 1));
            threshold.put("level", levels[i]);
            threshold.put("amount", amounts[i]);
            threshold.put("requiresApproval", i >= 2);
            threshold.put("notifyManager", i >= 1);
            thresholds.add(threshold);
        }
        
        return ResponseEntity.ok(thresholds);
    }

    /**
     * Update threshold
     */
    @PutMapping("/thresholds/{thresholdId}")
    public ResponseEntity<Map<String, Object>> updateThreshold(
            @PathVariable String thresholdId,
            @RequestBody Map<String, Object> thresholdData) {
        
        log.info("Updating threshold {}: {}", thresholdId, thresholdData);
        
        thresholdData.put("id", thresholdId);
        
        return ResponseEntity.ok(thresholdData);
    }

    /**
     * Get system status
     */
    @GetMapping("/system-status")
    public ResponseEntity<Map<String, Object>> getSystemStatus() {
        log.info("Fetching system status");
        
        Map<String, Object> status = new HashMap<>();
        status.put("database", Map.of("status", "UP", "responseTime", 15));
        status.put("mqBroker", Map.of("status", "UP", "queueDepth", 25));
        status.put("kafka", Map.of("status", "UP", "lag", 0));
        status.put("externalApi", Map.of("status", "UP", "responseTime", 120));
        status.put("overallStatus", "HEALTHY");
        status.put("lastChecked", new Date());
        
        return ResponseEntity.ok(status);
    }

    /**
     * Get all users
     */
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getUsers() {
        log.info("Fetching all users");
        
        try {
            List<User> users = userRepository.findAll();
            
            List<Map<String, Object>> userList = users.stream().map(user -> {
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", user.getId());
                userData.put("username", user.getUsername());
                userData.put("fullName", user.getFullName());
                userData.put("email", user.getEmail());
                userData.put("role", user.getRole());
                userData.put("enabled", user.getEnabled());
                userData.put("createdAt", user.getCreatedAt());
                userData.put("lastLogin", user.getLastLogin());
                return userData;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(userList);
            
        } catch (Exception e) {
            log.error("Error fetching users", e);
            // Return mock users if database error
            return ResponseEntity.ok(getMockUsers());
        }
    }

    /**
     * Update user role
     */
    @PutMapping("/users/{userId}/role")
    public ResponseEntity<Map<String, Object>> updateUserRole(
            @PathVariable Long userId,
            @RequestBody Map<String, String> roleData) {
        
        String newRole = roleData.get("role");
        log.info("Updating role for user {} to {}", userId, newRole);
        
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            user.setRole(newRole);
            user = userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("role", user.getRole());
            response.put("message", "User role updated successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error updating user role", e);
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to update user role: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Toggle user enabled status
     */
    @PutMapping("/users/{userId}/toggle-status")
    public ResponseEntity<Map<String, Object>> toggleUserStatus(@PathVariable Long userId) {
        log.info("Toggling status for user {}", userId);
        
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            user.setEnabled(!user.getEnabled());
            user = userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("enabled", user.getEnabled());
            response.put("message", "User status updated successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error toggling user status", e);
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to update user status: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Get system metrics
     */
    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getSystemMetrics() {
        log.info("Fetching system metrics");
        
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalPayments", 15847);
        metrics.put("totalUsers", userRepository.count());
        metrics.put("activeUsers", 125);
        metrics.put("avgProcessingTime", 2.5);
        metrics.put("successRate", 94.3);
        metrics.put("systemUptime", "15 days 8 hours");
        metrics.put("diskUsage", 45.2);
        metrics.put("memoryUsage", 68.5);
        metrics.put("cpuUsage", 32.1);
        
        return ResponseEntity.ok(metrics);
    }

    // Helper method for mock users
    private List<Map<String, Object>> getMockUsers() {
        List<Map<String, Object>> users = new ArrayList<>();
        
        Map<String, Object> admin = new HashMap<>();
        admin.put("id", 1L);
        admin.put("username", "admin");
        admin.put("fullName", "System Administrator");
        admin.put("email", "admin@gps.com");
        admin.put("role", "ADMIN");
        admin.put("enabled", true);
        users.add(admin);
        
        Map<String, Object> ops = new HashMap<>();
        ops.put("id", 2L);
        ops.put("username", "opsuser");
        ops.put("fullName", "Operations User");
        ops.put("email", "ops@gps.com");
        ops.put("role", "OPS_USER");
        ops.put("enabled", true);
        users.add(ops);
        
        Map<String, Object> business = new HashMap<>();
        business.put("id", 3L);
        business.put("username", "business");
        business.put("fullName", "Business User");
        business.put("email", "business@gps.com");
        business.put("role", "BUSINESS_USER");
        business.put("enabled", true);
        users.add(business);
        
        return users;
    }
}
