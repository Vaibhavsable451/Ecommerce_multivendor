package com.vaibhav.controller;


import com.vaibhav.model.User;


import com.vaibhav.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;


import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.HttpStatus;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;


    @GetMapping("/users/profile")
    public ResponseEntity<?> UserProfileHandler(
            @RequestHeader("Authorization")String jwt
        )throws Exception{
        if (jwt == null || !jwt.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
        }
        User user=userService.findUserByJwtToken(jwt);
         System.out.println("jwt -- "+jwt);
        return ResponseEntity.ok(user);
    }
}
