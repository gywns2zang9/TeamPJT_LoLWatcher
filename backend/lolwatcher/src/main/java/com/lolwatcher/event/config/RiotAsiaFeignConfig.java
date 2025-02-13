package com.lolwatcher.event.config;

import feign.Client;
import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RiotAsiaFeignConfig {

    @Value("${riot.lol.api-key}")
    private String apiKey;


    @Bean
    public Client riotAsiaFeignClient() {
        return new Client.Default(null, null);
    }

    @Bean(name = "riotAsiaRequestInterceptor")
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            // API 키를 쿼리 파라미터로 추가
            requestTemplate.query("api_key", apiKey);
        };
    }
}


