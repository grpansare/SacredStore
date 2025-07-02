package com.ecomm.app.dtos;


import java.util.List;

public class JwtResponse {
    private String token;
    private String refreshToken;
    private String type = "Bearer";
    private Long id;
    private String email; 
    private List<String> roles;

    public JwtResponse(String accessToken, String refreshToken, Long id, String email, List<String> roles) { // Modified constructor
        this.token = accessToken;
        this.refreshToken = refreshToken;
        this.id = id;
        this.email = email; 
        this.roles = roles;
    }

    public String getAccessToken() {
        return token;
    }

    public void setAccessToken(String accessToken) {
        this.token = accessToken;
    }

    public String getTokenType() {
        return type;
    }

    public void setTokenType(String tokenType) {
        this.type = tokenType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() { // Changed getter
        return email;
    }

    public void setEmail(String email) { // Changed setter
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}