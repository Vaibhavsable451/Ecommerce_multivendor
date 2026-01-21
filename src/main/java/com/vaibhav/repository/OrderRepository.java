package com.vaibhav.repository;

import com.vaibhav.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository  extends JpaRepository<Order, Long> {

    List<Order> findByUser_Id(Long userId);
    List<Order> findBySellerId(Long sellerId);
    List<Order>findByUserId(Long userId);
    List<Order> findBySellerIdOrderByOrderDateDesc(Long sellerId);
    List<Order> findBySellerIdAndOrderDateBetween(Long sellerId, LocalDateTime startDate, LocalDateTime endDate);


}
