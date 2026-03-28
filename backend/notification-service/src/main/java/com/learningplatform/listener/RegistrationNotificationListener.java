package com.learningplatform.listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class RegistrationNotificationListener {

    @Autowired
    private JavaMailSender mailSender;

    @RabbitListener(queues = "registration-queue")
    public void handleRegistrationNotification(String message) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String timestamp = LocalDateTime.now().format(formatter);
        System.out.println("[" + timestamp + "] NOTIFICATION: " + message);
        
        if (message.startsWith("[PASSWORD-RESET]")) {
            String payload = message.substring("[PASSWORD-RESET] ".length());
            String[] parts = payload.split("\\|\\|");
            String userEmail = parts.length > 0 ? parts[0] : "ashrafr53216@gmail.com";
            String userName = parts.length > 1 ? parts[1] : "Student";
            String token = parts.length > 2 ? parts[2] : "security-token";

            String resetLink = "http://localhost:5173/reset-password?token=" + token;
            String body = "Hello " + userName + ",\n\n"
                    + "We received a request to reset the password for your Geeks Learning.io account.\n"
                    + "Please click the secure link below to choose a new password:\n\n"
                    + resetLink + "\n\n"
                    + "If you did not make this request, you can safely ignore this email. Your dashboard remains secured.\n\n"
                    + "Best Regards,\nThe Platform Infrastructure Team";

            sendEmail(userEmail, "Password Reset Request - Learning.io", body);
            
        } else if (message.startsWith("[ZOOM-ALLOCATION]")) {
            String payload = message.substring("[ZOOM-ALLOCATION] ".length());
            String[] parts = payload.split("\\|\\|");
            String userEmail = parts.length > 0 ? parts[0] : "ashrafr53216@gmail.com";
            String userName = parts.length > 1 ? parts[1] : "Student";
            String link = parts.length > 2 ? parts[2] : "";

            String body = "Hello " + userName + ",\n\n"
                    + "Your 1-on-1 Enterprise Mentorship session has been officially allocated and secured by the System Administrator.\n\n"
                    + "Please join your dedicated session using the secure Zoom Meeting link below at your preferred shift time:\n\n"
                    + link + "\n\n"
                    + "Come prepared with your technical questions and deployment architectures.\n\n"
                    + "Best Regards,\nThe Platform Infrastructure Team";

            sendEmail(userEmail, "Mentorship Session Allocated - Learning.io", body);
            
        } else {
            // General Registration Fallback
            String userEmail = "ashrafr53216@gmail.com";
            if (message.contains(": ")) {
                userEmail = message.substring(message.lastIndexOf(": ") + 2);
            }
            sendEmail(userEmail, "Learning.io Platform Alert", "Hello,\n\nAutomatic system alert generated for your account:\n" + message + "\n\nRegards,\nThe Platform Infrastructure");
        }
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom("ashrafr53216@gmail.com");
            mailMessage.setTo(to);
            mailMessage.setSubject(subject);
            mailMessage.setText(body);
            mailSender.send(mailMessage);
            System.out.println("SMTP Email successfully dispatched mapping to: " + to);
        } catch (Exception e) {
            System.err.println("SMTP Client Failed emitting email: " + e.getMessage());
        }
    }
}
