package com.vaibhav.service.impl;

import com.vaibhav.domain.USER_ROLE;
import com.vaibhav.model.Seller;
import com.vaibhav.model.User;
import com.vaibhav.repository.SellerRepository;
import com.vaibhav.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class CustomUserServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private static final Logger log = LoggerFactory.getLogger(CustomUserServiceImpl.class);

    private static final String SELLER_PREFIX = "seller_";

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Attempting to load user by username: {}", username);

        if (username.startsWith(SELLER_PREFIX)) {
            String actualUsername = username.substring(SELLER_PREFIX.length());
            log.info("Identified as seller. Actual username: {}", actualUsername);
            Seller seller = sellerRepository.findByEmail(actualUsername);

            if (seller != null) {
                log.info("Seller found: {}", seller.getEmail());
                return buildUserDetails(seller.getEmail(), seller.getPassword(), seller.getRole());
            }
        } else {
            log.info("Identified as user. Username: {}", username);
            User user = userRepository.findByEmail(username);
            if (user != null) {
                log.info("User found: {}", user.getEmail());
                return buildUserDetails(user.getEmail(), user.getPassword(), user.getRole());
            }
        }

        log.error("User or seller not found with email: {}", username);
        throw new UsernameNotFoundException("User or seller not found with email - " + username);
    }

    private UserDetails buildUserDetails(String email, String password, USER_ROLE role) {
        log.info("Building UserDetails for email: {}", email);

        if (email == null || email.trim().isEmpty()) {
            log.error("Email is null or empty");
            throw new IllegalArgumentException("Email cannot be null or empty");
        }

        if (password == null || password.trim().isEmpty()) {
            log.warn("Password is null or empty for user: {}", email);
            // Optional: Allow empty password for OTP-based login
            password = "";
        }

        if (role == null) {
            log.warn("Role is null for user: {}. Assigning default role: ROLE_CUSTOMER", email);
            role = USER_ROLE.ROLE_CUSTOMER;
        }

        List<GrantedAuthority> authorityList = new ArrayList<>();
        authorityList.add(new SimpleGrantedAuthority(role.toString()));

        log.info("UserDetails successfully built for email: {}", email);
        return new org.springframework.security.core.userdetails.User(email, password, authorityList);
    }
}
