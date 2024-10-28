package com.lolwatcher.security.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final Long expiration;

    public JwtUtil(
            @Value("${spring.jwt.secret}")String secret,
            @Value("${spring.jwt.expiration}")Long expiration
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
    }

    // token에서 userId 추출
    public Long getUserId(String token) {
        return Long.parseLong(Jwts.parser()
                .verifyWith(secretKey).build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject());
    }

    public String getRole(String token) {
        return Jwts.parser()
                .verifyWith(secretKey).build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class);
    }

    // token에서 만료 시각 추출
    public boolean isExpired(String token) {
        return Jwts.parser()
                .verifyWith(secretKey).build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration()
                .before(new Date());
    }

    // AccessToken발급
    // 유효기간은 15분
    public String generateAccessToken(Long userId) {
        Map<String, Object> claims = new HashMap<>();
            claims.put("role", "ROLE_USER");

        return createToken(claims, userId.toString(), expiration, false);
    }

    // 리프레시 토큰 발급
    // 유효기간은 15일
    public String generateRefreshToken(Long userId) {
        return createToken(new HashMap<>(), userId.toString(), expiration * 4 * 24 * 15, true);
    }

    private String createToken(Map<String, Object> claims, String subject, Long expiration, boolean isRefreshToken) {
        return Jwts.builder()
                .header().add("typ", isRefreshToken ? "refresh" : "access").and()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secretKey)
                .compact();
    }

    // 리프레시 토큰으로 새 엑세스 토큰 발급
    public String refreshAccessToken(String refreshToken) {
        // 리프레시 토큰인지 확인
        if (!"refresh".equals(Jwts.parser()
                .verifyWith(secretKey).build()
                .parseSignedClaims(refreshToken)
                .getHeader()
                .getOrDefault("typ", ""))) {
            throw new IllegalArgumentException("Invalid token type: Expected refresh token");
        }

        // 리프레시 토큰 유효기간 검증
        if (isExpired(refreshToken)) {
            throw new IllegalArgumentException("Refresh token is expired");
        }

        Long userId = getUserId(refreshToken);

        // 새 액세스 토큰 발급
        return generateAccessToken(userId);
    }
}


































