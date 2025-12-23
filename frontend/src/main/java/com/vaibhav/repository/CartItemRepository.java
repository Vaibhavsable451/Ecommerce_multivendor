package com.vaibhav.repository;

import com.vaibhav.model.Cart;
import com.vaibhav.model.CartItem;
import com.vaibhav.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem,Long> {
            CartItem findByCartAndProductAndSize(Cart cart, Product product, String size);
}
