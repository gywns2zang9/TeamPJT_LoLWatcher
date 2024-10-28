package com.lolwatcher.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class JwtTokenProvider {

    private final SecretKey secretKey;  // 토큰을 서명할 키 (비밀키)
    private final long validityInMilliseconds; // 1시간 유효 기간 (3600000 밀리초 = 1시간)

    //생성자로 변수를 yml로 부터 받아온다.
    public JwtTokenProvider(@Value("${spring.jwt.secret}")String secretKey,
                            @Value("${spring.jwt.expiration}")Long expiration) {
        this.secretKey = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        this.validityInMilliseconds = expiration;
    }

    // token에서 userId 추출
    public Long getUserId(String token) {
        return Long.parseLong(Jwts.parser()
                .verifyWith(secretKey).build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject());
    }


    // JWT 토큰 생성 메소드
    public String createToken(String username) {
        Map<String, Object> claims = new HashMap<>();  // HashMap으로 Claims 생성

        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)  // 수동으로 생성한 Claims 설정
                .setSubject(username)  // subject 설정
                .setIssuedAt(now)  // 발급 시간
                .setExpiration(validity)  // 만료 시간
                .signWith(SignatureAlgorithm.HS256, secretKey)  // 서명 알고리즘과 비밀 키
                .compact();  // 최종적으로 토큰 생성
    }

    // JWT 토큰의 유효성을 검증하는 메소드
    public boolean validateToken(String token) {
        try {
            // 비밀 키를 사용하여 토큰을 파싱하고 유효성 검증
            Jwts.parser().setSigningKey(secretKey).build().parseClaimsJws(token);
            return true;  // 토큰이 유효하면 true 반환
        }catch (JwtException | IllegalArgumentException e) {
            // 토큰이 유효하지 않거나 만료된 경우 예외 처리
            throw new IllegalArgumentException("Expired or invalid JWT token");  // 커스텀 예외 처리 가능
        }
    }


}
