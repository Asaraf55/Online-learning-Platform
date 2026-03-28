package com.learningplatform.service.strategy;

import com.learningplatform.dto.StudentRegisterRequest;
import com.learningplatform.entity.User;

public interface RegistrationStrategy {
    User create(StudentRegisterRequest request);
}
