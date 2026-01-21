package com.vaibhav.mapper;


import com.vaibhav.dto.OrderDto;
import com.vaibhav.dto.OrderHistory;
import com.vaibhav.dto.OrderItemDto;
import com.vaibhav.dto.UserDto;
import com.vaibhav.domain.OrderStatus;
import com.vaibhav.model.Order;
import com.vaibhav.model.OrderItem;
import com.vaibhav.model.User;

import java.util.List;
import java.util.stream.Collectors;

public class OrderMapper {

    // Maps OrderItem to OrderItemDto
    public static OrderItemDto toOrderItemDto(OrderItem orderItem) {
        if (orderItem == null) {
            return null;
        }

        OrderItemDto orderItemDto = new OrderItemDto();
        orderItemDto.setId(orderItem.getId());
        orderItemDto.setProduct(ProductMapper.toProductDto(orderItem.getProduct()));
        orderItemDto.setSize(orderItem.getSize());
        orderItemDto.setQuantity(orderItem.getQuantity());
        orderItemDto.setMrpPrice(orderItem.getMrpPrice());
        orderItemDto.setSellingPrice(orderItem.getSellingPrice());
//        orderItemDto.setUserId(orderItem.getUser().getId());

        return orderItemDto;
    }

    // Maps OrderItemDto to OrderItem
    public static OrderItem toOrderItem(OrderItemDto orderItemDto) {
        if (orderItemDto == null) {
            return null;
        }

        OrderItem orderItem = new OrderItem();
        orderItem.setId(orderItemDto.getId());
//        orderItem.setProduct(ProductMapper.toProductDto(orderItemDto.getProduct()));
        orderItem.setSize(orderItemDto.getSize());
        orderItem.setQuantity(orderItemDto.getQuantity());
        orderItem.setMrpPrice(orderItemDto.getMrpPrice());
        orderItem.setSellingPrice(orderItemDto.getSellingPrice());

        // Assuming that the User is fetched separately and set here
        return orderItem;
    }

    // Maps Order to OrderDto
    public static OrderDto toOrderDto(Order order) {
        if (order == null) {
            return null;
        }

        OrderDto orderDto = new OrderDto();
        orderDto.setId(order.getId());
        orderDto.setOrderId(order.getOrderId());
        orderDto.setUser(UserMapper.toUserDto(order.getUser()));
        orderDto.setSellerId(order.getSellerId());
        orderDto.setOrderItems(order.getOrderItems().stream().map(OrderMapper::toOrderItemDto).collect(Collectors.toList()));
        orderDto.setShippingAddress(order.getShippingAddress());
        orderDto.setPaymentDetails(order.getPaymentDetails());
        orderDto.setTotalMrpPrice(order.getTotalMrpPrice());
        orderDto.setTotalSellingPrice(order.getTotalSellingPrice());
        orderDto.setDiscount(order.getDiscount());
        orderDto.setOrderStatus(order.getOrderStatus());
        orderDto.setTotalItem(order.getTotalItem());
        orderDto.setPaymentStatus(order.getPaymentStatus());
        orderDto.setOrderDate(order.getOrderDate());
        orderDto.setDeliverDate(order.getDeliverDate());

        return orderDto;
    }

    // Maps OrderDto to Order
    public static Order toOrder(OrderDto orderDto) {
        if (orderDto == null) {
            return null;
        }

        Order order = new Order();
        order.setId(orderDto.getId());
        order.setOrderId(orderDto.getOrderId());
//        order.setUser(UserMapper.toUser(orderDto.getUser()));
        order.setSellerId(orderDto.getSellerId());
//        order.setOrderItems(orderDto.getOrderItems().stream().map(OrderMapper::toOrderItem).collect(Collectors.toList()));
        order.setShippingAddress(orderDto.getShippingAddress());
        order.setPaymentDetails(orderDto.getPaymentDetails());
        order.setTotalMrpPrice(orderDto.getTotalMrpPrice());
        order.setTotalSellingPrice(orderDto.getTotalSellingPrice());
        order.setDiscount(orderDto.getDiscount());
        order.setOrderStatus(orderDto.getOrderStatus());
        order.setTotalItem(orderDto.getTotalItem());
        order.setPaymentStatus(orderDto.getPaymentStatus());
        
        // Don't set orderDate as it's final and auto-set in the entity
        if (orderDto.getDeliverDate() != null) {
            order.setDeliverDate(orderDto.getDeliverDate());
        }

        return order;
    }

    // Maps Order list to OrderHistory
    public static OrderHistory toOrderHistory(List<Order> orders, User user) {
        if (orders == null || user == null) {
            return null;
        }

        OrderHistory orderHistory = new OrderHistory();
        orderHistory.setId(user.getId());
        orderHistory.setUser(UserMapper.toUserDto(user));

        // Convert all orders to OrderDto
        List<OrderDto> orderDtos = orders.stream()
                .map(OrderMapper::toOrderDto)
                .collect(Collectors.toList());

        // Set current orders (non-delivered and non-canceled)
        List<OrderDto> currentOrders = orderDtos.stream()
                .filter(order -> order.getOrderStatus() != OrderStatus.DELIVERED 
                        && order.getOrderStatus() != OrderStatus.CANCELED)
                .collect(Collectors.toList());
        orderHistory.setCurrentOrders(currentOrders);

        // Set order counts
        orderHistory.setTotalOrders(orders.size());
        orderHistory.setCancelledOrders((int) orderDtos.stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.CANCELED)
                .count());
        orderHistory.setCompletedOrders((int) orderDtos.stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.DELIVERED)
                .count());
        orderHistory.setPendingOrders((int) orderDtos.stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.PENDING || 
                        order.getOrderStatus() == OrderStatus.PLACED ||
                        order.getOrderStatus() == OrderStatus.CONFIRMED ||
                        order.getOrderStatus() == OrderStatus.SHIPPED)
                .count());

        return orderHistory;
    }

}
