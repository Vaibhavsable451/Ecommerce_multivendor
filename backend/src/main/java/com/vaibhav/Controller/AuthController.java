package com.vaibhav.Controller;

import com.vaibhav.domain.USER_ROLE;
import com.vaibhav.model.VerificationCode;
import com.vaibhav.repository.UserRepository;
import com.vaibhav.request.LoginOtpRequest;
import com.vaibhav.request.LoginRequest;
import com.vaibhav.response.ApiResponse;
import com.vaibhav.response.AuthResponse;
import com.vaibhav.response.SignUpRequest;
import com.vaibhav.service.AuthService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
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
    public ResponseEntity<ApiResponse> sendOtpHandler(@RequestBody LoginOtpRequest req) throws Exception {
        authService.sentLoginOtp(req.getEmail(),req.getRole());
        ApiResponse res = new ApiResponse();

        res.setMessage("otp sent successfully");


        return ResponseEntity.ok(res);
    }
    @PostMapping("/signing")
   public ResponseEntity<AuthResponse> loginHandler(@RequestBody LoginRequest req) throws Exception {
        AuthResponse authResponse=authService.signing(req);
        ApiResponse res = new ApiResponse();




       return ResponseEntity.ok(authResponse);
    }
}


