package com.GPS.Global.Payment.Strategy.config;

import com.ibm.mq.jms.MQConnectionFactory;
import com.ibm.msg.client.wmq.WMQConstants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.jms.connection.CachingConnectionFactory;
import org.springframework.jms.core.JmsTemplate;

import jakarta.jms.JMSException;

/**
 * IBM MQ JMS configuration
 */
@Slf4j
@Configuration
@EnableJms
@ConditionalOnProperty(name = "ibm.mq.enabled", havingValue = "true", matchIfMissing = false)
public class IBMMQConfig {

    @Value("${ibm.mq.queue-manager}")
    private String queueManager;

    @Value("${ibm.mq.channel}")
    private String channel;

    @Value("${ibm.mq.host}")
    private String host;

    @Value("${ibm.mq.port}")
    private int port;

    @Value("${ibm.mq.user}")
    private String user;

    @Value("${ibm.mq.password}")
    private String password;

    @Bean
    public MQConnectionFactory mqConnectionFactory() {
        try {
            MQConnectionFactory factory = new MQConnectionFactory();
            factory.setHostName(host);
            factory.setPort(port);
            factory.setQueueManager(queueManager);
            factory.setChannel(channel);
            factory.setTransportType(WMQConstants.WMQ_CM_CLIENT);
            factory.setStringProperty(WMQConstants.USERID, user);
            factory.setStringProperty(WMQConstants.PASSWORD, password);
            
            log.info("IBM MQ ConnectionFactory configured for queue manager: {}", queueManager);
            
            return factory;
        } catch (Exception e) {
            log.error("Failed to create MQ Connection Factory", e);
            throw new RuntimeException("Failed to create MQ Connection Factory", e);
        }
    }

    @Bean
    public CachingConnectionFactory cachingConnectionFactory() {
        CachingConnectionFactory cachingFactory = new CachingConnectionFactory((jakarta.jms.ConnectionFactory) mqConnectionFactory());
        cachingFactory.setSessionCacheSize(10);
        cachingFactory.setCacheProducers(true);
        cachingFactory.setCacheConsumers(true);
        
        return cachingFactory;
    }

    @Bean
    public JmsTemplate jmsTemplate() {
        JmsTemplate template = new JmsTemplate(cachingConnectionFactory());
        template.setReceiveTimeout(5000);
        template.setDeliveryPersistent(true);
        template.setSessionTransacted(true);
        
        return template;
    }

    @Bean
    public org.springframework.jms.config.DefaultJmsListenerContainerFactory jmsListenerContainerFactory() {
        
        org.springframework.jms.config.DefaultJmsListenerContainerFactory factory = 
                new org.springframework.jms.config.DefaultJmsListenerContainerFactory();
        
        factory.setConnectionFactory(cachingConnectionFactory());
        
        // Transaction settings
        factory.setSessionTransacted(true);
        factory.setSessionAcknowledgeMode(jakarta.jms.Session.SESSION_TRANSACTED);
        
        // Concurrency settings
        factory.setConcurrency("3-10"); // Min 3, Max 10 concurrent consumers
        
        // Error handling
        factory.setErrorHandler(throwable -> 
            log.error("JMS Listener error occurred", throwable));
        
        // Backoff settings for retry
        org.springframework.util.backoff.FixedBackOff backOff = 
                new org.springframework.util.backoff.FixedBackOff(5000L, 3L); // 5s interval, 3 attempts
        factory.setBackOff(backOff);
        
        // Recovery interval
        factory.setRecoveryInterval(10000L); // 10 seconds
        
        log.info("JMS Listener Container Factory configured with transaction support");
        
        return factory;
    }
}
