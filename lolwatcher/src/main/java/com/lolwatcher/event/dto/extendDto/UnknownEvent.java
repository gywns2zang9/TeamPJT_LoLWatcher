package com.lolwatcher.event.dto.extendDto;

import com.lolwatcher.event.dto.abstractDto.LOLEvent;

import java.util.Map;

public class UnknownEvent extends LOLEvent {

    private Map<String, Object> allData;

    public UnknownEvent(Map<String, Object> allData) {
        this.allData = allData;
    }

    @Override
    public boolean isParticipant(int participantId) {
        return false;
    }
}
