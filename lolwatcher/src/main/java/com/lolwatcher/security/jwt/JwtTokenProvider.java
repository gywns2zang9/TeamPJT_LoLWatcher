package com.lolwatcher.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.redis.core.RedisTemplate;
import java.time.Duration;


// JwtTokenProvider 클래스에 필드 추가

// JWT 토큰을 생성하고, 검증하는 유틸리티 클래스
@Component//Spring의 애플리케이션 컨텍스트에 빈
public class JwtTokenProvider {


//    private final SecretKey secretKey;  // 토큰을 서명할 키 (비밀키)
//    private final long accessTokenValidity; // 1시간 유효 기간 (3600000 밀리초 = 1시간)
//
//    //생성자로 변수를 yml로 부터 받아온다.
//    public JwtTokenProvider(@Value("${spring.jwt.secret}")String secretKey,
//                            @Value("${spring.jwt.access-token-expiration}")Long acessTokenValidity) {
//
//        this.secretKey = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
//        this.accessTokenValidity = acessTokenValidity;
//    }
    
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

    // token에서 userId 추출
    public Long getUserId(String token) {
        return Long.parseLong(Jwts.parser()
                .verifyWith(secretKey).build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject());
    }

    public String getUserName(String token) {
        Claims claims = parseClaims(token);  // 토큰을 파싱하여 Claims 객체를 얻음
        return claims.getSubject();  // Claims에서 subject(사용자 이름) 정보를 추출
    }
    // 리프레시 토큰 유효기간을 반환하는 메서드 
    @SuppressWarnings("unused")//@Getter 쓰라고 노란줄 뜨는데, 다른 것들도 가져오게 되는게 싫어서 추가. 노란줄 없에는 어노테이션
    public long getRefreshTokenValidity() {
        return refreshTokenValidity;
    }

    // userId를 기준으로 액세스 토큰 생성
    public String createAccessToken(String username) {
        return createToken(username, accessTokenValidity);
    }

    // userId를 기준으로 리프레시 토큰 생성
    public String createRefreshToken(String username) {
        return createToken(username, refreshTokenValidity);
    }


    // JWT 토큰 생성 메소드
    public String createToken(String userId, long validityInMilliseconds) {
        Map<String, Object> claims = new HashMap<>();  // HashMap으로 Claims 생성

        Date now = new Date();
        Date expiration = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)  // 수동으로 생성한 Claims 설정
                .setSubject(userId)  // subject 설정
                .setIssuedAt(now)  // 발급 시간
                .setExpiration(expiration)   // 만료 시간
                .signWith(SignatureAlgorithm.HS256, secretKey)  // 서명 알고리즘과 비밀 키
                .compact();  // 최종적으로 토큰 생성
    }

    // JWT 토큰의 유효성을 검증하는 메소드
    public boolean validateToken(String token) {
        try {
            // 비밀 키를 사용하여 토큰을 파싱하고 유효성 검증
            Jwts.parser()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token);
            return true;  // 토큰이 유효하면 true 반환
        }catch (JwtException | IllegalArgumentException e) {
            // 토큰이 유효하지 않거나 만료된 경우 예외 처리
            throw new IllegalArgumentException("Expired or invalid JWT token");  // 커스텀 예외 처리 가능
        }
    }

    // 토큰에서 Claims를 파싱하여 가져옴
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Refresh Token을 Redis에 저장하는 메서드
    public void saveRefreshToken(String username, String refreshToken) {
        redisTemplate.opsForValue().set(username, refreshToken, Duration.ofMillis(refreshTokenValidity));
    }

    //Refresh Token의 유효성을 검증하는 메서드
    public boolean validateStoredRefreshToken(String username, String refreshToken) {
        String storedToken = redisTemplate.opsForValue().get(username);
        return storedToken != null && storedToken.equals(refreshToken);
    }

    // 클라이언트의 HTTP 요청 헤더에서 jwt를 추출하는 기능
    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 이후의 토큰만 반환
        }
        return null;
    }

}
