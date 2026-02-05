package com.GPS.Global.Payment.Strategy.config;

import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.HashMap;
import java.util.Map;

/**
 * Enhanced Kafka Producer Configuration for LDM Events
 * 
 * Configuration features:
 * - Idempotent producer (exactly-once semantics)
 * - JSON serialization for complex objects
 * - Optimized for reliability and performance
 * - Transaction support
 * - Comprehensive error handling
 */
@Slf4j
@Configuration
public class KafkaProducerConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${kafka.producer.client-id:gps-producer}")
    private String clientId;

    @Value("${kafka.producer.enable-transactions:true}")
    private boolean enableTransactions;

    /**
     * Producer factory for JSON serialization (for LDM objects)
     * 
     * @return Producer factory
     */
    @Bean
    public ProducerFactory<String, Object> jsonProducerFactory() {
        Map<String, Object> config = new HashMap<>();
        
        // Connection settings
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ProducerConfig.CLIENT_ID_CONFIG, clientId + "-json");
        
        // Serialization
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        
        // JSON serializer specific settings
        config.put(JsonSerializer.ADD_TYPE_INFO_HEADERS, false);
        
        // Idempotency settings (exactly-once semantics)
        config.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);
        config.put(ProducerConfig.ACKS_CONFIG, "all");
        config.put(ProducerConfig.RETRIES_CONFIG, Integer.MAX_VALUE);
        config.put(ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION, 5);
        
        // Performance tuning
        config.put(ProducerConfig.BATCH_SIZE_CONFIG, 16384); // 16KB
        config.put(ProducerConfig.LINGER_MS_CONFIG, 10); // Wait 10ms for batching
        config.put(ProducerConfig.BUFFER_MEMORY_CONFIG, 33554432); // 32MB
        config.put(ProducerConfig.COMPRESSION_TYPE_CONFIG, "snappy");
        
        // Timeout settings
        config.put(ProducerConfig.REQUEST_TIMEOUT_MS_CONFIG, 30000); // 30 seconds
        config.put(ProducerConfig.DELIVERY_TIMEOUT_MS_CONFIG, 120000); // 2 minutes
        config.put(ProducerConfig.MAX_BLOCK_MS_CONFIG, 60000); // 1 minute
        
        // Transaction settings
        if (enableTransactions) {
            config.put(ProducerConfig.TRANSACTIONAL_ID_CONFIG, 
                    clientId + "-tx-" + System.currentTimeMillis());
        }
        
        log.info("JSON Producer Factory configured with idempotent settings");
        
        return new DefaultKafkaProducerFactory<>(config);
    }

    /**
     * Kafka template for JSON serialization
     * 
     * @return Kafka template
     */
    @Bean(name = "jsonKafkaTemplate")
    public KafkaTemplate<String, Object> jsonKafkaTemplate() {
        KafkaTemplate<String, Object> template = new KafkaTemplate<>(jsonProducerFactory());
        
        // Set default topic if needed
        // template.setDefaultTopic("default-topic");
        
        log.info("JSON KafkaTemplate created");
        
        return template;
    }

    /**
     * Producer factory for String serialization (backward compatibility)
     * 
     * @return Producer factory
     */
    @Bean
    public ProducerFactory<String, String> stringProducerFactory() {
        Map<String, Object> config = new HashMap<>();
        
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ProducerConfig.CLIENT_ID_CONFIG, clientId + "-string");
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        
        // Idempotency
        config.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);
        config.put(ProducerConfig.ACKS_CONFIG, "all");
        config.put(ProducerConfig.RETRIES_CONFIG, Integer.MAX_VALUE);
        config.put(ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION, 5);
        
        // Performance
        config.put(ProducerConfig.COMPRESSION_TYPE_CONFIG, "snappy");
        config.put(ProducerConfig.BATCH_SIZE_CONFIG, 16384);
        config.put(ProducerConfig.LINGER_MS_CONFIG, 10);
        
        log.info("String Producer Factory configured");
        
        return new DefaultKafkaProducerFactory<>(config);
    }

    /**
     * Kafka template for String serialization
     * 
     * @return Kafka template
     */
    @Bean(name = "stringKafkaTemplate")
    public KafkaTemplate<String, String> stringKafkaTemplate() {
        return new KafkaTemplate<>(stringProducerFactory());
    }
}
