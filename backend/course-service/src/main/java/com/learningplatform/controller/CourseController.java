package com.learningplatform.controller;

import com.learningplatform.dto.CourseRequest;
import com.learningplatform.entity.Course;
import com.learningplatform.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody CourseRequest request) {
        Course course = courseService.createCourse(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(course);
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Course>> getPendingCourses() {
        return ResponseEntity.ok(courseService.getPendingCourses());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Course> approveCourse(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.approveCourse(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Course course = courseService.getCourseById(id);
        return ResponseEntity.ok(course);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Course>> getCoursesByCategory(@PathVariable String category) {
        List<Course> courses = courseService.getCoursesByCategory(category);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/instructor/{instructor}")
    public ResponseEntity<List<Course>> getCoursesByInstructor(@PathVariable String instructor) {
        List<Course> courses = courseService.getCoursesByInstructor(instructor);
        return ResponseEntity.ok(courses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody CourseRequest request) {
        Course course = courseService.updateCourse(id, request);
        return ResponseEntity.ok(course);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok("Course deleted successfully");
    }

    @PostMapping("/{id}/resources")
    public ResponseEntity<?> addResource(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        String resourceDetails = body.getOrDefault("details", "New learning materials");
        courseService.addResourceToCourse(id, resourceDetails);
        return ResponseEntity.ok("Resource added and students notified");
    }
}
