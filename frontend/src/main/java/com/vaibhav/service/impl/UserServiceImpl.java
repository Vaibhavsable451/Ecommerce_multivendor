package com.vaibhav.service.impl;

import com.vaibhav.config.JwtProvider;
import com.vaibhav.model.User;
import com.vaibhav.repository.UserRepository;
import com.vaibhav.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    @Override
    public User findUserByJwtToken(String jwt) throws Exception {
        String email = jwtProvider.getEmailFromJwtToken(jwt);

        return this.findUserByEmail(email);
    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        User user = this.userRepository.findByEmail(email);
        if (user == null) {
            throw new Exception("user not found with email -" + email);
        }
        return user;
    }
}