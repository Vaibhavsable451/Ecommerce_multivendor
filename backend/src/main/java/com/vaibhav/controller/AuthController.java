package com.vaibhav.controller;

import com.vaibhav.domain.USER_ROLE;
import com.vaibhav.request.LoginOtpRequest;
import com.vaibhav.request.LoginRequest;
import com.vaibhav.response.ApiResponse;
import com.vaibhav.response.AuthResponse;
import com.vaibhav.response.SignUpRequest;
import com.vaibhav.service.AuthService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailSendException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody SignUpRequest req) throws Exception {
         String jwt=authService.createUser(req);
        AuthResponse res = new AuthResponse();
         res.setJwt(jwt);
        res.setMessage("register success");
        res.setRole(USER_ROLE.ROLE_CUSTOMER);


        return ResponseEntity.ok(res);
    }

    @PostMapping("/sent/login-signup-otp")
    public ResponseEntity<ApiResponse> sendOtpHandler(@RequestBody LoginOtpRequest req) {
        if (req == null || req.getEmail() == null || req.getEmail().isBlank()) {
            ApiResponse res = new ApiResponse();
            res.setMessage("Email is required");
            return ResponseEntity.badRequest().body(res);
        }
        try {
            authService.sentLoginOtp(req.getEmail(), req.getRole());
            ApiResponse res = new ApiResponse();
            res.setMessage("otp sent successfully");
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException e) {
            ApiResponse res = new ApiResponse();
            res.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(res);
        } catch (IllegalStateException e) {
            ApiResponse res = new ApiResponse();
            res.setMessage(e.getMessage());
            return ResponseEntity.status(503).body(res);
        } catch (MailSendException e) {
            ApiResponse res = new ApiResponse();
            res.setMessage("Failed to send OTP email. Configure MAIL_USERNAME and MAIL_PASSWORD (Gmail App Password).");
            return ResponseEntity.status(503).body(res);
        } catch (Exception e) {
            ApiResponse res = new ApiResponse();
            res.setMessage("Failed to send OTP: " + e.getMessage());
            return ResponseEntity.status(500).body(res);
        }
    }
    @PostMapping("/signing")
   public ResponseEntity<AuthResponse> loginHandler(@RequestBody LoginRequest req) throws Exception {
        AuthResponse authResponse=authService.signing(req);
        ApiResponse res = new ApiResponse();




       return ResponseEntity.ok(authResponse);
    }
}


