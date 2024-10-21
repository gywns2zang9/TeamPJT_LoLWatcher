package com.lolwatcher.event.dto.subData;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class DamageStats {
    private int magicDamageDone;
    private int magicDamageDoneToChampions;
    private int magicDamageTaken;

    private int physicalDamageDone;
    private int physicalDamageDoneToChampions;
    private int physicalDamageTaken;

    private int totalDamageDone;
    private int totalDamageDoneToChampions;
    private int totalDamageTaken;

    private int trueDamageDone;
    private int trueDamageDoneToChampions;
    private int trueDamageTaken;
}
