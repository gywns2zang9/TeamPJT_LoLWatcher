package com.lolwatcher.event.dto.record;

import com.lolwatcher.event.enumeration.Division;
import com.lolwatcher.event.enumeration.Tier;

public record RecordGameInfoDto(
                                Tier tier,
                                Division division,
                                String  rank,
                                int winTeam,
                                long gameEndStamp,
                                long gameDuration
                             ) {
}
