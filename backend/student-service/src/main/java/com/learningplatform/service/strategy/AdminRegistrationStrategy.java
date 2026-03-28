package com.learningplatform.service.strategy;

import com.learningplatform.dto.StudentRegisterRequest;
import com.learningplatform.entity.Admin;
import com.learningplatform.entity.User;
import com.learningplatform.exception.BadRequestException;
import org.springframework.security.crypto.password.PasswordEncoder;

public class AdminRegistrationStrategy implements RegistrationStrategy {
    private final PasswordEncoder passwordEncoder;
    private static final String SECRET_ADMIN_CODE = "WEARETOGETHER";

    public AdminRegistrationStrategy(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User create(StudentRegisterRequest request) {
        if (!SECRET_ADMIN_CODE.equals(request.getAdminCode())) {
            throw new BadRequestException("Invalid Admin Code");
        }
        return new Admin(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFirstName(),
                request.getLastName(),
                request.getPhoneNo()
        );
    }
}
