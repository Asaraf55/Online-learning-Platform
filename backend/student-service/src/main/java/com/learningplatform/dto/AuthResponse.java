package com.learningplatform.dto;

public class AuthResponse {
    private Long studentId;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String token;

    public AuthResponse() {}

    public AuthResponse(Long studentId, String email, String firstName, String lastName, String role, String token) {
        this.studentId = studentId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.token = token;
    }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
