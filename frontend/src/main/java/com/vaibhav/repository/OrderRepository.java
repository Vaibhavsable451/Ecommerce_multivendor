package com.vaibhav.repository;

import com.vaibhav.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository  extends JpaRepository<Order, Long> {

    List<Order> findByUser_Id(Long userId);
    List<Order> findBySellerId(Long sellerId);
}
