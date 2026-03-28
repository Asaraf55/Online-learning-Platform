package com.learningplatform.service.strategy;

import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.learningplatform.exception.BadRequestException;
import java.util.Map;
import java.util.HashMap;

@Component
public class RegistrationContext {
    private final Map<String, RegistrationStrategy> strategies = new HashMap<>();

    public RegistrationContext(PasswordEncoder passwordEncoder) {
        strategies.put("STUDENT", new StudentRegistrationStrategy(passwordEncoder));
        strategies.put("TEACHER", new TeacherRegistrationStrategy(passwordEncoder));
        strategies.put("ADMIN", new AdminRegistrationStrategy(passwordEncoder));
    }

    public RegistrationStrategy getStrategy(String role) {
        if (role == null || role.trim().isEmpty()) role = "STUDENT";
        RegistrationStrategy strategy = strategies.get(role.toUpperCase());
        if (strategy == null) {
            throw new BadRequestException("Invalid role provided");
        }
        return strategy;
    }
}
