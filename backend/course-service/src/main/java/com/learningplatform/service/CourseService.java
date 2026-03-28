package com.learningplatform.service;

import com.learningplatform.dto.CourseRequest;
import com.learningplatform.entity.Course;
import com.learningplatform.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.learningplatform.exception.ResourceNotFoundException;
import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private org.springframework.amqp.rabbit.core.RabbitTemplate rabbitTemplate;

    public void addResourceToCourse(Long courseId, String resourceDetails) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        String message = "New resources added to course '" + course.getTitle() + "': " + resourceDetails;
        rabbitTemplate.convertAndSend("course-update-queue", message);
    }

    public Course createCourse(CourseRequest request) {
        Course course = new Course(
                request.getTitle(),
                request.getDescription(),
                request.getInstructor(),
                request.getPrice(),
                request.getDuration(),
                request.getCategory(),
                "PENDING"
        );
        return courseRepository.save(course);
    }

    public Course approveCourse(Long id) {
        Course course = courseRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        course.setStatus("APPROVED");
        return courseRepository.save(course);
    }

    public List<Course> getPendingCourses() {
        return courseRepository.findAll().stream().filter(c -> "PENDING".equals(c.getStatus())).toList();
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll().stream().filter(c -> "APPROVED".equals(c.getStatus())).toList();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
    }

    public List<Course> getCoursesByCategory(String category) {
        return courseRepository.findByCategory(category);
    }

    public List<Course> getCoursesByInstructor(String instructor) {
        return courseRepository.findByInstructor(instructor);
    }

    public Course updateCourse(Long id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setInstructor(request.getInstructor());
        course.setPrice(request.getPrice());
        course.setDuration(request.getDuration());
        course.setCategory(request.getCategory());

        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        courseRepository.delete(course);
    }
}
