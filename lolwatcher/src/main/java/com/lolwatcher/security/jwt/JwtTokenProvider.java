package com.lolwatcher.security.jwt;

import com.lolwatcher.security.exception.InvalidTokenException;
import com.lolwatcher.security.exception.TokenExpiredException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import org.springframework.data.redis.core.RedisTemplate;
import java.time.Duration;

// JWT 토큰을 생성하고, 검증하는 유틸리티 클래스
@Component
public class JwtTokenProvider {

    private final SecretKey secretKey;
    private final long accessTokenValidity;   // 액세스 토큰 유효 기간
    private final long refreshTokenValidity;  // 리프레시 토큰 유효 기간
    private final RedisTemplate<String, String> redisTemplate;

    public JwtTokenProvider(@Value("${spring.jwt.secret}") String secretKey,
                            @Value("${spring.jwt.access-token-expiration}") long accessTokenValidity,
                            @Value("${spring.jwt.refresh-token-expiration}") long refreshTokenValidity,
                            RedisTemplate<String, String> redisTemplate) {
        this.secretKey = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        this.accessTokenValidity = accessTokenValidity;
        this.refreshTokenValidity = refreshTokenValidity;
        this.redisTemplate = redisTemplate;
    }

    // token에서 id 추출
    public Long getId(String token) {
        System.out.println("process 3 - provider getId");
        return Long.parseLong(Jwts.parser()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject());
    }

    public String getUserName(String token) {
        System.out.println("process 4 - provider getUserName");
        Claims claims = parseClaims(token);  // 토큰을 파싱하여 Claims 객체를 얻음
        return claims.getSubject();  // Claims에서 subject(사용자 이름) 정보를 추출
    }


    // 리프레시 토큰 유효기간을 반환하는 메서드
    @SuppressWarnings("unused")//@Getter 쓰라고 노란줄 뜨는데, 다른 것들도 가져오게 되는게 싫어서 추가. 노란줄 없에는 어노테이션
    public long getRefreshTokenValidity() {
        return refreshTokenValidity;
    }


    // id를 기준으로 액세스 토큰 생성
    public String createAccessToken(Long id) {
        System.out.println("process 5 - provider createAccessToken");
        return createToken(id, accessTokenValidity);
    }

    // id를 기준으로 리프레시 토큰 생성
    public String createRefreshToken(Long id) {
        System.out.println("process 6 - provider createRefreshToken");
        return createToken(id, refreshTokenValidity);
    }


    // JWT 토큰 생성 메소드
    public String createToken(Long id, long validityInMilliseconds) {
        System.out.println("process 7 - provider createToken class");
        Map<String, Object> claims = new HashMap<>();  // HashMap으로 Claims 생성

        Date now = new Date();
        Date expiration = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)  // 수동으로 생성한 Claims 설정
                .setSubject(String.valueOf(id))  // id를 문자열로 변환하여 subject에 설정
                .setIssuedAt(now)  // 발급 시간
                .setExpiration(expiration)  // 만료 시간
                .signWith(SignatureAlgorithm.HS256, secretKey)  // 서명 알고리즘과 비밀 키
                .compact();  // 최종적으로 토큰 생성
    }

    // JWT 토큰의 유효성을 검증하는 메소드
    public boolean validateToken(String token) {
        System.out.println("process 8 - provider validateToken");
        try {
            Jwts.parser()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            throw new TokenExpiredException("JWT token has expired", e);
        } catch (JwtException | IllegalArgumentException e) {
            throw new InvalidTokenException("JWT token is invalid", e);
        }
    }

    // 토큰에서 Claims를 파싱하여 가져옴
    private Claims parseClaims(String token) {
        System.out.println("process 9 - provider parseClaims");
        return Jwts.parser()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Refresh Token을 Redis에 저장하는 메서드
    public void saveRefreshToken(String username, String refreshToken) {
        System.out.println("process 10 - provider saveRefreshToken");
        redisTemplate.opsForValue().set(username, refreshToken, Duration.ofMillis(refreshTokenValidity));
    }

    // Refresh Token의 유효성을 검증하는 메서드
    public boolean validateStoredRefreshToken(String username, String refreshToken) {
        System.out.println("process 11 - provider validateStoredRefreshToken");
        String storedToken = redisTemplate.opsForValue().get(username);
        return storedToken != null && storedToken.equals(refreshToken);
    }

    // 클라이언트의 HTTP 요청 헤더에서 JWT를 추출하는 기능
    public String resolveToken(HttpServletRequest request) {
        System.out.println("process 12 - provider resolveToken");
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    public String resolveRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
