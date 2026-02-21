package com.vaibhav.exception;

import com.vaibhav.response.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailSendException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalException {

    private static final Logger log = LoggerFactory.getLogger(GlobalException.class);

    @ExceptionHandler(SellerException.class)
    public ResponseEntity<ErrorDetails> sellerExceptionHandler(SellerException se, WebRequest req) {
        ErrorDetails errorDetails = new ErrorDetails();
        errorDetails.setError(se.getMessage());
        errorDetails.setDetails(req.getDescription(false));
        errorDetails.setTimestamp(LocalDateTime.now());
        return  new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(ProductException.class)
    public ResponseEntity<ErrorDetails> ProductExceptionHandler(ProductException se, WebRequest req) {
        ErrorDetails errorDetails = new ErrorDetails();
        errorDetails.setError(se.getMessage());
        errorDetails.setDetails(req.getDescription(false));
        errorDetails.setTimestamp(LocalDateTime.now());
        return  new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    /** Catches mail send failures and returns JSON so frontend sees real error (e.g. Gmail auth). */
    @ExceptionHandler(MailSendException.class)
    public ResponseEntity<ApiResponse> mailSendExceptionHandler(MailSendException e, WebRequest req) {
        log.error("Mail send failed: {}", e.getMessage(), e);
        ApiResponse res = new ApiResponse();
        res.setMessage("Failed to send OTP email. Check MAIL_USERNAME and MAIL_PASSWORD (use Gmail App Password). " + e.getMessage());
        return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /** Catches any other exception so API always returns JSON (no HTML 500 page). */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> exceptionHandler(Exception e, WebRequest req) {
        log.error("Unhandled exception: {}", e.getMessage(), e);
        ApiResponse res = new ApiResponse();
        res.setMessage("Error: " + (e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName()));
        return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
