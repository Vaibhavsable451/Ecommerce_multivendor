package com.vaibhav.Controller;

import com.vaibhav.exception.ProductException;

import com.vaibhav.model.Product;
import com.vaibhav.model.Seller;
import com.vaibhav.request.CreateProductRequest;
import com.vaibhav.service.ProductService;
import com.vaibhav.service.SellerService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/sellers/products")

public class SellerProductController {
    private  final ProductService productService;
    private final SellerService sellerService;

    @GetMapping()
    public ResponseEntity<List<Product>> getProductBySellerId(
            @RequestHeader("Authorization") String jwt) throws Exception {

        Seller seller=sellerService.getSellerProfile(jwt);
        List<Product> products = productService.getProductBySellerId(seller.getId());
        return  new ResponseEntity<>(products, HttpStatus.OK);

    }

    @PostMapping()
    public ResponseEntity<Product> createProduct(
            @RequestBody CreateProductRequest request,
            @RequestHeader("Authorization")String jwt)
            throws Exception {
        System.out.println("error ---------- "+jwt);
        Seller seller=sellerService.getSellerProfile(jwt);
        Product product=productService.createProduct(request,seller);

//
        return  new ResponseEntity<>(product, HttpStatus.CREATED);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        try {
            productService.deleteProduct(productId);
            return  new ResponseEntity<>(HttpStatus.OK);
        }
        catch (ProductException e) {
            return  new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long productId, @RequestBody Product product) throws ProductException {

            Product updateProduct = productService.updateProduct(productId, product);
            return  new ResponseEntity<>(updateProduct, HttpStatus.OK);

    }
}
