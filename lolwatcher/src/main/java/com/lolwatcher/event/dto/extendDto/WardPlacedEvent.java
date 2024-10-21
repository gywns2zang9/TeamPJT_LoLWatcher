package com.lolwatcher.event.dto.extendDto;

import com.lolwatcher.event.dto.abstractDto.LOLEvent;
import com.lolwatcher.event.dto.subData.WardType;

public class WardPlacedEvent extends LOLEvent {
    int creatorId;
    WardType wardType;

    @Override
    public boolean isParticipant(int participantId) {
        return this.creatorId == participantId;
    }
}
