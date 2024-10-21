package com.lolwatcher.event.dto.extendDto;

import com.lolwatcher.event.dto.abstractDto.LOLEvent;

public class ItemPurchasedEvent extends LOLEvent {
    private int participantId;
    private int itemId;

    @Override
    public boolean isParticipant(int participantId) {
        return participantId == this.participantId;

    }
}
