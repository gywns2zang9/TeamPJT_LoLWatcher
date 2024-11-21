package com.lolwatcher.event.dto;

import com.lolwatcher.event.enumeration.Division;
import com.lolwatcher.event.enumeration.Tier;

public record LeagueEntryDTO(String leagueId,
                             String summonerId,
                             String queueType,
                             Tier tier,
                             Division rank,
                             int leaguePoint,
                             int wins,
                             int losses,
                             boolean hotStreak,
                             boolean veteran,
                             boolean freshBlood,
                             boolean inactive
) {
}
