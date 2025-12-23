package com.vaibhav.service.impl;

import com.vaibhav.service.AiProductService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONArray;
import org.json.JSONObject;

@Service
public class AiProductServiceImpl implements AiProductService {

    // Use instance field, not static
    @Value("${gemini.api.key}")
    private String apiKey;

    @Override
    public String simpleChat(String prompt) {
        try {
            String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

            JSONObject requestBody = new JSONObject()
                    .put("contents", new JSONArray()
                            .put(new JSONObject()
                                    .put("role", "user")
                                    .put("parts", new JSONArray()
                                            .put(new JSONObject().put("text", prompt))
                                    )
                            )
                    );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL, request, String.class);

            JSONObject jsonObject = new JSONObject(response.getBody());
            JSONArray candidates = jsonObject.optJSONArray("candidates");

            String text = "No response from AI"; // fallback
            if (candidates != null && candidates.length() > 0) {
                JSONObject firstCandidate = candidates.getJSONObject(0);
                JSONObject content = firstCandidate.optJSONObject("content");
                if (content != null) {
                    JSONArray parts = content.optJSONArray("parts");
                    if (parts != null && parts.length() > 0) {
                        JSONObject firstPart = parts.getJSONObject(0);
                        text = firstPart.optString("text", text);
                    }
                }
            }

            return text;

        } catch (Exception e) {
            e.printStackTrace();
            return "Error: Unable to get response from AI";
        }
    }
}
