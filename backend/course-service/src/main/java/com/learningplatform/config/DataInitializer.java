package com.learningplatform.config;

import com.learningplatform.entity.Course;
import com.learningplatform.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(CourseRepository courseRepository) {
        return args -> {
            if (courseRepository.count() == 0) {
                Course pythonCourse = new Course(
                        "Python for Beginners",
                        "Learn Python from scratch with hands-on projects.",
                        "John Doe",
                        49.99,
                        10,
                        "Programming",
                        "APPROVED"
                );

                Course javaCourse = new Course(
                        "Advanced Java Programming",
                        "Master Java concepts including threads, collections, and Spring Boot.",
                        "Jane Smith",
                        59.99,
                        15,
                        "Programming",
                        "APPROVED"
                );

                Course dataScienceCourse = new Course(
                        "Data Science with Machine Learning",
                        "Introduction to Data Science using Python, Pandas, and Scikit-Learn.",
                        "Dr. AI",
                        79.99,
                        20,
                        "Data Science",
                        "APPROVED"
                );

                courseRepository.saveAll(List.of(pythonCourse, javaCourse, dataScienceCourse));
                System.out.println("Sample courses initialized!");
            }
        };
    }
}
