package com.lolwatcher.event.dto.extendDto;

import com.lolwatcher.event.dto.abstractDto.LOLEvent;
import com.lolwatcher.event.dto.extendDto.subData.DragonSubType;
import com.lolwatcher.event.dto.extendDto.subData.MonsterType;
import com.lolwatcher.event.dto.extendDto.subData.Position;

import java.util.List;

public class EliteMonsterKillEvent extends LOLEvent {

    List<Integer> assistingParticipantIds;
    int bounty;
    int killerId;
    int killerTeamId;
    MonsterType monsterType;
    DragonSubType monsterSubType;
    Position position;

    @Override
    public boolean isParticipant(int participantId) {
        if(killerId == participantId) return true;
        else return assistingParticipantIds.contains(participantId);
    }
}
