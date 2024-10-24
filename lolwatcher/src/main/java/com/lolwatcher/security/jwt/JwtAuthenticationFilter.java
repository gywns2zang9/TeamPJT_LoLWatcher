package com.lolwatcher.security.jwt;

import com.appletree.createLog.annotation.Loggable;
import com.appletree.security.service.CustomUserDetailsService;
import com.appletree.security.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;
    // 사용자 정보 캐시를 위한 ConcurrentHashMap
    private final ConcurrentHashMap<Long, UserDetails> userCache;

    @Loggable(groupCode = "DFI")
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // request에서 Authorization 헤더를 찾음
        String authorization = request.getHeader("Authorization");

        // Authorization에 해당하는 값이 존재하지 않거나, "Bearer " 접두사로 시작하지 않는 경우
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 토큰의 접두사를 제거 후 순수한 토큰 내용만 획득
        String token = authorization.split(" ")[1];

        // 토큰의 유효시간 검사
        if (jwtUtil.isExpired(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 토큰에서 userId, role 획득
        Long userId = jwtUtil.getUserId(token);

        UserDetails userDetails = userCache.get(userId);
        if (userDetails == null) {
            // 사용자 정보가 캐시에 없는 경우 실제 사용자 정보를 데이터베이스에서 조회
            userDetails = userDetailsService.loadUserById(userId);
            // 사용자 정보를 캐시에 저장
            userCache.put(userId, userDetails);
        }

        if (userDetails != null) {
            // credentials는 보통 비밀번호
            // 보안상 이미 인증이 완료된 경우에는 비밀번호를 제거
            UsernamePasswordAuthenticationToken authentication
                    = new UsernamePasswordAuthenticationToken(userDetails.getUsername(), null, userDetails.getAuthorities());

            // 세션에 사용자 등록
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}





































