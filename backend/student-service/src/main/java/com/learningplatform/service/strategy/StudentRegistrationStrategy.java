package com.learningplatform.service.strategy;

import com.learningplatform.dto.StudentRegisterRequest;
import com.learningplatform.entity.Student;
import com.learningplatform.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;

public class StudentRegistrationStrategy implements RegistrationStrategy {
    private final PasswordEncoder passwordEncoder;

    public StudentRegistrationStrategy(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User create(StudentRegisterRequest request) {
        return new Student(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFirstName(),
                request.getLastName(),
                request.getPhoneNo()
        );
    }
}
