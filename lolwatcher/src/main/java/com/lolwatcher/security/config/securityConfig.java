package com.lolwatcher.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class securityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/api/riot/**").permitAll()  // 로그인 없이 접근 가능한 경로
                                .anyRequest().authenticated()  // 그 외 모든 요청은 인증 필요
                )
                .csrf().disable()  // 필요 시 CSRF 비활성화
                .formLogin().disable();  // 폼 로그인을 비활성화하는 경우

        return http.build();
    }
}
