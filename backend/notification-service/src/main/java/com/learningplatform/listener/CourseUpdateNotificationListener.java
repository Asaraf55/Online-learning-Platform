package com.learningplatform.listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class CourseUpdateNotificationListener {

    @RabbitListener(queues = "course-update-queue")
    public void handleCourseUpdateNotification(String message) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String timestamp = LocalDateTime.now().format(formatter);

        System.out.println("[" + timestamp + "] NOTIFICATION (Course Update): " + message);
        sendNotification(message);
    }

    private void sendNotification(String body) {
        // Here we could parse the message which might contain emails or just log it
        System.out.println("Email sent body: " + body);
    }
}
