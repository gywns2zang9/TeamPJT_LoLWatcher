package com.collect.data.dto.timeline.frame.participant;


import com.collect.data.dto.timeline.frame.common.PositionDto;

public record ParticipantFrameDto(ChampionStatsDto championStats,
                                  int currentGold,
                                  DamageStatsDto damageStats,
                                  int goldPerSecond,
                                  int jungleMinionsKilled,
                                  int level,
                                  int minionsKilled,
                                  int participantId,
                                  PositionDto position,
                                  int timeEnemySpentControlled,
                                  int totalGold,
                                  int xp) {
}
