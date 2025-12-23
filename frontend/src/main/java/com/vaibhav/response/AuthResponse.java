package com.vaibhav.response;

import com.vaibhav.domain.USER_ROLE;
import lombok.Data;


@Data
public class AuthResponse {

    private String jwt;
    private String message;
    private USER_ROLE role;
}