package com.lolwatcher.records.dto;

import lombok.Getter;
import lombok.AllArgsConstructor;

@Getter
@AllArgsConstructor
public class RecordRes {
    // 오류 메시지
//    private String message;
    // 남은 시간
    private int remainingMinutes;
}