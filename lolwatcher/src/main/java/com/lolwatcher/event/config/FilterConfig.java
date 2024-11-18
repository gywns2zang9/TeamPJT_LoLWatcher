package com.lolwatcher.event.config;

import com.lolwatcher.event.filter.RecordUpdateRequestFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class FilterConfig {

    private final RecordUpdateRequestFilter recordUpdateRequestFilter;

    @Bean
    public FilterRegistrationBean<RecordUpdateRequestFilter> loggingFilter(){
        FilterRegistrationBean<RecordUpdateRequestFilter> registrationBean = new FilterRegistrationBean<>();

        registrationBean.setFilter(recordUpdateRequestFilter);
        registrationBean.addUrlPatterns("/info/*");  // /info/* 모든 요청에 적용하도록 변경

        return registrationBean;
    }
}
