package com.lolwatcher.event.dto.record;

import com.lolwatcher.event.enumeration.Division;
import com.lolwatcher.event.enumeration.Tier;

public record RecordUserDto(String championName,
                            String summonerName,
                            String puuid,
                            Tier tier,
                            Division division,
                            int teamId,
                            int kills,
                            int assists,
                            int deaths,
                            int totalMinionsKilled) {
}
