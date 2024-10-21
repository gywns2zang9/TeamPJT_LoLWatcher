package com.lolwatcher.event.dto.extendDto;

import com.lolwatcher.event.dto.abstractDto.LOLEvent;
import com.lolwatcher.event.dto.extendDto.subData.Position;

public class ChampionSpecialKillEvent extends LOLEvent {
    String killType;
    int killerId;
    int multiKillLength;
    Position position;

    @Override
    public boolean isParticipant(int participantId) {
        return false;
    }
}
