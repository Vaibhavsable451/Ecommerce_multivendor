package com.vaibhav.repository;

import com.vaibhav.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CartRepository extends JpaRepository<Cart,Integer> {

    Cart findByUserId(Long id);

}

