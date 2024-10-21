package com.lolwatcher.event.dto.extendDto;

import com.lolwatcher.event.dto.abstractDto.LOLEvent;

public class ItemDestroyedEvent extends LOLEvent {
    private int participantId;
    private int itemId;


    @Override
    public boolean isParticipant(int participantId) {
        return this.participantId == participantId;
    }
}
