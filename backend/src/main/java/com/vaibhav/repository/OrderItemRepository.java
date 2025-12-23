package com.vaibhav.repository;

import com.vaibhav.model.Order;

import com.vaibhav.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
