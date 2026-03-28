package com.learningplatform.service;

import com.learningplatform.client.CourseClient;
import com.learningplatform.client.StudentClient;
import com.learningplatform.dto.EnrollmentRequest;
import com.learningplatform.entity.Enrollment;
import com.learningplatform.messaging.NotificationPublisher;
import com.learningplatform.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.learningplatform.exception.BadRequestException;
import com.learningplatform.exception.ResourceNotFoundException;
import com.learningplatform.exception.UnauthorizedException;
import java.util.List;
import java.util.Optional;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private StudentClient studentClient;

    @Autowired
    private CourseClient courseClient;

    @Autowired
    private NotificationPublisher notificationPublisher;

    public Enrollment enrollStudent(Long studentId, EnrollmentRequest request) {
        com.learningplatform.dto.StudentDto studentDto;
        try {
            studentDto = studentClient.getStudent(studentId);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Invalid student");
        }

        try {
            courseClient.getCourse(request.getCourseId());
        } catch (Exception e) {
            throw new ResourceNotFoundException("Invalid course");
        }

        Optional<Enrollment> existingEnrollment = enrollmentRepository.findByStudentIdAndCourseId(
                studentId, request.getCourseId()
        );

        if (existingEnrollment.isPresent()) {
            throw new BadRequestException("Student already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment(studentId, request.getCourseId());
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        notificationPublisher.publishEnrollmentNotification(
                studentId, request.getCourseId(), studentDto.getEmail()
        );

        return savedEnrollment;
    }

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    public List<Enrollment> getStudentEnrollments(Long studentId) {
        try {
            studentClient.getStudent(studentId);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Invalid student");
        }
        return enrollmentRepository.findByStudentId(studentId);
    }

    public List<Enrollment> getCourseEnrollments(Long courseId) {
        try {
            courseClient.getCourse(courseId);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Invalid course");
        }
        return enrollmentRepository.findByCourseId(courseId);
    }

    public void cancelEnrollment(Long enrollmentId, Long studentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));

        if (!enrollment.getStudentId().equals(studentId)) {
            throw new UnauthorizedException("Unauthorized");
        }

        enrollmentRepository.delete(enrollment);
    }
}
