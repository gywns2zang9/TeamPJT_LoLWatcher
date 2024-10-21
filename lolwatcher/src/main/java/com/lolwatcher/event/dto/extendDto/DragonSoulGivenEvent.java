package com.lolwatcher.event.dto.extendDto;

import com.lolwatcher.event.dto.abstractDto.LOLEvent;

public class DragonSoulGivenEvent extends LOLEvent {
    private int teamId;
    private String name;


    @Override
    public boolean isParticipant(int participantId) {
        return true;
    }
}
