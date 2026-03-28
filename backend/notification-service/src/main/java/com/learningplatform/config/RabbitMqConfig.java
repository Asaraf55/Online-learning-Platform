package com.learningplatform.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    public static final String ENROLLMENT_QUEUE = "enrollment-queue";
    public static final String ENROLLMENT_EXCHANGE = "enrollment-exchange";
    public static final String ENROLLMENT_ROUTING_KEY = "enrollment.key";

    public static final String REGISTRATION_QUEUE = "registration-queue";
    public static final String REGISTRATION_EXCHANGE = "registration-exchange";
    public static final String REGISTRATION_ROUTING_KEY = "registration.key";

    public static final String COURSE_UPDATE_QUEUE = "course-update-queue";
    public static final String COURSE_UPDATE_EXCHANGE = "course-update-exchange";
    public static final String COURSE_UPDATE_ROUTING_KEY = "course-update.key";

    @Bean
    public Queue enrollmentQueue() { return new Queue(ENROLLMENT_QUEUE, true); }

    @Bean
    public DirectExchange enrollmentExchange() { return new DirectExchange(ENROLLMENT_EXCHANGE, true, false); }

    @Bean
    public Binding enrollmentBinding() {
        return BindingBuilder.bind(enrollmentQueue()).to(enrollmentExchange()).with(ENROLLMENT_ROUTING_KEY);
    }

    @Bean
    public Queue registrationQueue() { return new Queue(REGISTRATION_QUEUE, true); }

    @Bean
    public DirectExchange registrationExchange() { return new DirectExchange(REGISTRATION_EXCHANGE, true, false); }

    @Bean
    public Binding registrationBinding() {
        return BindingBuilder.bind(registrationQueue()).to(registrationExchange()).with(REGISTRATION_ROUTING_KEY);
    }

    @Bean
    public Queue courseUpdateQueue() { return new Queue(COURSE_UPDATE_QUEUE, true); }

    @Bean
    public DirectExchange courseUpdateExchange() { return new DirectExchange(COURSE_UPDATE_EXCHANGE, true, false); }

    @Bean
    public Binding courseUpdateBinding() {
        return BindingBuilder.bind(courseUpdateQueue()).to(courseUpdateExchange()).with(COURSE_UPDATE_ROUTING_KEY);
    }
}
