package com.lolwatcher.event.dto.extendDto;

import com.lolwatcher.event.dto.abstractDto.LOLEvent;
import com.lolwatcher.event.dto.extendDto.subData.LaneType;
import com.lolwatcher.event.dto.extendDto.subData.Position;

import java.util.List;

public class BuildingKillEvent extends LOLEvent {
    int killerId;
    List<Integer> assistingParticipantIds;
    int bounty;
    String buildingType;
    String towerType;
    LaneType laneType;
    int teamId;
    Position position;

    @Override
    public boolean isParticipant(int participantId) {
        if(killerId == participantId) return true;
        else return assistingParticipantIds.contains(participantId);
    }
}
