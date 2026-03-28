package com.learningplatform.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("STUDENT")
public class Student extends User {

    public Student() {}

    public Student(String email, String password, String firstName, String lastName, String phoneNo) {
        super(email, password, firstName, lastName, phoneNo);
    }

    @Override
    public String getRole() {
        return "STUDENT";
    }
}
