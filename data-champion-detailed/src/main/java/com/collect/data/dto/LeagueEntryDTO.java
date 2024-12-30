package com.collect.data.dto;

import com.collect.data.enumeration.Tier;

public record LeagueEntryDTO(String leagueId,
                             String summonerId,
                             String queueType,
                             Tier tier,
                             String rank,
                             int leaguePoint,
                             int wins,
                             int losses,
                             boolean hotStreak,
                             boolean veteran,
                             boolean freshBlood,
                             boolean inactive
//                             MiniSeriesDTO miniSeries
) {
}

//record MiniSeriesDTO(int losses, String progress, int target, int wins) {}
