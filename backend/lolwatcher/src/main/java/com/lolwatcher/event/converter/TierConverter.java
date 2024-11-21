package com.lolwatcher.event.converter;

import com.lolwatcher.event.enumeration.Tier;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class TierConverter implements Converter<String, Tier> {
    @Override
    public Tier convert(String source) {
        return Tier.valueOf(source.trim().toUpperCase());
    }
}