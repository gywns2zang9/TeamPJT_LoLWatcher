package com.collect.data.config;

import feign.Client;
import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RiotFeignConfig {

    @Bean
    public Client riotFeignClient() {
        return new Client.Default(null, null);
    }

}
