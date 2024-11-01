package com.lolwatcher.security.service;

import com.lolwatcher.security.dto.LoginRequestDto;
import com.lolwatcher.security.dto.SignupRequestDto;
import com.lolwatcher.security.entity.User;
import com.lolwatcher.security.jwt.JwtTokenProvider;
import com.lolwatcher.security.repository.UserRepository;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.redis.core.RedisTemplate;
import java.time.Duration;

@Service
public class AuthService {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, String> redisTemplate;



    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider, RedisTemplate<String, String> redisTemplate) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.redisTemplate = redisTemplate;
    }

    public void signup(SignupRequestDto signupRequestDto) {
        User user = new User();
        user.setUserId(signupRequestDto.getUserId());
        user.setPassword(passwordEncoder.encode(signupRequestDto.getPassword()));
        user.setRiotId(signupRequestDto.getRiotId());
        user.setRiotPassword(passwordEncoder.encode(signupRequestDto.getPassword()));
        userRepository.save(user);
    }

    
    //추후 RSO 연동시 연동된 데이터도 가져오도록 수정
    // 로그인 시 Access Token과 Refresh Token 생성 후 Redis에 Refresh Token 저장
    public Map<String, String> login(LoginRequestDto loginRequestDto) {
        User user = userRepository.findByUserId(loginRequestDto.getUserId())
                .orElseThrow(() -> new UsernameNotFoundException("Invalid username or password"));

        if (!passwordEncoder.matches(loginRequestDto.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        // 액세스 토큰과 리프레시 토큰 생성
        String accessToken = jwtTokenProvider.createAccessToken(user.getUserId());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getUserId());

        // Redis에 Refresh Token 저장 (유효기간을 설정하여 저장)
        redisTemplate.opsForValue().set(user.getUserId(), refreshToken, Duration.ofMillis(jwtTokenProvider.getRefreshTokenValidity()));
        //redisTemplate: Redis와 상호작용하는 데 사용되는 Spring의 도구.Redis 서버와의 데이터 조작(추가, 조회, 삭제 등)
        //opsForValue(): opsForValue()는 Redis의 간단한 키-값 구조를 다루기 위한 메서드. Redis에 **단일 값(String)**을 저장


        // 토큰들을 맵으로 반환
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        return tokens;
    }

    public Map<String, String> refreshAccessToken(String refreshToken) {
        // 리프레시 토크이 유효한지 확인
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid or expired refresh token");
        }

        // 리프레시 토큰에서 사용자 이름을 추출 - 질문: jwtTokenProvider에 getUserName이 없는데
        String username = jwtTokenProvider.getUserName(refreshToken);

        // Redis에 저장된 Refresh Token과 비교
        String storedRefreshToken = redisTemplate.opsForValue().get(username);
        if (storedRefreshToken == null || !storedRefreshToken.equals(refreshToken)) {
            throw new IllegalArgumentException("Refresh token does not match stored token");
        }

        // 새로운 액세스 토큰 생성
        String newAccessToken = jwtTokenProvider.createAccessToken(username);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", newAccessToken);
        tokens.put("refreshToken", refreshToken);  // 기존 리프레시 토큰 유지
        return tokens;
    }

}
