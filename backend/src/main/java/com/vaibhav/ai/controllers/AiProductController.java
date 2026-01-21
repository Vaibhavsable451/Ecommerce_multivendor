package com.vaibhav.ai.controllers;

import com.vaibhav.response.ApiResponse;
import com.vaibhav.service.AiProductService;
import org.json.JSONArray;
import org.json.JSONObject;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/ai")
public class AiProductController {

    private final AiProductService productService;

    public AiProductController(AiProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/chat/demo")
    public ApiResponse generate(@RequestParam(
            value = "message",
            defaultValue = "Tell me a joke") String message) throws Exception {

        String ans = productService.simpleChat(message);
        JSONObject messageJson;

        try {
            // Try parsing as JSONObject
            messageJson = new JSONObject(ans);
        } catch (Exception e) {
            // If plain text or invalid JSON, wrap it in expected structure
            messageJson = new JSONObject();
            messageJson.put("candidates", new JSONArray()
                    .put(new JSONObject()
                            .put("content", new JSONObject()
                                    .put("parts", new JSONArray()
                                            .put(new JSONObject().put("text", ans))
                                    )
                            )
                    )
            );
        }

        // Extract text safely
        JSONArray candidates = messageJson.getJSONArray("candidates");
        JSONObject content = candidates.getJSONObject(0).getJSONObject("content");
        JSONArray parts = content.getJSONArray("parts");
        String text = parts.getJSONObject(0).getString("text");

        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage(text);

        return apiResponse;
    }
}
