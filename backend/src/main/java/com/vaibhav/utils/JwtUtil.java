package com.vaibhav.utils;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;

public class JwtUtil {
    private static final String SECRET_KEY = "YourSuperSecretKeyForSigningJWTs";

    public static String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .claim("email", email)
                .claim("authorities", "ROLE_CUSTOMER")
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(Date.from(ZonedDateTime.now().plus(4, ChronoUnit.MONTHS).toInstant()))
                //.setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 30 * 4))
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }
}