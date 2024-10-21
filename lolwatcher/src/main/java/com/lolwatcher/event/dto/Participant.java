package com.lolwatcher.event.dto;

import com.lolwatcher.event.dto.subData.ChampionStats;
import com.lolwatcher.event.dto.subData.DamageStats;
import com.lolwatcher.event.dto.subData.Position;

public class Participant {
    private ChampionStats championStats;
    private int currentGold;
    private DamageStats damageStats;
    private int goldPerSecond;
    private int jungleMinionsKilled;
    private int level;
    private int minionsKilled;
    private int participantId;
    private Position position;
    private int timeEnemySpentControlled;
    private int totalGold;
    private int xp;
}
