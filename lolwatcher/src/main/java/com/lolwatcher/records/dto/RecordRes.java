package com.lolwatcher.records.dto;

import lombok.Getter;
import lombok.AllArgsConstructor;

@Getter
@AllArgsConstructor
public class RecordRes {
    private String message;
    private Long remainingMinutes;  // 남은 시간(분)
}