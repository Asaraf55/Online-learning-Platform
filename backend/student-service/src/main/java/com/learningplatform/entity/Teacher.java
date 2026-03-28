package com.learningplatform.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("TEACHER")
public class Teacher extends User {

    @Column
    private String institution;

    @Column
    private String registrationNo;

    public Teacher() {}

    public Teacher(String email, String password, String firstName, String lastName, String phoneNo, String institution, String registrationNo) {
        super(email, password, firstName, lastName, phoneNo);
        this.institution = institution;
        this.registrationNo = registrationNo;
    }

    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }

    public String getRegistrationNo() { return registrationNo; }
    public void setRegistrationNo(String registrationNo) { this.registrationNo = registrationNo; }

    @Override
    public String getRole() {
        return "TEACHER";
    }
}
