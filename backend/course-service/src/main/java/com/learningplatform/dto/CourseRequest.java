package com.learningplatform.dto;

public class CourseRequest {
    private String title;
    private String description;
    private String instructor;
    private Double price;
    private Integer duration;
    private String category;

    public CourseRequest() {}

    public CourseRequest(String title, String description, String instructor, Double price, Integer duration, String category) {
        this.title = title;
        this.description = description;
        this.instructor = instructor;
        this.price = price;
        this.duration = duration;
        this.category = category;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getInstructor() { return instructor; }
    public void setInstructor(String instructor) { this.instructor = instructor; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
