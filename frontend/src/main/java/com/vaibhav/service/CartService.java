package com.vaibhav.service;

import com.vaibhav.model.Cart;
import com.vaibhav.model.CartItem;
import com.vaibhav.model.Product;
import com.vaibhav.model.User;



public interface CartService {
    public CartItem addCartItem(
            User user,
            Product product,
            String size,
            int quantity

    );
    public Cart findUserCart(User user);


    }

