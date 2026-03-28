package com.learningplatform.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("ADMIN")
public class Admin extends User {
    
    public Admin() {}

    public Admin(String email, String password, String firstName, String lastName, String phoneNo) {
        super(email, password, firstName, lastName, phoneNo);
    }

    @Override
    public String getRole() {
        return "ADMIN";
    }
}
