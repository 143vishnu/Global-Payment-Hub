package com.GPS.Global.Payment.Strategy.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.IntegrationComponentScan;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.config.EnableIntegration;
import org.springframework.integration.dsl.IntegrationFlow;
import org.springframework.messaging.MessageChannel;

/**
 * Spring Integration configuration for message flows
 */
@Configuration
@EnableIntegration
@IntegrationComponentScan
public class IntegrationConfig {

    @Bean
    public MessageChannel graphiteInputChannel() {
        return new DirectChannel();
    }

    @Bean
    public MessageChannel graphiteOutputChannel() {
        return new DirectChannel();
    }

    @Bean
    public MessageChannel errorChannel() {
        return new DirectChannel();
    }

    /**
     * Integration flow for payment processing
     */
    @Bean
    public IntegrationFlow paymentProcessingFlow() {
        return IntegrationFlow.from("graphiteInputChannel")
                .handle((payload, headers) -> {
                    // Transform message for Graphite
                    return payload;
                })
                .channel("graphiteOutputChannel")
                .get();
    }
}
