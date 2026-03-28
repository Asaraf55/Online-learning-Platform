package com.learningplatform.dto;

public class StudentLoginRequest {
    private String email;
    private String password;

    public StudentLoginRequest() {}

    public StudentLoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
