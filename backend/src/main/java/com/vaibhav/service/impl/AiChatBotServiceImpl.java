package com.vaibhav.service.impl;

import com.vaibhav.exception.ProductException;
import com.vaibhav.mapper.OrderMapper;

import com.vaibhav.model.Cart;
import com.vaibhav.model.Order;
import com.vaibhav.model.Product;
import com.vaibhav.model.User;
import com.vaibhav.repository.CartRepository;
import com.vaibhav.repository.OrderRepository;
import com.vaibhav.repository.ProductRepository;
import com.vaibhav.repository.UserRepository;
import com.vaibhav.response.ApiResponse;
import com.vaibhav.response.FunctionResponse;
import com.vaibhav.service.AiChatBotService;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AiChatBotServiceImpl implements AiChatBotService {

    private static final Logger log = LoggerFactory.getLogger(AiChatBotServiceImpl.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    /**
     * Create Gemini function declarations
     */
    private JSONArray createFunctionDeclarations() {
        return new JSONArray()
                .put(new JSONObject()
                        .put("name", "getUserCart")
                        .put("description", "Retrieve the user's cart details")
                        .put("parameters", new JSONObject()
                                .put("type", "OBJECT")
                                .put("properties", new JSONObject()
                                        .put("cart", new JSONObject()
                                                .put("type", "STRING")
                                                .put("description", "Cart details: total items, items, remove items, cart ID")
                                        )
                                )
                                .put("required", new JSONArray().put("cart"))
                        )
                )
                .put(new JSONObject()
                        .put("name", "getUsersOrder")
                        .put("description", "Retrieve the user's order details")
                        .put("parameters", new JSONObject()
                                .put("type", "OBJECT")
                                .put("properties", new JSONObject()
                                        .put("order", new JSONObject()
                                                .put("type", "STRING")
                                                .put("description", "Order details: total, current, delivered, pending, canceled")
                                        )
                                )
                                .put("required", new JSONArray().put("order"))
                        )
                )
                .put(new JSONObject()
                        .put("name", "getProductDetails")
                        .put("description", "Retrieve product details")
                        .put("parameters", new JSONObject()
                                .put("type", "OBJECT")
                                .put("properties", new JSONObject()
                                        .put("product", new JSONObject()
                                                .put("type", "STRING")
                                                .put("description", "Product details: title, id, color, size, price, rating")
                                        )
                                )
                                .put("required", new JSONArray().put("product"))
                        )
                );
    }

    /**
     * Process function calls from Gemini
     */
    private FunctionResponse processFunctionCall(JSONObject functionCall, Long productId, Long userId) throws ProductException {
        String functionName = functionCall.getString("name");

        if (userId == null) {
            throw new ProductException("User ID is required for function: " + functionName);
        }
        if ("getProductDetails".equals(functionName) && productId == null) {
            throw new ProductException("Product ID is required for function: " + functionName);
        }

        FunctionResponse res = new FunctionResponse();
        res.setFunctionName(functionName);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ProductException("User not found"));

        switch (functionName) {
            case "getUserCart":
                Cart cart = cartRepository.findByUserId(userId);
                if (cart == null) {
                    throw new ProductException("Cart not found for user: " + userId);
                }
                log.info("Cart ID: {}", cart.getId());
                res.setUserCart(cart);
                break;

            case "getUsersOrder":
                List<Order> orders = orderRepository.findByUserId(userId);
                res.setOrderHistory(OrderMapper.toOrderHistory(orders, user));
                log.info("Order history: {}", res.getOrderHistory());
                break;

            case "getProductDetails":
                Product product = productRepository.findById(productId)
                        .orElseThrow(() -> new ProductException("Product not found"));
                res.setProduct(product);
                break;

            default:
                throw new IllegalArgumentException("Unsupported function: " + functionName);
        }

        return res;
    }

    /**
     * Call Gemini API to get function response
     */
    public FunctionResponse getFunctionResponse(String prompt, Long productId, Long userId) throws ProductException {
        String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        JSONObject requestBodyJson = new JSONObject()
                .put("contents", new JSONArray()
                        .put(new JSONObject().put("parts", new JSONArray()
                                .put(new JSONObject().put("text", prompt))
                        ))
                )
                .put("tools", new JSONArray()
                        .put(new JSONObject().put("functionDeclarations", createFunctionDeclarations()))
                );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBodyJson.toString(), headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL, requestEntity, String.class);

        JSONObject jsonObject = new JSONObject(response.getBody());

        JSONObject part = jsonObject
                .getJSONArray("candidates")
                .getJSONObject(0)
                .getJSONObject("content")
                .getJSONArray("parts")
                .getJSONObject(0);

        JSONObject functionCall = part.optJSONObject("functionCall");

        if (functionCall != null) {
            return processFunctionCall(functionCall, productId, userId);
        } else {
            FunctionResponse res = new FunctionResponse();
            res.setFunctionName("textResponse");
            return res;
        }
    }

    /**
     * Main AI ChatBot service method
     */
    @Override
    public ApiResponse aiChatBot(String prompt, Long productId, Long userId) throws ProductException {
        log.info("Prompt: {}", prompt);

        FunctionResponse functionResponse = getFunctionResponse(prompt, productId, userId);
        log.info("Function response: {}", functionResponse.getFunctionName());

        // Extract text safely from Gemini response
        String text = "No response from AI";

        try {
            String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

            JSONObject requestBodyJson = new JSONObject()
                    .put("contents", new JSONArray()
                            .put(new JSONObject().put("parts", new JSONArray()
                                    .put(new JSONObject().put("text", prompt))
                            ))
                    );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> requestEntity = new HttpEntity<>(requestBodyJson.toString(), headers);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL, requestEntity, String.class);

            JSONObject jsonObject = new JSONObject(response.getBody());
            JSONArray candidates = jsonObject.optJSONArray("candidates");

            if (candidates != null && candidates.length() > 0) {
                JSONObject firstCandidate = candidates.getJSONObject(0);
                JSONObject content = firstCandidate.optJSONObject("content");
                if (content != null) {
                    JSONArray parts = content.optJSONArray("parts");
                    if (parts != null && parts.length() > 0) {
                        JSONObject firstPart = parts.getJSONObject(0);

                        if (firstPart.has("text")) {
                            text = firstPart.getString("text");
                        } else if (firstPart.has("functionCall")) {
                            JSONObject functionCall = firstPart.getJSONObject("functionCall");
                            String functionName = functionCall.optString("name", "unknownFunction");
                            text = "The AI wants to call function: " + functionName;
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error fetching AI response", e);
            text = "Error: Unable to get response from AI";
        }

        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage(text);
        return apiResponse;
    }
}
