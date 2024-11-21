package com.lolwatcher.records.dto;

import lombok.Getter;
import lombok.AllArgsConstructor;

@Getter
@AllArgsConstructor
public class RecordRes {
    // 남은 시간 (초 단위)
    private int remainingSeconds;
}