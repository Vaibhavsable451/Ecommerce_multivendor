package com.vaibhav.response;

import com.vaibhav.dto.OrderHistory;
import com.vaibhav.model.Cart;
import com.vaibhav.model.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FunctionResponse {
    private String functionName;
    private Cart userCart;
    private OrderHistory orderHistory;
    private Product product;
}
