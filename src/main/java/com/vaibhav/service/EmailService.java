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

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;

<<<<<<< HEAD
    @org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
    private String fromEmail;
=======
    @Value("${spring.mail.username}")
    private String mailFrom;
>>>>>>> e97625f (Fix Render deployment: database environment variables, CORS origins, and email sender identity)

    public void sendVerificationOtpEmail(String userEmail, String otp, String subject, String text) throws MessagingException {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, "utf-8");

<<<<<<< HEAD
            mimeMessageHelper.setFrom(fromEmail); 
=======
            mimeMessageHelper.setFrom(mailFrom); // Use the configured email address
>>>>>>> e97625f (Fix Render deployment: database environment variables, CORS origins, and email sender identity)
            mimeMessageHelper.setTo(userEmail);
            mimeMessageHelper.setSubject(subject);
            mimeMessageHelper.setText(text, true); // true for HTML content

            javaMailSender.send(mimeMessage);
            System.out.println("Email sent successfully to " + userEmail);

        } catch (MailException e) {
            System.err.println("Error sending email: " + e.getMessage());
            throw new MailSendException("Failed to send email: " + e.getMessage());
        }
    }
}
