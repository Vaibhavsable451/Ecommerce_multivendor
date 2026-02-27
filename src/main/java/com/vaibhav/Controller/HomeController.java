package com.vaibhav.controller;

import com.vaibhav.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class HomeController {
    private final javax.sql.DataSource dataSource;

    @GetMapping
    public ApiResponse HomeControllerHandler() {
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("welcome to ecommerce multivendor system");

        String dbUrl = System.getenv("DATABASE_URL");
        if (dbUrl != null && dbUrl.startsWith("postgres://")) {
            apiResponse.setMessage(apiResponse.getMessage()
                    + " [CONFIG ALERT: Your DATABASE_URL starts with 'postgres://' but this app uses MySQL. Render's default DB is Postgres. Please use an external MySQL DB or migrate the code to Postgres.]");
        }

        try (java.sql.Connection connection = dataSource.getConnection()) {
            apiResponse.setMessage(apiResponse.getMessage() + " [DB Connected]");
        } catch (Exception e) {
            apiResponse.setMessage(apiResponse.getMessage() + " [DB Connection Error: " + e.getMessage() + "]");
        }

        return apiResponse;
    }
}
