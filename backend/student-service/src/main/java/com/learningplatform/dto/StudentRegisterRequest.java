package com.learningplatform.dto;

public class StudentRegisterRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String role;
    private String phoneNo;
    private String institution;
    private String registrationNo;
    private String adminCode;

    public StudentRegisterRequest() {}

    public StudentRegisterRequest(String email, String password, String firstName, String lastName, String role, String phoneNo, String institution, String registrationNo, String adminCode) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.phoneNo = phoneNo;
        this.institution = institution;
        this.registrationNo = registrationNo;
        this.adminCode = adminCode;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhoneNo() { return phoneNo; }
    public void setPhoneNo(String phoneNo) { this.phoneNo = phoneNo; }

    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }

    public String getRegistrationNo() { return registrationNo; }
    public void setRegistrationNo(String registrationNo) { this.registrationNo = registrationNo; }

    public String getAdminCode() { return adminCode; }
    public void setAdminCode(String adminCode) { this.adminCode = adminCode; }
}
