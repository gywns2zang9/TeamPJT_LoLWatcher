package com.lolwatcher.event.dto.extendDto;

import com.lolwatcher.event.dto.abstractDto.LOLEvent;
import com.lolwatcher.event.dto.extendDto.subData.SkillLevelUpType;

public class SkillLevelUpEvent extends LOLEvent {

    private int participantId;
    private int skillSlot;
    private SkillLevelUpType levelUpType;

    @Override
    public boolean isParticipant(int participantId) {
        return this.participantId == participantId;
    }
}
