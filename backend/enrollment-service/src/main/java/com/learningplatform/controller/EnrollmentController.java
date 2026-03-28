package com.learningplatform.controller;

import com.learningplatform.dto.EnrollmentRequest;
import com.learningplatform.entity.Enrollment;
import com.learningplatform.security.JwtValidator;
import com.learningplatform.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private JwtValidator jwtValidator;

    @PostMapping
    public ResponseEntity<?> enrollStudent(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody EnrollmentRequest request) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        if (!jwtValidator.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid token");
        }

        Long studentId = jwtValidator.getStudentIdFromToken(token);
        Enrollment enrollment = enrollmentService.enrollStudent(studentId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollment);
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<Enrollment>> getAllEnrollments() {
        List<Enrollment> enrollments = enrollmentService.getAllEnrollments();
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/student")
    public ResponseEntity<?> getStudentEnrollments(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        if (!jwtValidator.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid token");
        }

        Long studentId = jwtValidator.getStudentIdFromToken(token);
        List<Enrollment> enrollments = enrollmentService.getStudentEnrollments(studentId);
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getCourseEnrollments(@PathVariable Long courseId) {
        List<Enrollment> enrollments = enrollmentService.getCourseEnrollments(courseId);
        return ResponseEntity.ok(enrollments);
    }

    @DeleteMapping("/{enrollmentId}")
    public ResponseEntity<?> cancelEnrollment(
            @PathVariable Long enrollmentId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        if (!jwtValidator.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid token");
        }

        Long studentId = jwtValidator.getStudentIdFromToken(token);
        enrollmentService.cancelEnrollment(enrollmentId, studentId);
        return ResponseEntity.ok("Enrollment cancelled successfully");
    }
}
