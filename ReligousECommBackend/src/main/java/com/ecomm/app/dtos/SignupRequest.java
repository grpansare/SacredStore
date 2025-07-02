package com.ecomm.app.dtos;



import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

public class SignupRequest {
    @NotBlank
    @Size(max = 50) // Max size for email
    @Email          // Add @Email validation
    private String email; // Changed from username

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
    
    private String fullname;

    private Set<String> role;

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
    
    

    public String getFullname() {
		return fullname;
	}

	public void setFullname(String fullname) {
		this.fullname = fullname;
	}

	public Set<String> getRole() {
        return this.role;
    }

    public void setRole(Set<String> role) {
        this.role = role;
    }
}