package com.lolwatcher.event.dto.record;

public record RecordGameInfoDto(long gameEndStamp,
                                long gameDuration,
                                boolean win
                             ) {
}
