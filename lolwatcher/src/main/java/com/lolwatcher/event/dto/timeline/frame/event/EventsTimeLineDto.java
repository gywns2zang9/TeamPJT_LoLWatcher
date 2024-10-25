package com.lolwatcher.event.dto.timeline.frame.event;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.lolwatcher.event.dto.timeline.frame.common.PositionDto;
import com.lolwatcher.event.dto.timeline.frame.event.sub.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class EventsTimeLineDto {

    private BuildingType buildingType;
    private EventType type;
    private KillType killType;
    private LaneType laneType;
    private LevelUpType levelUpType;
    private List<Integer> assistingParticipantIds;
    private List<Damage> victimDamageDealt, victimDamageReceived;
    private MonsterSubType monsterSubType;
    private MonsterType monsterType;
    private int killerTeamId, teamId, winningTeam; //teamType
    private PositionDto position;
    private TowerType towerType;
    private TransformType transformType;
    private WardType wardType;
    private int actualStartTime;
    private int afterId, beforeId;
    private int bounty, shutdownBounty;
    private int creatorId, goldGain, itemId;
    private int killStreakLength, killerId, multiKillLength, victimId;
    private int level, skillSlot;
    private int participantId;
    private long gameId;
    private long realTimestamp, timestamp;

}
