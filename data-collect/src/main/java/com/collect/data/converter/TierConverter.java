package com.collect.data.converter;

import com.collect.data.enumeration.Division;
import com.collect.data.enumeration.Tier;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class TierConverter implements Converter<String, Tier> {
    @Override
    public Tier convert(String source) {
        return Tier.valueOf(source.trim().toUpperCase());
    }
}