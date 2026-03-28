package com.learningplatform.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("student-service", r -> r
                        .path("/api/students/**")
                        .uri("lb://student-service"))
                .route("course-service", r -> r
                        .path("/api/courses/**")
                        .uri("lb://course-service"))
                .route("enrollment-service", r -> r
                        .path("/api/enrollments/**")
                        .uri("lb://enrollment-service"))
                .build();
    }
}
