package com.lolwatcher.security.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class LoginReq {
    private String account;
    private String password;
}
