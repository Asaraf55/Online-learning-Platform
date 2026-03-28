package com.learningplatform.listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EnrollmentNotificationListener {

    @RabbitListener(queues = "enrollment-queue")
    public void handleEnrollmentNotification(String message) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String timestamp = LocalDateTime.now().format(formatter);

        System.out.println("[" + timestamp + "] NOTIFICATION (Enrollment): " + message);
        sendNotification("You are successfully enrolled. Details: " + message);
    }

    private void sendNotification(String body) {
        System.out.println("Email sent body: " + body);
    }
}
