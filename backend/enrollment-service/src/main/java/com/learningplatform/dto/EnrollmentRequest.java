package com.learningplatform.dto;

public class EnrollmentRequest {
    private Long courseId;

    public EnrollmentRequest() {}

    public EnrollmentRequest(Long courseId) {
        this.courseId = courseId;
    }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
}
