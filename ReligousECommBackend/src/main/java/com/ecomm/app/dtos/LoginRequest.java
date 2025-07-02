package com.ecomm.app.dtos;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email; // New import for @Email

public class LoginRequest {
    @NotBlank
    @Email // Add @Email validation for email format
    private String email; // Changed from username

    @NotBlank
    private String password;

    public String getEmail() { // Changed getter
        return email;
    }

    public void setEmail(String email) { // Changed setter
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}