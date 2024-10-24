package com.lolwatcher.security.jwt;

import com.appletree.security.dto.CustomUserDetails;
import com.appletree.security.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@AllArgsConstructor
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    // AuthenticationManager 클래스에서 검증을 담당
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        // 클라이언트의 요청(request)에서 아이디, 비밀번호 추출
        String account = obtainUsername(request);
        String password = obtainPassword(request);

        // 스프링 시큐리티에서 아이디와 비밀번호를 검증하기 위해서는 token에 담아야 한다.
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(account, password);

        return authenticationManager.authenticate(authToken);
    }

    // 로그인 성공시 실행하는 메소드
    // 여기에서 JWT를 발급
    @Override
    protected void successfulAuthentication(
            HttpServletRequest request, HttpServletResponse response,
            FilterChain filterChain, Authentication authentication
    ) {
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        // UserDetails의 getUsername 메소드는 식별자 String를 타입으로 가져온다.
        // userAuthorization의 식별자는 Long타입이므로 변환
        Long userId = Long.parseLong(customUserDetails.getUsername());

        // token을 생성해서 응답 헤더에 추가
        String accessToken = jwtUtil.generateAccessToken(userId);
        String refreshToken = jwtUtil.generateRefreshToken(userId);

        // 응답 헤더에 엑세스 토큰과 리프레시 토큰 추가
        response.addHeader("Authorization", "Bearer " + accessToken);
        response.addHeader("Authorization", "Bearer " + refreshToken);
    }

    // 로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(
            HttpServletRequest request, HttpServletResponse response,
            AuthenticationException failed
    ) {
        // 로그인 실패시 401 응답코드 반환
        response.setStatus(401);
    }
}


































