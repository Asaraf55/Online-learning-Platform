package com.learningplatform.controller;

import com.learningplatform.dto.AuthResponse;
import com.learningplatform.dto.StudentLoginRequest;
import com.learningplatform.dto.StudentRegisterRequest;
import com.learningplatform.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody StudentRegisterRequest request) {
        AuthResponse response = studentService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody StudentLoginRequest request) {
        AuthResponse response = studentService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStudent(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody java.util.Map<String, String> request) {
        studentService.forgotPassword(request.get("email"));
        return ResponseEntity.ok(java.util.Map.of("message", "Password reset instructions sent via Notification Service."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody java.util.Map<String, String> request) {
        studentService.resetPassword(request.get("token"), request.get("newPassword"));
        return ResponseEntity.ok(java.util.Map.of("message", "Password has been successfully reset."));
    }

    @GetMapping("/all")
    public ResponseEntity<Iterable<com.learningplatform.entity.User>> getAllUsers() {
        return ResponseEntity.ok(studentService.getAllUsers());
    }

    @PostMapping("/mentorship/notify")
    public ResponseEntity<?> notifyMentorship(@RequestBody java.util.Map<String, String> request) {
        studentService.notifyMentorship(request.get("email"), request.get("name"), request.get("link"));
        return ResponseEntity.ok().build();
    }
}
