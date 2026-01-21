package com.vaibhav.service.impl;

import com.vaibhav.service.ProductDetailsBotService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ProductDetailsBotServiceImpl implements ProductDetailsBotService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta2/models/gemini-2.5-flash:generateContent";

    @Override
    public String productDetailsChatBot(String prompt) {
        try {
            if (prompt == null || prompt.trim().isEmpty()) {
                prompt = "Provide details about this product";
            }

            // Build request JSON for Gemini
            JSONObject requestJson = new JSONObject();
            requestJson.put("model", "gemini-2.5-flash");
            requestJson.put("temperature", 0.7);
            requestJson.put("candidate_count", 1);

            JSONArray contents = new JSONArray();
            JSONObject content = new JSONObject();
            content.put("type", "text");
            content.put("text", prompt);  // must not be empty
            contents.put(content);

            requestJson.put("contents", contents);

            // Send request
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            HttpEntity<String> entity = new HttpEntity<>(requestJson.toString(), headers);
            ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_URL, entity, String.class);

            // Parse Gemini response
            String ans = response.getBody();
            if(ans == null || ans.isEmpty()) return "No response from AI.";

            JSONObject messageJson = new JSONObject(ans);
            JSONArray candidates = messageJson.getJSONArray("candidates");
            JSONObject contentJson = candidates.getJSONObject(0).getJSONObject("content");
            JSONArray parts = contentJson.getJSONArray("parts");
            String text = parts.getJSONObject(0).getString("text");

            return text;

        } catch (Exception e) {
            e.printStackTrace();
            return "Error generating AI response: " + e.getMessage();
        }
    }
}