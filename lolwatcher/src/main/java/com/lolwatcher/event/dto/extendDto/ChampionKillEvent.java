package com.lolwatcher.event.dto.extendDto;


import com.lolwatcher.event.dto.abstractDto.LOLEvent;
import com.lolwatcher.event.dto.extendDto.subData.Damage;
import com.lolwatcher.event.dto.extendDto.subData.Position;

import java.util.List;

public class ChampionKillEvent extends LOLEvent {

    private int killerId;
    private int victimId;
    private Position position;
    private List<Integer> assistingParticipantIds;
    private int bounty;
    private int killStreakLength;
    private int shutdownBounty;
    private List<Damage> victimDamageDealt, victimDamageReceived;

    @Override
    public boolean isParticipant(int participantId) {
        if(killerId == participantId) return true;
        else if(victimId == participantId) return true;
        else return assistingParticipantIds.contains(participantId);
    }
}
