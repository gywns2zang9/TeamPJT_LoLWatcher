package com.lolwatcher.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class UserCacheConfig {

    @Bean
    public ConcurrentHashMap<Long, UserDetails> userCache() {
        return new ConcurrentHashMap<>();
    }
}