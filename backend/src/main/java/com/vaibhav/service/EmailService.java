package com.vaibhav.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Value("${spring.mail.username:}")
    private String mailFrom;

    public void sendVerificationOtpEmail(String userEmail, String otp, String subject, String text) throws MessagingException {
        if (mailFrom == null || mailFrom.isBlank()) {
            log.error("MAIL_USERNAME is not set. Set MAIL_USERNAME and MAIL_PASSWORD (Gmail App Password) in environment.");
            throw new IllegalStateException("Mail not configured: MAIL_USERNAME is not set. Set it in Render environment variables and use Gmail App Password for MAIL_PASSWORD.");
        }
        try {
            log.info("Attempting to send OTP email to: {}", userEmail);
            log.debug("Using sender email: {}", mailFrom);
            
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, "utf-8");

            mimeMessageHelper.setFrom(mailFrom); // Use the configured email address from environment variable
            mimeMessageHelper.setTo(userEmail);
            mimeMessageHelper.setSubject(subject);
            mimeMessageHelper.setText(text, true); // true for HTML content

            javaMailSender.send(mimeMessage);
            log.info("Email sent successfully to {}", userEmail);

        } catch (MailException e) {
            log.error("Error sending email to {}: {}", userEmail, e.getMessage(), e);
            throw new MailSendException("Failed to send email: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error sending email to {}: {}", userEmail, e.getMessage(), e);
            throw new MailSendException("Failed to send email: " + e.getMessage(), e);
        }
    }
}
