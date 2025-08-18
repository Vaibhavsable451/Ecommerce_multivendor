package com.vaibhav.service;

import com.vaibhav.exception.ProductException;
import com.vaibhav.model.Product;
import com.vaibhav.model.Seller;
import com.vaibhav.request.CreateProductRequest;
import org.springframework.data.domain.Page;


import java.util.List;

public interface ProductService {
    public Product createProduct(CreateProductRequest req, Seller seller)throws ProductException;
    public void deleteProduct(Long productId) throws ProductException;
    public Product updateProduct(Long productId,Product product) throws ProductException;
    Product findProductById(Long productId) throws ProductException;
    List<Product> searchProducts(String query);
    public Page<Product> getAllProducts(
       String category,
       String brand,
       String colors,
       String sizes,
       Integer minPrize,
       Integer maxPrice,
       Integer minDiscount,
       String sort,
       String stock,
       Integer pageNumber


       );
    public List<Product> recentlyAddedProduct();
    List<Product> getProductBySellerId(Long sellerId);

}
