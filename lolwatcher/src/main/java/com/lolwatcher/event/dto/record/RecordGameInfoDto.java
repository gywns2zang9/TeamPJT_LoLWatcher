package com.lolwatcher.event.dto.record;

import com.lolwatcher.event.enumeration.Division;
import com.lolwatcher.event.enumeration.Tier;

public record RecordGameInfoDto(
                                Tier tier,
                                Division division,
                                int winTeam,
                                long gameEndStamp,
                                long gameDuration
                             ) {
}
