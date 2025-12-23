package com.vaibhav.service;

import com.vaibhav.model.Product;
import com.vaibhav.model.Review;
import com.vaibhav.model.User;
import com.vaibhav.request.CreateReviewRequest;

import java.util.List;

public interface ReviewService  {
    Review createReview(CreateReviewRequest req,
                        User user,
                        Product product);
    List<Review>getReviewsByProductId(Long productId);
    Review updateReview(Long reviewId,String reviewText, double rating, Long userId) throws Exception;

    void deleteReview(Long reviewId,Long userId) throws Exception;
    Review getReviewById(Long reviewId) throws Exception;
}
