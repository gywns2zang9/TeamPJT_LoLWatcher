package com.collect.data.config;

import feign.Client;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {


    @Bean
    public Client createFeignClient() {
        return new Client.Default(null, null);
    }

}
