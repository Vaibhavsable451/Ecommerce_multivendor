package com.vaibhav.service;

import com.vaibhav.exception.ProductException;
import com.vaibhav.response.ApiResponse;

public interface AiChatBotService {
    ApiResponse aiChatBot(String prompt, Long productId, Long userId) throws ProductException;
}


