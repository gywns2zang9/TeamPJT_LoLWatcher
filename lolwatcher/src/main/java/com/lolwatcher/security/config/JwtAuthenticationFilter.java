package com.lolwatcher.security.config;


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

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // 로깅을 위한 Logger 객체 생성
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    // JwtTokenProvider와 CustomUserDetailsService를 필드로 정의
    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    // 생성자: JwtTokenProvider와 CustomUserDetailsService를 주입받아 필드에 저장
    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, CustomUserDetailsService customUserDetailsService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.customUserDetailsService = customUserDetailsService;
    }

    // 요청이 들어올 때마다 실행되는 메서드: JWT 토큰의 유효성을 검사함
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        // 요청 헤더에서 JWT 토큰을 추출
        String token = jwtTokenProvider.resolveToken(request);

        try {
            // 토큰이 존재하고 유효한 경우에만 처리
            if (token != null && jwtTokenProvider.validateToken(token)) {
                // 토큰에서 사용자 이름(또는 사용자 ID) 추출
                String username = jwtTokenProvider.getUserName(token);

                // 사용자 정보를 데이터베이스에서 로드
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

                // 사용자 정보를 기반으로 인증 객체 생성
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                // 요청의 세부 정보를 인증 객체에 설정
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 인증 객체를 SecurityContext에 설정하여 인증된 사용자로 처리
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // 유효한 토큰임을 로그에 출력
                logger.info("Access token is valid for user: {}", username);
            }
        } catch (ExpiredJwtException e) {
            // 토큰이 만료된 경우 경고 로그 출력
            logger.warn("Access token has expired: {}", e.getMessage());
        } catch (JwtException e) {
            // 토큰이 잘못된 경우 오류 로그 출력
            logger.error("Invalid access token: {}", e.getMessage());
        }

        // 다음 필터로 요청을 전달하여 계속 처리
        chain.doFilter(request, response);
    }
}