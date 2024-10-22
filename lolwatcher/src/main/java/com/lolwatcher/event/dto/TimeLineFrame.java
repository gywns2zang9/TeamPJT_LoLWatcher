package com.lolwatcher.event.dto;

import com.lolwatcher.event.dto.abstractDto.LOLEvent;

import java.util.List;

public class TimeLineFrame {
    private List<LOLEvent> events;
    private List<TimeLineParticipant> participantFrames;
    private long timestamp;
}
