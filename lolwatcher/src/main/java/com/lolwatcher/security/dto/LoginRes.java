package com.lolwatcher.security.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRes {
    private String accessToken;
    private String refreshToken;
    private String name;

    public static LoginRes fromEntity(UserInfo userInfo, String accessToken, String refreshToken) {
        return LoginRes.builder()
                .name(userInfo.getUserName())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
}
