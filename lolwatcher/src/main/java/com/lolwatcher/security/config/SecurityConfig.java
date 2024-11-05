package com.lolwatcher.security.config;

import com.lolwatcher.security.jwt.JwtAuthenticationFilter;
import com.lolwatcher.security.jwt.JwtTokenProvider;
import com.lolwatcher.security.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
@EnableWebSecurity
public class SecurityConfig {


    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;
    private final ConcurrentHashMap<Long, UserDetails> userCache;

    // 생성자 주입으로 필요한 의존성을 주입
    public SecurityConfig(JwtTokenProvider jwtTokenProvider, CustomUserDetailsService customUserDetailsService, ConcurrentHashMap<Long, UserDetails> userCache) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.customUserDetailsService = customUserDetailsService;
        this.userCache = userCache; // userCache 초기화
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        System.out.println("process 18 - SecurityConfig securityFilterChain");
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable) // CSRF 보호 비활성화 (JWT 사용 시 필요)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션 사용 안함
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/login", "/signup", "/auth/**").permitAll() // 로그인, 회원가입, 인증 관련 경로 허용
                        .anyRequest().authenticated() // 그 외 모든 요청은 인증 필요
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout") // 로그아웃 후 로그인 페이지로 리디렉션
                        .permitAll()
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider, customUserDetailsService, userCache), UsernamePasswordAuthenticationFilter.class); // JWT 필터 추가
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        System.out.println("process 19 - SecurityConfig passwordEncoder");
        return new BCryptPasswordEncoder(); // 비밀번호 암호화
    }

//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(Arrays.asList("https://localhost:3000")); // 허용할 오리진
//        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE")); // 허용할 HTTP 메서드
//        configuration.setAllowedHeaders(Arrays.asList("*")); // 허용할 헤더
//        configuration.setAllowCredentials(true); // 자격 증명 허용
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration); // 모든 경로에 CORS 설정 적용
//        return source;
//    }
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    System.out.println("process 20 - SecurityConfig corsConfigurationSource");
    CorsConfiguration configuration = new CorsConfiguration();

    // 환경 변수에서 도메인 및 포트 가져오기
    String domain = System.getenv("DOMAIN"); // 도메인 주소
    String ec2Ip = System.getenv("EC2_IP"); // EC2 IP 주소
    String frontPort = System.getenv("FRONT_PORT"); // 프론트엔드 포트

    // 허용할 오리진 설정
    configuration.setAllowedOrigins(Arrays.asList(
            domain, // 도메인 주소
            "http://" + ec2Ip + ":" + frontPort, // EC2 IP 주소와 포트 조합
            "https://" + ec2Ip + ":" + frontPort, // EC2 IP 주소와 포트 조합
            "http://localhost:3000", // 로컬 개발 환경의 주소 (React 테스트)
            "http://127.0.0.1:3000"  // 로컬 개발 환경의 주소 (React 테스트)

    ));

    // 허용할 HTTP 메서드 설정
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    // 허용할 헤더 설정
    configuration.setAllowedHeaders(Arrays.asList("*"));
    // 자격 증명 허용 설정
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration); // 모든 경로에 CORS 설정 적용
    return source;
}

}
