package com.lolwatcher.event.dto.extendDto;

import com.lolwatcher.event.dto.abstractDto.LOLEvent;

public class GameEndEvent extends LOLEvent {

    long realTimestamp;
    long gameId;
    int winningTeam;

    @Override
    public boolean isParticipant(int participantId) {
        return false;
    }
}
