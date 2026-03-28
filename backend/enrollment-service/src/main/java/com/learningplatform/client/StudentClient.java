package com.learningplatform.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "student-service", url = "http://localhost:8001")
public interface StudentClient {

    @GetMapping("/api/students/{id}")
    com.learningplatform.dto.StudentDto getStudent(@PathVariable("id") Long id);
}
