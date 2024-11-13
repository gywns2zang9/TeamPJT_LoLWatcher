package com.lolwatcher.event.config;

import com.lolwatcher.event.converter.DivisionConverter;
import com.lolwatcher.event.converter.TierConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final DivisionConverter divisionConverter;
    private final TierConverter tierConverter;

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(divisionConverter);
        registry.addConverter(tierConverter);
    }
}