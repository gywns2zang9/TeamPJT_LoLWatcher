package com.lolwatcher.security.dto;

import com.lolwatcher.security.entity.UserAuthorization;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@AllArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final UserAuthorization userAuthorization;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 모든 사용자에게 기본 권한 "ROLE_USER" 부여
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return userAuthorization.getPassword();
    }

    @Override
    public String getUsername() {
        return userAuthorization.getUserID().toString();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;  // 계정 만료 여부 확인 로직이 없으므로 항상 true 반환
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;  // 계정 잠금 여부 확인 로직이 없으므로 항상 true 반환
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;  // 자격 증명 만료 여부 확인 로직이 없으므로 항상 true 반환
    }

    @Override
    public boolean isEnabled() {
        return true;  // 계정 활성화 여부 확인 로직이 없으므로 항상 true 반환
    }
}