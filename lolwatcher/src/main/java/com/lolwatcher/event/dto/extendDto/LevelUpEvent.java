package com.lolwatcher.event.dto.extendDto;

import com.lolwatcher.event.dto.abstractDto.LOLEvent;

public class LevelUpEvent extends LOLEvent {
    private int participantId;
    private int level;

    @Override
    public boolean isParticipant(int participantId) {
        return this.participantId == participantId;
    }

}
