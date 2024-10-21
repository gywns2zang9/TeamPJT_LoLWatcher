package com.lolwatcher.event.dto.extendDto;

import com.lolwatcher.event.dto.abstractDto.LOLEvent;

public class ItemUndoEvent extends LOLEvent {
    private int participantId;
    private int afterId;
    private int beforeId;
    private int goldGain;

    @Override
    public boolean isParticipant(int participantId) {
        return this.participantId == participantId;
    }
}
