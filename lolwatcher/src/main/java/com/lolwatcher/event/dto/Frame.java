package com.lolwatcher.event.dto;

import com.lolwatcher.event.dto.abstractDto.LOLEvent;

import java.util.List;

public class Frame {
    private List<LOLEvent> events;
    private List<Participant> participantFrames;
    private long timestamp;
}
