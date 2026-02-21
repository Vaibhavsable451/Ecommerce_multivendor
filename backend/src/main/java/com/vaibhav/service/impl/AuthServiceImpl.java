package com.vaibhav.service.impl;

import com.vaibhav.config.JwtProvider;
import com.vaibhav.domain.USER_ROLE;
import com.vaibhav.model.Cart;
import com.vaibhav.model.Seller;
import com.vaibhav.model.User;
import com.vaibhav.model.VerificationCode;
import com.vaibhav.repository.CartRepository;
import com.vaibhav.repository.SellerRepository;
import com.vaibhav.repository.UserRepository;
import com.vaibhav.repository.VerificationCodeRepository;
import com.vaibhav.request.LoginRequest;
import com.vaibhav.response.AuthResponse;
import com.vaibhav.response.SignUpRequest;
import com.vaibhav.service.AuthService;
import com.vaibhav.service.EmailService;
import com.vaibhav.utils.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CartRepository cartRepository;
    private final JwtProvider jwtProvider;
    private  final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;
    private final CustomUserServiceImpl customUserService;
    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);
    private final SellerRepository sellerRepository;


    @Override
    public void sentLoginOtp(String email, USER_ROLE role) throws Exception {
        String SIGNING_PREFIX ="signing_";
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        try {
            log.info("Sending OTP for email: {}, role: {}", email, role);
            
            if(email.startsWith(SIGNING_PREFIX)){
                email=email.substring(SIGNING_PREFIX.length());
                log.debug("Removed signing prefix, email: {}", email);

                if(USER_ROLE.ROLE_SELLER.equals(role)){
                    Seller seller=sellerRepository.findByEmail(email);
                    if (seller==null){
                        log.warn("Seller not found for email: {}", email);
                        throw new Exception("seller not found");
                    }
                }
                else {
                    log.debug("Checking user existence for email: {}", email);
                    User user=userRepository.findByEmail(email);

                    if(user==null){
                        log.warn("User not found for email: {}", email);
                        throw new Exception("user not exist provided email");
                    }
                }
            }
            
            VerificationCode isExist=verificationCodeRepository.findByEmail(email);
            if(isExist!=null){
                log.debug("Deleting existing OTP for email: {}", email);
                verificationCodeRepository.delete(isExist);
            }
            
            String otp= OtpUtil.generateOtp();
            log.debug("Generated OTP for email: {}", email);
            
            VerificationCode verificationCode=new VerificationCode();
            verificationCode.setOtp(otp);
            verificationCode.setEmail(email);
            verificationCodeRepository.save(verificationCode);
            log.debug("Saved OTP to database for email: {}", email);

            String subject="vaibhav bazaar login/signup otp";
            String text="your login/signup otp is -"+otp;

            emailService.sendVerificationOtpEmail(email,otp,subject,text);
            log.info("OTP email sent successfully to: {}", email);
        } catch (Exception e) {
            log.error("Error in sentLoginOtp for email: {}, role: {} - {}", email, role, e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public String createUser(SignUpRequest req) throws Exception {
        String SIGNING_PREFIX="signing_";

        VerificationCode  verificationCode = verificationCodeRepository.findByEmail(req.getEmail());
        if(verificationCode==null || !verificationCode.getOtp().equals(req.getOtp())){
            throw new Exception("wrong otp___");
        }

        User user = userRepository.findByEmail(req.getEmail());

        if(user==null){
            User createdUser=new User();
            createdUser.setFullName(req.getFullName());
            createdUser.setRole(USER_ROLE.ROLE_CUSTOMER);
            createdUser.setMobile("9373012758");
            createdUser.setPassword(passwordEncoder.encode(req.getOtp()));
            user=userRepository.save(createdUser);


            Cart cart=new Cart();
            cart.setUser(user);
            cartRepository.save(cart);
        }
        List<GrantedAuthority>authorities=new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(USER_ROLE.ROLE_CUSTOMER.toString()));

        Authentication authentication=new UsernamePasswordAuthenticationToken(req.getEmail(),null,authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);



        return jwtProvider.generateToken(authentication);
    }

    @Override
    public AuthResponse signing(LoginRequest req) throws Exception {
       String username=req.getEmail();
       String otp=req.getOtp();
       Authentication authentication=authenticate(username,otp);
       SecurityContextHolder.getContext().setAuthentication(authentication);

       String token=jwtProvider.generateToken(authentication);
       AuthResponse authResponse=new AuthResponse();
       authResponse.setJwt(token
       );
       authResponse.setMessage("Login Success");
       Collection<? extends GrantedAuthority> authorities=authentication.getAuthorities();
       String roleName=authorities.isEmpty()?null:authorities.iterator().next().getAuthority();
       authResponse.setRole(USER_ROLE.valueOf(roleName));
       return authResponse;

}

    private Authentication authenticate(String username, String otp) throws Exception {
        UserDetails userDetails=customUserService.loadUserByUsername(username);
        String SELLER_PREFIX = "seller_";
        if (username.startsWith(SELLER_PREFIX)) {
            username=username.substring(SELLER_PREFIX.length());
        }
        if(userDetails==null){
            throw new BadCredentialsException("invalid username");

        }
        VerificationCode verificationCode=verificationCodeRepository.findByEmail(username);
        System.out.println("---"+username+"---"+otp);
        if(verificationCode==null  || !verificationCode.getOtp().equals(otp)){
            throw new Exception("wrong otp");
        }
        return new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
    }
    }
