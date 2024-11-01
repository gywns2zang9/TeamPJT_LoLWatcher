package com.lolwatcher.security.service;

import com.lolwatcher.security.dto.CustomUserDetails;
import com.lolwatcher.security.entity.User;
import com.lolwatcher.security.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


//Spring Security가 사용자 인증을 위해 사용하는 서비스
@Service
@AllArgsConstructor
public class CustomUserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 사용자 정보를 데이터베이스에서 조회하고 CustomUserDetails 객체 반환
        System.out.println("CustomUserDetailsService 클래스의 loadUserByUsername메서드. 사용자 정보를 데이터베이스에서 조회하고 CustomUserDetails 객체 반환");
        User user = userRepository.findByUserId(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        return new CustomUserDetails(user);
    }

    public UserDetails loadUserById(Long userId) {
        System.out.println("CustomUserDetailsService 클래스의 loadUserById 메서드. 유효한 jwt라면 유저 정보를 ㅡ로드");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        return new CustomUserDetails(user);
    }
}
