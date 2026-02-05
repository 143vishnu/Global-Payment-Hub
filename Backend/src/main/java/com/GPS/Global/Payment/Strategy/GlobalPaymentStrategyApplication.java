package com.GPS.Global.Payment.Strategy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = {
		org.springframework.boot.autoconfigure.jms.activemq.ActiveMQAutoConfiguration.class,
		org.springframework.boot.autoconfigure.jms.JmsAutoConfiguration.class,
		org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration.class
})
public class GlobalPaymentStrategyApplication {

	public static void main(String[] args) {
		SpringApplication.run(GlobalPaymentStrategyApplication.class, args);
	}

}
