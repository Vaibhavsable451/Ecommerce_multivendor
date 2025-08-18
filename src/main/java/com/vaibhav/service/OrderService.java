package com.vaibhav.service;

import com.vaibhav.domain.OrderStatus;
import com.vaibhav.model.*;

import java.util.List;
import java.util.Set;

public interface OrderService {

    Set<Order> createOrder(User user, Address shippingAddress, Cart cart);
    Order findOrderById(long id) throws Exception;
    List<Order>usersOrderHistory(Long userId);
    List<Order> sellersOrder(long sellerId);
    Order updateOrderStatus(Long orderId, OrderStatus orderStatus) throws Exception;
    Order cancelOrder(Long orderID,User user) throws Exception;

    OrderItem getOrderItemById(Long id) throws Exception;
}
