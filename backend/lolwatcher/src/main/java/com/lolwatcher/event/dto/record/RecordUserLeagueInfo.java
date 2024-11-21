package com.lolwatcher.event.dto.record;

import com.lolwatcher.event.enumeration.Division;
import com.lolwatcher.event.enumeration.Tier;

public record RecordUserLeagueInfo(String queueType, Tier tier, Division division, int leaguePoint, int wins, int losses) {
}
