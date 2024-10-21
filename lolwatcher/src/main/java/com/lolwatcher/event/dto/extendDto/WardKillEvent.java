package com.lolwatcher.event.dto.extendDto;

import com.lolwatcher.event.dto.abstractDto.LOLEvent;
import com.lolwatcher.event.dto.subData.WardType;

public class WardKillEvent extends LOLEvent {
    int killerId;
    WardType wardType;

    @Override
    public boolean isParticipant(int participantId) {
        return this.killerId == participantId;
    }

}
