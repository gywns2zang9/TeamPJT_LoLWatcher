package com.lolwatcher.event.config;

import feign.Client;
import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataAnalyticFeignConfig {

    @Bean
    public Client dataFeignClient() {
        return new Client.Default(null, null);
    }

}


