package com.lolwatcher.security.dto;

import lombok.Data;

@Data
public class LoginRequestDto {
    private String userId;
    private String password;
}
