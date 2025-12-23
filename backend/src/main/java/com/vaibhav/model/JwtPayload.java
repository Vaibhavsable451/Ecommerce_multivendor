package com.vaibhav.model;
public class JwtPayload {
    private Long userId;
    private String username;
    // ... other claims ...

    public JwtPayload() {}

    public JwtPayload(Long userId, String username) {
        this.userId = userId;
        this.username = username;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}