package com.lolwatcher.event.dto.record;

public record RecordUserDto(String championName,
                            String summonerName,
                            String puuid,
                            int teamId,
                            int kills,
                            int assists,
                            int deaths,
                            int totalMinionsKilled) {
}
