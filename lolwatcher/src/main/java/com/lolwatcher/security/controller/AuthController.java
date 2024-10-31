package com.lolwatcher.security.controller;

import com.lolwatcher.security.dto.LoginRequestDto;
import com.lolwatcher.security.dto.SignupRequestDto;
import com.lolwatcher.security.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // 회원가입 엔드포인트
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequestDto signupRequestDto) {
        authService.signup(signupRequestDto);
        return ResponseEntity.ok("Signup successful");
    }

    // 로그인 엔드포인트
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequestDto loginRequestDto) {
        Map<String, String> tokens = authService.login(loginRequestDto);
        return ResponseEntity.ok(tokens);
    }

    // 개선 방안1: 리프레시 토큰을 DB에 저장하고, 엑세스 토큰이 만료되면 토큰으로 부터 ID를 추출하여 DB에서 리프레쉬토큰을 확인, 이후 다시 리다리렉트로 토큰 발급.
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refreshAccessToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        Map<String, String> tokens = authService.refreshAccessToken(refreshToken);
        return ResponseEntity.ok(tokens);
    }

}
