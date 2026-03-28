package com.learningplatform.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "course-service", url = "http://localhost:8002")
public interface CourseClient {

    @GetMapping("/api/courses/{id}")
    Object getCourse(@PathVariable Long id);
}
