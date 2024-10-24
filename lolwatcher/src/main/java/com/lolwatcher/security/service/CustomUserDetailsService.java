package com.lolwatcher.security.service;

import com.appletree.createLog.annotation.Loggable;
import com.appletree.security.dto.CustomUserDetails;
import com.appletree.security.entity.UserAuthorization;
import com.appletree.security.repository.UserAuthorizationRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserAuthorizationRepository userAuthorizationRepository;
    @Loggable
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 사용자 정보를 데이터베이스에서 조회하고 CustomUserDetails 객체 반환
        UserAuthorization userAuthorization = userAuthorizationRepository.findByAccount(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not fount with account: " + username));
        return new CustomUserDetails(userAuthorization);
    }
    @Loggable
    public UserDetails loadUserById(Long userId) {
        UserAuthorization userAuthorization = userAuthorizationRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        return new CustomUserDetails(userAuthorization);
    }
}
