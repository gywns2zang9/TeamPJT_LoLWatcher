package com.lolwatcher.event.dto.record;

public record RecordUserDto(String championName,
                            String riotIdGameName,
                            int teamId,
                            int kills,
                            int assists,
                            int deaths,
                            int totalMinionsKilled) {
}
