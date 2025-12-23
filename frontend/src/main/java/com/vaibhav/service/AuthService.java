package com.vaibhav.service;

import com.vaibhav.domain.USER_ROLE;
import com.vaibhav.request.LoginRequest;
import com.vaibhav.response.AuthResponse;
import com.vaibhav.response.SignUpRequest;

public interface AuthService {
    void sentLoginOtp(String email, USER_ROLE role) throws Exception;
    String createUser(SignUpRequest req) throws Exception;
    AuthResponse signing(LoginRequest req) throws Exception;
}
