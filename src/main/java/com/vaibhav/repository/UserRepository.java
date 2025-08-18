package com.vaibhav.repository;

import com.vaibhav.model.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository  extends JpaRepository<User,Long> {

    User findByEmail(String email);
}
