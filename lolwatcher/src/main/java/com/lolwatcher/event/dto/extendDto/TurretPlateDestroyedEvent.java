package com.lolwatcher.event.dto.extendDto;

import com.lolwatcher.event.dto.abstractDto.LOLEvent;
import com.lolwatcher.event.dto.subData.LaneType;
import com.lolwatcher.event.dto.subData.Position;

public class TurretPlateDestroyedEvent extends LOLEvent {

    private LaneType laneType;
    private Position position;
    private int teamId;
    private int killerId;

    @Override
    public boolean isParticipant(int participantId) {
        return killerId == participantId;
    }
}
