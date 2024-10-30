package com.lolwatcher.security.service;

import com.lolwatcher.security.dto.LoginRequestDto;
import com.lolwatcher.security.dto.SignupRequestDto;
import com.lolwatcher.security.entity.User;
import com.lolwatcher.security.jwt.JwtTokenProvider;
import com.lolwatcher.security.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AuthService {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public void signup(SignupRequestDto signupRequestDto) {
        User user = new User();
        user.setUsername(signupRequestDto.getUsername());
        user.setPassword(passwordEncoder.encode(signupRequestDto.getPassword()));
        userRepository.save(user);
    }

    public Map<String, String> login(LoginRequestDto loginRequestDto) {
        User user = userRepository.findByUsername(loginRequestDto.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Invalid username or password"));

        if (!passwordEncoder.matches(loginRequestDto.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        // 액세스 토큰과 리프레시 토큰 생성
        String accessToken = jwtTokenProvider.createAccessToken(user.getUsername());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getUsername());

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

        // 새로운 액세스 토큰 생성
        String newAccessToken = jwtTokenProvider.createAccessToken(username);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", newAccessToken);
        tokens.put("refreshToken", refreshToken);  // 기존 리프레시 토큰 유지
        return tokens;
    }

}
