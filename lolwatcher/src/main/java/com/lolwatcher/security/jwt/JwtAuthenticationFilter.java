package com.lolwatcher.security.jwt;
import com.lolwatcher.security.jwt.JwtTokenProvider;
import com.lolwatcher.security.service.CustomUserDetailsService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // 로깅을 위한 Logger 객체
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;
    private final ConcurrentHashMap<Long, UserDetails> userCache;

    // 생성자를 통해 의존성 주입
    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, CustomUserDetailsService customUserDetailsService, ConcurrentHashMap<Long, UserDetails> userCache) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.customUserDetailsService = customUserDetailsService;
        this.userCache = userCache;
    }

    //이 필터는 요청에 포함된 JWT 토큰을 검사하여 사용자의 인증 상태를 확인. 모든 요청에서 가장 먼저 실행
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        System.out.println("process 2 - JwtAuthenticationFilter");

        // Access Token과 Refresh Token 추출
        String accessToken = jwtTokenProvider.resolveToken(request);
        String refreshToken = jwtTokenProvider.resolveRefreshToken(request); // 새로운 메서드로 Refresh Token 추출

        try {
            if (accessToken != null && jwtTokenProvider.validateToken(accessToken)) {
                // Access Token이 유효한 경우
                handleTokenAuthentication(accessToken, request);
            } else if (refreshToken != null && jwtTokenProvider.validateToken(refreshToken)) {
                // Access Token이 유효하지 않고 Refresh Token이 유효한 경우
                logger.info("Access token is invalid or expired, but refresh token is valid");
                // 필요한 경우 Refresh Token을 기반으로 새로운 Access Token 발급 로직 추가 가능
            } else {
                logger.warn("Both access and refresh tokens are invalid or missing");
            }
        } catch (ExpiredJwtException e) {
            logger.warn("Access token has expired: {}", e.getMessage());
        } catch (JwtException e) {
            logger.error("Invalid access token: {}", e.getMessage());
        }

        chain.doFilter(request, response);
    }

    // 사용자 인증 처리 메서드
    private void handleTokenAuthentication(String token, HttpServletRequest request) {
        Long userId = jwtTokenProvider.getUserId(token);
        UserDetails userDetails = userCache.get(userId);

        if (userDetails == null) {
            // 캐시에 없으면 데이터베이스에서 사용자 정보 로드
            System.out.println("사용자 캐시에 없음");
            String username = jwtTokenProvider.getUserName(token);
            userDetails = customUserDetailsService.loadUserByUsername(username);
            userCache.put(userId, userDetails);
        }

        // 사용자 정보를 기반으로 인증 객체 생성 및 설정
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        // SecurityContext에 인증 정보 설정
        SecurityContextHolder.getContext().setAuthentication(authentication);
        logger.info("Access token is valid for user: {}", userDetails.getUsername());
    }
}