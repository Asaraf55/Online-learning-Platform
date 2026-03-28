package com.learningplatform.service;

import com.learningplatform.dto.AuthResponse;
import com.learningplatform.dto.StudentLoginRequest;
import com.learningplatform.dto.StudentRegisterRequest;
import com.learningplatform.entity.User;
import com.learningplatform.repository.UserRepository;
import com.learningplatform.security.JwtTokenProvider;
import com.learningplatform.service.strategy.RegistrationContext;
import com.learningplatform.service.strategy.RegistrationStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.learningplatform.exception.BadRequestException;
import com.learningplatform.exception.ResourceNotFoundException;
import com.learningplatform.exception.UnauthorizedException;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private RegistrationContext registrationContext;

    @Autowired
    private org.springframework.amqp.rabbit.core.RabbitTemplate rabbitTemplate;

    public AuthResponse register(StudentRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        RegistrationStrategy strategy = registrationContext.getStrategy(request.getRole());
        User user = strategy.create(request);
        User savedUser = userRepository.save(user);

        // Publish registration event
        rabbitTemplate.convertAndSend("registration-queue", "New " + savedUser.getRole().toLowerCase() + " registered: " + savedUser.getEmail());

        String token = jwtTokenProvider.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole());

        return new AuthResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getRole(),
                token
        );
    }

    public AuthResponse login(StudentLoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            throw new UnauthorizedException("Invalid email or password");
        }
        
        User user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());

        return new AuthResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                token
        );
    }

    public User getStudentById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No account matches the provided email."));
        
        // Generate secure stateless JWT token payload
        String resetToken = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), "PASSWORD_RESET");
        
        // Push notification event parsing the token and firstName
        rabbitTemplate.convertAndSend("registration-queue", "[PASSWORD-RESET] " + user.getEmail() + "||" + user.getFirstName() + "||" + resetToken);
    }

    public void resetPassword(String token, String newPassword) {
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException("Invalid or expired password reset token. Please request a new link.");
        }
        String email = jwtTokenProvider.getEmailFromToken(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Account associated with reset token was not found."));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void notifyMentorship(String email, String name, String link) {
        rabbitTemplate.convertAndSend("registration-queue", "[ZOOM-ALLOCATION] " + email + "||" + name + "||" + link);
    }
}
