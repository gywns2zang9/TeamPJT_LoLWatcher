package com.lolwatcher.event.converter;


import com.lolwatcher.event.enumeration.Division;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class DivisionConverter implements Converter<String, Division> {
    @Override
    public Division convert(String source) {
        return switch (source.trim().toUpperCase()) {
            case "1", "ONE", "I" -> Division.I;
            case "2", "TWO", "II" -> Division.II;
            case "3", "THREE", "III" -> Division.III;
            case "4", "FOUR", "IV" -> Division.IV;
            default -> throw new IllegalArgumentException("No matching Division for input: " + source);
        };
    }
}