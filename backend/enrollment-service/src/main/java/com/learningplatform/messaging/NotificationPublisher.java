package com.learningplatform.messaging;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationPublisher {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void publishEnrollmentNotification(Long studentId, Long courseId, String studentEmail) {
        String message = "Student " + studentId + " (" + studentEmail + ") has enrolled in course " + courseId;
        rabbitTemplate.convertAndSend("enrollment-exchange", "enrollment.key", message);
    }
}
