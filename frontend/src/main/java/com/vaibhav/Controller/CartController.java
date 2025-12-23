package com.vaibhav.Controller;

import com.vaibhav.exception.ProductException;
import com.vaibhav.model.Cart;
import com.vaibhav.model.CartItem;
import com.vaibhav.model.Product;
import com.vaibhav.model.User;
import com.vaibhav.request.AddItemRequest;
import com.vaibhav.response.ApiResponse;
import com.vaibhav.service.CartItemService;
import com.vaibhav.service.CartService;
import com.vaibhav.service.ProductService;
import com.vaibhav.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;
    private final CartItemService cartItemService;
    private final UserService userService;
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<?> findUserCartHandler(@RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwtToken(jwt);
            Cart cart = cartService.findUserCart(user);

            if (cart == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cart not found for user: " + user.getId());
            }

            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/add")
    public ResponseEntity<?> addItemToCart(@RequestBody AddItemRequest req,
                                           @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwtToken(jwt);
            Product product = productService.findProductById(req.getProductId());

            CartItem item = cartService.addCartItem(user, product, req.getSize(), req.getQuantity());

            return new ResponseEntity<>(item, HttpStatus.ACCEPTED);
        } catch (ProductException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<ApiResponse> deleteCartItemHandler(@PathVariable Long cartItemId,
                                                             @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwtToken(jwt);
            cartItemService.removeCartItem(user.getId(), cartItemId);

            ApiResponse res = new ApiResponse();
            res.setMessage("Item removed from cart successfully");

            return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
        } catch (Exception e) {
            ApiResponse res = new ApiResponse();
            res.setMessage(e.getMessage());
            return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/item/{cartItemId}")
    public ResponseEntity<?> updateCartItemHandler(@PathVariable Long cartItemId,
                                                   @RequestBody CartItem cartItem,
                                                   @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwtToken(jwt);

            if (cartItem.getQuantity() <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Quantity must be greater than zero");
            }

            CartItem updatedCartItem = cartItemService.updateCartItem(user.getId(), cartItemId, cartItem);
            return new ResponseEntity<>(updatedCartItem, HttpStatus.ACCEPTED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}