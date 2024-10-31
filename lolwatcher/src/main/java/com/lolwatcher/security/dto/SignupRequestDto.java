package com.lolwatcher.security.dto;

import lombok.Data;

@Data
public class SignupRequestDto {
    private String username;
    private String password;
    private String riotId;
    private String riotPassword;
}
