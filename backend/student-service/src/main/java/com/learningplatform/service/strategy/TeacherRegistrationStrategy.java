package com.learningplatform.service.strategy;

import com.learningplatform.dto.StudentRegisterRequest;
import com.learningplatform.entity.Teacher;
import com.learningplatform.entity.User;
import com.learningplatform.exception.BadRequestException;
import org.springframework.security.crypto.password.PasswordEncoder;

public class TeacherRegistrationStrategy implements RegistrationStrategy {
    private final PasswordEncoder passwordEncoder;

    public TeacherRegistrationStrategy(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User create(StudentRegisterRequest request) {
        if (request.getInstitution() == null || request.getInstitution().trim().isEmpty()) {
            throw new BadRequestException("Institution is required for Teacher registration");
        }
        return new Teacher(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFirstName(),
                request.getLastName(),
                request.getPhoneNo(),
                request.getInstitution(),
                request.getRegistrationNo()
        );
    }
}
