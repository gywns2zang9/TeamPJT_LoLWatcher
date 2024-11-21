package com.lolwatcher.event.dto.timeline.frame.participant;

public record DamageStatsDto(int magicDamageDone,
                             int magicDamageDoneToChampions,
                             int magicDamageTaken,
                             int physicalDamageDone,
                             int physicalDamageDoneToChampions,
                             int physicalDamageTaken,
                             int totalDamageDone,
                             int totalDamageDoneToChampions,
                             int totalDamageTaken,
                             int trueDamageDone,
                             int trueDamageDoneToChampions,
                             int trueDamageTaken) {
}
