package com.lolwatcher.event.dto;

import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Map;

@AllArgsConstructor
public class TimeLineInfo {
    private String endOfGameResult;
    private int frameInterval;
    private long gameId;
    private List<TimeLineFrame> frames;
    private Map<Integer, String> participants;
}
