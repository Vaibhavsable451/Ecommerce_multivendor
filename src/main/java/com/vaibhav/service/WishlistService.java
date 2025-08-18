package com.vaibhav.service;

import com.vaibhav.model.Product;
import com.vaibhav.model.User;
import com.vaibhav.model.Wishlist;

public interface WishlistService {
    Wishlist createWishlist(User user);
    Wishlist getWishlistByUserId(User user);
    Wishlist addProductToWishlist(User user, Product product);

}
