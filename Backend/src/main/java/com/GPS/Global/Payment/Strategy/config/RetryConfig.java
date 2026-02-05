package com.GPS.Global.Payment.Strategy.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.annotation.EnableRetry;

/**
 * Configuration for Spring Retry
 * Enables retry mechanism for Kafka publishing and other operations
 */
@Slf4j
@Configuration
@EnableRetry
public class RetryConfig {
    
    public RetryConfig() {
        log.info("Spring Retry enabled for error handling");
    }
}
